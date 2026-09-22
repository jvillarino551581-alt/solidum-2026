"use client";
import { useState } from "react";
import Link from "next/link";

type QrData = { uuid: string; name: string; yearLevel: string; verifyUrl: string; qrDataUrl: string };

export default function MyQrPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qr, setQr] = useState<QrData | null>(null);

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setQr(null);
    try {
      const res = await fetch("/api/myqr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setQr(data);
      }
    } catch (err) {
      setError((err as Error).message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]/55 bg-damask flex flex-col">
      <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg,#9a7b2e,#e8c77a,#9a7b2e)" }} />
      <header className="border-b border-[#c5a254]/20 px-6 py-4 flex justify-between items-center">
        <span className="font-serif tracking-[0.3em] text-sm text-[#c5a254]">SOLIDUM 2026 — MY QR</span>
        <Link href="/" className="text-sm tracking-widest text-[#c0c0c0] hover:text-[#c5a254]">HOME</Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center">
        <p className="text-sm lg:text-base tracking-[0.4em] text-[#c5a254]">♠ — RETRIEVE YOUR TICKET — ♠</p>
        <h1 className="font-serif text-4xl lg:text-5xl tracking-[0.15em] mt-3">GET YOUR QR CODE</h1>
        <p className="text-base lg:text-lg text-[#c0c0c0]/70 mt-2 max-w-xl">Enter the email you used to RSVP — we&apos;ll find your ticket and show your QR code to save.</p>

        {!qr && (
          <form onSubmit={lookup} className="mt-8 w-full max-w-md flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="flex-1 bg-[#141414] border border-[#c0c0c0]/20 px-4 py-3 text-base text-[#faf7f2] placeholder:text-[#c0c0c0]/30 focus:border-[#c5a254]/60 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#c5a254] text-[#0a0a0a] px-8 py-3 text-sm tracking-[0.2em] font-semibold hover:bg-[#e8c77a] transition disabled:opacity-50"
            >
              {loading ? "FINDING…" : "GET MY QR"}
            </button>
          </form>
        )}

        {error && !qr && <p className="mt-6 text-base text-amber-400 max-w-md">{error}</p>}

        {qr && (
          <>
            <div className="mt-8 bg-[#141414] border border-[#c5a254]/20 px-6 py-4 text-sm">
              <p className="text-[#c0c0c0]/60 text-sm tracking-widest">FOUND FOR</p>
              <p className="font-serif text-2xl text-[#faf7f2] mt-1">{qr.name}</p>
              <p className="text-sm text-[#c0c0c0]/50">{qr.yearLevel}</p>
            </div>

            <div className="mt-6 bg-[#faf7f2] p-4 border-4 border-[#c5a254] shadow-[0_0_40px_rgba(197,162,84,0.2)]">
              <img src={qr.qrDataUrl} alt="QR Code" className="w-[280px] h-[280px]" />
            </div>

            <div className="mt-6 max-w-lg text-sm text-[#c0c0c0]/40 break-all px-4">
              Link: <span className="text-[#c5a254]">{qr.verifyUrl}</span>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href={qr.qrDataUrl} download={`SOLIDUM2026-${qr.uuid}.png`} className="bg-[#c5a254] text-[#0a0a0a] px-8 py-3 text-sm tracking-[0.2em] font-semibold hover:bg-[#e8c77a] transition">DOWNLOAD QR</a>
              <button onClick={() => window.print()} className="border border-[#c0c0c0]/30 text-[#c0c0c0] px-8 py-3 text-sm tracking-[0.2em] hover:border-[#c5a254]/50 hover:text-[#c5a254]">PRINT</button>
              <Link href={`/verify/${qr.uuid}`} className="border border-[#c5a254]/30 text-[#c5a254] px-8 py-3 text-sm tracking-[0.2em] hover:bg-[#c5a254]/10">FULL TICKET →</Link>
            </div>

            <button onClick={() => setQr(null)} className="mt-6 text-sm text-[#c0c0c0]/40 hover:text-[#c5a254] underline underline-offset-4">Search a different email</button>
          </>
        )}

        <p className="mt-10 text-sm text-[#c0c0c0]/30">Didn&apos;t RSVP yet? <Link href="/rsvp" className="text-[#c5a254] underline underline-offset-4">Register here</Link> • Keep your QR private — one scan = one check-in.</p>
      </main>
    </div>
  );
}