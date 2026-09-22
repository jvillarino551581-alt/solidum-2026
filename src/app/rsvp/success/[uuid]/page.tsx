"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function SuccessPage() {
  const params = useParams<{ uuid: string }>();
  const uuid = params.uuid;
  const [data, setData] = useState<{ qrDataUrl: string; verifyUrl: string; emailSent: string; name?: string } | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("solidum_last_qr");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.uuid === uuid) setData(parsed);
      } catch {}
    }
  }, [uuid]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]/55 bg-damask flex flex-col">
      <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg,#9a7b2e,#e8c77a,#9a7b2e)" }} />
      <header className="border-b border-[#c5a254]/20 px-6 py-4 flex justify-between items-center">
        <span className="font-serif tracking-[0.3em] text-sm text-[#c5a254]">SOLIDUM 2026</span>
        <Link href="/" className="text-sm tracking-widest text-[#c0c0c0] hover:text-[#c5a254]">HOME</Link>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center">
        <p className="text-sm lg:text-base tracking-[0.4em] text-[#c5a254]">♠ — YOU&apos;RE ON THE LIST — ♠</p>
        <h1 className="font-serif text-4xl lg:text-5xl tracking-[0.15em] mt-3">SEE YOU ON THE RED CARPET</h1>
        <p className="text-base lg:text-lg text-[#c0c0c0]/70 mt-2 max-w-xl">Your RSVP is confirmed. Save this QR code — you will need it for check-in on the day of the event. A copy has been sent to your email.</p>

        <div className="mt-8 bg-[#faf7f2] p-4 border-4 border-[#c5a254] shadow-[0_0_40px_rgba(197,162,84,0.2)]">
          {data?.qrDataUrl ? (
            <img src={data.qrDataUrl} alt="QR Code" className="w-[280px] h-[280px]" />
          ) : (
            <div className="w-[280px] h-[280px] flex items-center justify-center bg-white text-[#0a0a0a] text-sm">
              QR will appear here.<br />If you reloaded, check your email.
            </div>
          )}
        </div>

        <div className="mt-6 bg-[#141414] border border-[#c5a254]/20 px-6 py-4 text-sm">
          <p className="text-[#c0c0c0]/60 text-sm tracking-widest">YOUR ID</p>
          <p className="font-mono text-[#c5a254] mt-1 break-all">{uuid}</p>
          {data?.verifyUrl && <p className="text-sm text-[#c0c0c0]/40 mt-2 break-all">{data.verifyUrl}</p>}
          {data?.emailSent && <p className={`text-sm mt-2 ${data.emailSent === "yes" ? "text-green-400" : "text-[#c0c0c0]/40"}`}>Email: {data.emailSent}</p>}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          {data?.qrDataUrl && (
            <a href={data.qrDataUrl} download={`SOLIDUM2026-${uuid}.png`} className="bg-[#c5a254] text-[#0a0a0a] px-8 py-3 text-sm tracking-[0.2em] font-semibold hover:bg-[#e8c77a] transition">DOWNLOAD QR</a>
          )}
          <button onClick={() => window.print()} className="border border-[#c0c0c0]/30 text-[#c0c0c0] px-8 py-3 text-sm tracking-[0.2em] hover:border-[#c5a254]/50 hover:text-[#c5a254]">PRINT</button>
          <Link href="/myqr" className="border border-[#c5a254]/30 text-[#c5a254] px-8 py-3 text-sm tracking-[0.2em] hover:bg-[#c5a254]/10">GET MY QR AGAIN</Link>
          <Link href="/" className="border border-[#c5a254]/30 text-[#c5a254] px-8 py-3 text-sm tracking-[0.2em] hover:bg-[#c5a254]/10">BACK TO HOME</Link>
        </div>

        <p className="mt-6 text-sm text-[#c0c0c0]/30">Keep this QR private. One scan = one check-in. • Questions? Contact organizers.</p>
      </main>
    </div>
  );
}