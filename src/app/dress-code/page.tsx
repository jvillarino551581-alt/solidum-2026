import Link from "next/link";

export default function DressCodePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]/55 bg-damask">
      <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg,#9a7b2e,#e8c77a,#9a7b2e)" }} />
      <header className="border-b border-[#c5a254]/20 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-serif tracking-[0.3em] text-sm text-[#c5a254]">SOLIDUM 2026</Link>
        <Link href="/" className="text-sm tracking-widest text-[#c0c0c0] hover:text-[#c5a254]">← BACK TO HOME</Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <p className="text-sm lg:text-base tracking-[0.4em] text-[#c0c0c0]/60">CASINO ROYALE MASQUERADE</p>
          <h1 className="font-serif text-4xl lg:text-5xl tracking-[0.15em] mt-2">THE DRESS CODE</h1>
          <div className="mx-auto mt-4 h-px w-24 bg-[#c5a254]/40" />
          <p className="text-base text-[#c0c0c0]/70 mt-4">Dress to impress — here is the official reference for the evening.</p>
        </div>

        <div className="flex justify-center">
          <div className="bg-[#141414] border border-[#c5a254]/20 p-4 lg:p-6">
            <img src="/dresscode.png" alt="SOLIDUM 2026 Dress Code" className="w-full max-w-[620px] h-auto border border-[#c5a254]/30" />
          </div>
        </div>

        <div className="mt-10">
          <p className="text-center text-sm tracking-[0.2em] text-[#c5a254]">THE PALETTE</p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "BURGUNDY", hex: "#6a0d1a", swatch: "#6a0d1a" },
              { name: "BLACK", hex: "#0a0a0a", swatch: "#0a0a0a" },
              { name: "SILVER", hex: "#c0c0c0", swatch: "#c0c0c0" },
              { name: "GOLD", hex: "#c5a254", swatch: "#c5a254" },
            ].map((c) => (
              <div key={c.name} className="bg-[#141414] border border-[#c0c0c0]/15 p-4 text-center">
                <div className="h-20 w-full border border-[#c0c0c0]/20" style={{ backgroundColor: c.swatch }} />
                <p className="mt-3 text-sm tracking-[0.2em] text-[#faf7f2]">{c.name}</p>
                <p className="text-xs font-mono text-[#c0c0c0]/50 mt-1">{c.hex}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <span className="border border-[#c0c0c0]/20 px-6 py-3 text-sm tracking-widest text-[#c0c0c0]/70">CASINO ROYALE</span>
          <span className="text-[#c5a254] hidden sm:inline">•</span>
          <span className="border border-[#c0c0c0]/20 px-6 py-3 text-sm tracking-widest text-[#c0c0c0]/70">MASQUERADE</span>
          <span className="text-[#c5a254] hidden sm:inline">•</span>
          <span className="border border-[#c0c0c0]/20 px-6 py-3 text-sm tracking-widest text-[#c0c0c0]/70">RED CARPET</span>
        </div>

        <div className="mt-10 text-center">
          <Link href="/rsvp" className="shimmer inline-block bg-gradient-to-r from-[#6a0d1a] to-[#8b1a2b] border border-[#c5a254]/50 px-12 py-5 text-base tracking-[0.25em] text-white hover:from-[#7a1020] hover:to-[#9b1d30] transition">
            RESERVE YOUR SEAT — RSVP
          </Link>
        </div>
      </main>
    </div>
  );
}