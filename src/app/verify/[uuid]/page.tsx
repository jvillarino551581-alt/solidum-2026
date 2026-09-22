import { findRSVPByUUID } from "@/lib/store";
import Link from "next/link";

export default async function VerifyPage({ params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = await params;
  let rsvp = null;
  let error: string | null = null;
  try {
    rsvp = await findRSVPByUUID(uuid);
    if (!rsvp) error = "No RSVP found for this QR code.";
  } catch (e) {
    error = (e as Error).message.includes("Missing") ? "Firebase not configured. Demo mode: QR is valid but not verified against Firestore." : (e as Error).message;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]/55 bg-damask flex flex-col">
      <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg,#9a7b2e,#e8c77a,#9a7b2e)" }} />
      <header className="border-b border-[#c5a254]/20 px-6 py-4 flex justify-between items-center">
        <span className="font-serif tracking-[0.3em] text-sm text-[#c5a254]">SOLIDUM 2026</span>
        <Link href="/" className="text-xs tracking-widest text-[#c0c0c0] hover:text-[#c5a254]">HOME</Link>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="bg-[#141414] border border-[#c5a254]/20 p-8 max-w-lg w-full text-center">
          <p className="text-xs tracking-[0.3em] text-[#c5a254]">QR VERIFICATION</p>
          <p className="font-mono text-xs text-[#c0c0c0]/40 mt-2 break-all">{uuid}</p>
          <div className="h-px bg-[#c5a254]/20 my-6" />
          {error ? (
            <div className="bg-[#6a0d1a]/30 border border-[#6a0d1a] p-4 text-sm text-[#faf7f2]">{error}</div>
          ) : rsvp ? (
            <div className="text-left space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-[#c0c0c0]/60">Name</span><span className="text-[#faf7f2] font-medium">{rsvp.name}</span></div>
              <div className="flex justify-between"><span className="text-[#c0c0c0]/60">Year</span><span className="text-[#faf7f2]">{rsvp.yearLevel}</span></div>
              <div className="flex justify-between"><span className="text-[#c0c0c0]/60">ID</span><span className="font-mono text-[#c5a254]">{rsvp.idNumber}</span></div>
              <div className="flex justify-between"><span className="text-[#c0c0c0]/60">Email</span><span className="text-[#faf7f2]">{rsvp.email}</span></div>
              {rsvp.allergens && <div className="pt-2"><span className="text-[#c0c0c0]/60 text-xs">Allergens:</span><p className="text-[#faf7f2]">{rsvp.allergens}</p></div>}
              <div className="bg-green-900/20 border border-green-800 text-green-300 p-3 text-center mt-4 text-xs tracking-widest">✓ VALID TICKET</div>
            </div>
          ) : null}
          <Link href="/rsvp" className="inline-block mt-6 text-xs tracking-widest border border-[#c5a254]/40 px-6 py-2 text-[#c5a254] hover:bg-[#c5a254]/10">BACK TO RSVP</Link>
        </div>
      </main>
    </div>
  );
}
