import Link from "next/link";

export default function DressCodePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]/55 bg-damask">
      <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg,#9a7b2e,#e8c77a,#9a7b2e)" }} />
      <header className="border-b border-[#c5a254]/20 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-serif tracking-[0.3em] text-sm text-[#c5a254]">SOLIDUM 2026</Link>
        <Link href="/" className="text-sm tracking-widest text-[#c0c0c0] hover:text-[#c5a254]">← BACK TO HOME</Link>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-center">
          <div className="bg-[#141414] border border-[#c5a254]/20 p-4 lg:p-6">
            <img src="/dresscode.png" alt="SOLIDUM 2026 Dress Code Moodboard" className="w-[85vw] max-w-[1400px] h-auto border border-[#c5a254]/30" />
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/rsvp" className="shimmer inline-block bg-gradient-to-r from-[#6a0d1a] to-[#8b1a2b] border border-[#c5a254]/50 px-12 py-5 text-base tracking-[0.25em] text-white hover:from-[#7a1020] hover:to-[#9b1d30] transition">
            RESERVE YOUR SEAT — RSVP
          </Link>
        </div>
      </main>
    </div>
  );
}