"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

type ScanResult = { type: "success" | "error" | "warn"; msg: string; data?: unknown };
type Camera = { id: string; label: string };
type Attendee = { uuid: string; name: string; yearLevel: string; idNumber: string; email: string; checkInTime?: string };

export default function ScanPage() {
  const [manual, setManual] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [roster, setRoster] = useState<Attendee[]>([]);
  const [rosterError, setRosterError] = useState("");

  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrRef = useRef<{ stop: () => Promise<void> } | null>(null);
  const startedRef = useRef(false);

  const handleCheck = useCallback(async (uuid: string) => {
    setResult(null);
    const clean = String(uuid).trim();
    if (!clean) return;
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuid: clean, scannedBy: "staff" }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ type: "success", msg: `✓ Checked in: ${data.rsvp.name} — ${data.rsvp.yearLevel} (${data.rsvp.idNumber})`, data });
      } else if (res.status === 409) {
        setResult({ type: "warn", msg: `Already checked in at ${new Date(data.existing.checkInTime).toLocaleString()} — ${data.rsvp.name}`, data });
      } else {
        setResult({ type: "error", msg: data.error || "Failed" });
      }
      loadRoster();
    } catch (e) {
      setResult({ type: "error", msg: (e as Error).message });
    }
  }, []);

  const loadRoster = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/data");
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      const attendanceMap = new Map(
        (data.attendance as { uuid: string; checkInTime: string }[]).map((a) => [a.uuid, a.checkInTime])
      );
      const merged: Attendee[] = (data.rsvps as { uuid: string; name: string; yearLevel: string; idNumber: string; email: string }[])
        .map((r) => ({ ...r, checkInTime: attendanceMap.get(r.uuid) }));
      setRoster(merged.sort((a, b) => {
        const aT = a.checkInTime ? new Date(a.checkInTime).getTime() : 0;
        const bT = b.checkInTime ? new Date(b.checkInTime).getTime() : 0;
        if (aT !== bT) return bT - aT;
        return a.name.localeCompare(b.name);
      }));
      setRosterError("");
    } catch (e) {
      setRosterError((e as Error).message);
    }
  }, []);

  async function stopScanner() {
    if (html5QrRef.current) {
      try {
        await html5QrRef.current.stop();
        html5QrRef.current = null;
      } catch {
        /* ignore stop errors */
      }
    }
    startedRef.current = false;
    setScanning(false);
  }

  async function startScanner(cameraId?: string) {
    await stopScanner();
    setResult(null);
    if (!scannerRef.current) return;
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const id = "solidum-qr-reader";
      scannerRef.current.id = id;
      const qr = new Html5Qrcode(id);
      html5QrRef.current = qr as unknown as { stop: () => Promise<void> };

      await qr.start(
        cameraId
          ? { deviceId: { exact: cameraId } }
          : { facingMode: "environment", aspectRatio: 1 },
        {
          fps: 10,
          aspectRatio: 1,
          qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
            const size = Math.min(viewfinderWidth, viewfinderHeight) * 0.7;
            return { width: size, height: size };
          },
        },
        (decoded: string) => {
          handleCheck(decoded);
        },
        () => {}
      );
      startedRef.current = true;
      setScanning(true);
      setCameraError("");
    } catch (e) {
      setCameraError((e as Error).message || "Camera failed. Try selecting another camera or use manual entry.");
      html5QrRef.current = null;
    }
  }

  // load camera list once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const list = await Html5Qrcode.getCameras();
        if (cancelled) return;
        if (list && list.length > 0) {
          setCameras(list);
          const rear =
            list.find((c: Camera) => /back|rear|environment|trás|traseira/i.test(c.label)) ||
            list.find((c: Camera) => /front|selfie/i.test(c.label));
          // do not auto-start; wait for user to pick / fall back to facingMode env
          setSelectedCamera(rear ? rear.id : "");
        }
      } catch {
        /* cameras API unsupported — will fall back to facingMode */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // auto-start on mount (StrictMode-safe: only once until stopped)
  useEffect(() => {
    const el = scannerRef.current;
    if (!el || startedRef.current) return;
    // wait a tick so camera list can be resolved; if not started use facingMode
    const t = setTimeout(() => {
      if (!startedRef.current) {
        startScanner();
      }
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load roster on mount and keep fresh
  useEffect(() => {
    loadRoster();
    const iv = setInterval(loadRoster, 30000);
    return () => clearInterval(iv);
  }, [loadRoster]);

  useEffect(() => {
    return () => {
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]/55 bg-damask flex flex-col">
      <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg,#9a7b2e,#e8c77a,#9a7b2e)" }} />
      <header className="border-b border-[#c5a254]/20 px-6 py-4 flex justify-between items-center">
        <span className="font-serif tracking-[0.3em] text-sm text-[#c5a254]">SOLIDUM 2026 — SCANNER</span>
        <div className="flex gap-4 text-sm tracking-widest">
          <Link href="/admin" className="text-[#c0c0c0] hover:text-[#c5a254]">DASHBOARD</Link>
          <Link href="/" className="text-[#c0c0c0]/50 hover:text-[#c5a254]">HOME</Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="font-serif text-3xl lg:text-4xl tracking-[0.15em]">ATTENDANCE SCANNER</h1>
          <p className="text-base text-[#c0c0c0]/60 mt-2">Point camera at participant QR. One scan = Present.</p>
        </div>

        {/* Camera selector + controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-4">
          {cameras.length > 0 && (
            <select
              value={selectedCamera}
              onChange={(e) => {
                setSelectedCamera(e.target.value);
                startScanner(e.target.value || undefined);
              }}
              className="flex-1 bg-[#0a0a0a] border border-[#c0c0c0]/20 px-4 py-3 text-base text-[#faf7f2] focus:border-[#c5a254]/60 outline-none"
            >
              <option value="">Auto (rear camera)</option>
              {cameras.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          )}
          <button
            onClick={() => startScanner(selectedCamera || undefined)}
            className="border border-[#c5a254]/40 px-6 py-3 text-sm tracking-widest text-[#c5a254] hover:bg-[#c5a254]/10"
          >
            {scanning ? "RESTART CAMERA" : "START CAMERA"}
          </button>
        </div>

        <div className="bg-[#141414] border border-[#c5a254]/20 p-4 flex justify-center">
          <div
            ref={scannerRef}
            id="solidum-qr-reader"
            className="relative w-full max-w-[360px] aspect-square bg-black overflow-hidden"
          />
        </div>
        <div className="min-h-[24px] mt-2">
          {!scanning && !cameraError && <p className="text-center text-sm text-[#c0c0c0]/40">Starting camera…</p>}
          {cameraError && <p className="text-center text-sm text-amber-400">{cameraError}</p>}
          {scanning && <p className="text-center text-sm text-green-400">● Camera active — scanning</p>}
        </div>

        {result && (
          <div className={`mt-2 border p-4 text-base text-center ${result.type === "success" ? "bg-green-900/20 border-green-700 text-green-200" : result.type === "warn" ? "bg-amber-900/20 border-amber-700 text-amber-200" : "bg-[#6a0d1a]/30 border-[#6a0d1a] text-[#faf7f2]"}`}>
            {result.msg}
          </div>
        )}

        <div className="mt-8 bg-[#141414] border border-[#c0c0c0]/10 p-6">
          <p className="text-sm tracking-[0.2em] text-[#c5a254]">MANUAL ENTRY (if camera fails)</p>
          <div className="mt-3 flex gap-2">
            <input
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCheck(manual);
              }}
              placeholder="Paste UUID or full verify URL"
              className="flex-1 bg-[#0a0a0a] border border-[#c0c0c0]/20 px-4 py-3 text-base text-[#faf7f2] placeholder:text-[#c0c0c0]/30 focus:border-[#c5a254]/60 outline-none font-mono"
            />
            <button onClick={() => handleCheck(manual)} className="bg-[#c5a254] text-[#0a0a0a] px-6 py-3 text-sm tracking-[0.2em] font-semibold hover:bg-[#e8c77a]">CHECK IN</button>
          </div>
          <p className="text-sm text-[#c0c0c0]/30 mt-2">Or scan from the email QR — the link contains a unique ticket ID, not the ID Number.</p>
        </div>

        {/* Live attendee list */}
        <div className="mt-8 bg-[#141414] border border-[#c0c0c0]/10 p-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-sm tracking-[0.2em] text-[#c5a254]">
              ATTENDEES — {roster.filter((a) => a.checkInTime).length}/{roster.length} PRESENT
            </p>
            <div className="flex gap-3">
              <button onClick={loadRoster} className="border border-[#c5a254]/40 px-4 py-1 text-xs tracking-widest text-[#c5a254] hover:bg-[#c5a254]/10">REFRESH</button>
              <Link href="/admin" className="border border-[#c0c0c0]/30 px-4 py-1 text-xs tracking-widest text-[#c0c0c0]/70 hover:text-[#c5a254]">FULL LIST →</Link>
            </div>
          </div>

          {rosterError && <p className="text-sm text-amber-400 mt-2">{rosterError}</p>}

          <div className="mt-3 max-h-[420px] overflow-y-auto border border-[#c0c0c0]/10">
            {roster.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-[#c0c0c0]/40">No RSVPs yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-[#0a0a0a] sticky top-0 text-xs tracking-widest text-[#c5a254]">
                  <tr>
                    <th className="px-4 py-2 text-left">NAME</th>
                    <th className="px-4 py-2 text-left">YEAR</th>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">STATUS</th>
                    <th className="px-4 py-2 text-left">TIME</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c0c0c0]/10">
                  {roster.map((a) => (
                    <tr key={a.uuid} className={a.checkInTime ? "bg-green-900/10" : "bg-[#0a0a0a]"}>
                      <td className="px-4 py-2 text-[#faf7f2]">{a.name}</td>
                      <td className="px-4 py-2 text-[#c0c0c0]/70">{a.yearLevel}</td>
                      <td className="px-4 py-2 font-mono text-xs text-[#c5a254]">{a.idNumber}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-0.5 text-xs tracking-widest border ${a.checkInTime ? "border-green-700 text-green-300 bg-green-900/20" : "border-[#c0c0c0]/20 text-[#c0c0c0]/50"}`}>
                          {a.checkInTime ? "PRESENT" : "NOT YET"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-xs font-mono text-[#c0c0c0]/50">{a.checkInTime ? new Date(a.checkInTime).toLocaleTimeString() : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}