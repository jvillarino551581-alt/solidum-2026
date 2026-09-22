import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-[#0a0a0a]/55 bg-damask">
      {/* Top thin gold line */}
      <div className="h-[2px] w-full gold-gradient" style={{ background: "linear-gradient(90deg,#9a7b2e,#e8c77a,#9a7b2e)" }} />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 lg:px-10 border-b border-[#c5a254]/20">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full border border-[#c5a254]/50 flex items-center justify-center text-[#c5a254] font-serif text-lg">S</div>
          <span className="font-serif tracking-[0.3em] text-lg text-[#c5a254]">SOLIDUM</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm tracking-[0.2em] text-[#c0c0c0]">
          <Link href="/rsvp" className="hover:text-[#c5a254] transition">RSVP</Link>
          <Link href="/myqr" className="hover:text-[#c5a254] transition">MY QR</Link>
          <Link href="/login" className="hover:text-[#c5a254] transition">STAFF LOGIN</Link>
        </nav>
        <Link href="/login" className="md:hidden text-sm tracking-widest border border-[#c5a254]/40 px-4 py-2 text-[#c5a254]">LOGIN</Link>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:py-20 text-center relative">
        {/* decorative corners */}
        <div className="absolute top-8 left-8 h-16 w-16 border-l border-t border-[#c5a254]/20 hidden lg:block" />
        <div className="absolute top-8 right-8 h-16 w-16 border-r border-t border-[#c5a254]/20 hidden lg:block" />
        <div className="absolute bottom-8 left-8 h-16 w-16 border-l border-b border-[#c5a254]/20 hidden lg:block" />
        <div className="absolute bottom-8 right-8 h-16 w-16 border-r border-b border-[#c5a254]/20 hidden lg:block" />

        <p className="text-sm lg:text-base tracking-[0.4em] text-[#c0c0c0] mb-6">YOU ARE CORDIALLY INVITED</p>

        <div className="flex items-center gap-4 mb-4">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c5a254]/60" />
          <span className="text-[#c5a254] text-2xl">♠ ♥ ♦ ♣</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c5a254]/60" />
        </div>

        <h1 className="font-serif text-6xl lg:text-8xl font-light tracking-[0.15em] text-[#faf7f2] leading-none">
          SOLIDUM
        </h1>
        <p className="font-display italic text-4xl lg:text-6xl text-[#c5a254] -mt-1 mb-3">2026</p>

        <div className="flex items-center gap-3 my-4">
          <div className="h-px w-16 bg-[#c5a254]/40" />
          <span className="text-[#c5a254] text-base lg:text-lg tracking-[0.3em]">♦ — MASQUERADE — ♦</span>
          <div className="h-px w-16 bg-[#c5a254]/40" />
        </div>

        <p className="font-serif text-2xl lg:text-4xl tracking-[0.25em] text-[#faf7f2]/90">CASINO ROYALE</p>
        <p className="text-lg tracking-[0.2em] text-[#c0c0c0] mt-2">AN EVENING OF MYSTERY & ELEGANCE</p>

        <p className="max-w-xl mt-6 text-base lg:text-lg leading-7 text-[#c0c0c0]/80">
          Step onto the red carpet. Don your finest mask. An unforgettable night of glamour, chance, and celebration awaits.
        </p>

        {/* Mask ornament */}
        <div className="mt-8 text-[#c5a254]/30 text-4xl">🎭</div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/rsvp"
            className="shimmer bg-gradient-to-r from-[#6a0d1a] to-[#8b1a2b] border border-[#c5a254]/50 px-12 py-5 text-base lg:text-lg tracking-[0.25em] text-white hover:from-[#7a1020] hover:to-[#9b1d30] transition"
          >
            RESERVE YOUR SEAT — RSVP
          </Link>
        </div>

        <Link href="/myqr" className="mt-5 text-base text-[#c5a254] hover:text-[#e8c77a] tracking-widest underline underline-offset-4">
          ALREADY REGISTERED? GET YOUR QR CODE
        </Link>

        <div className="mt-10 flex items-center gap-6 text-sm tracking-widest text-[#c0c0c0]/50">
          <span>BLACK TIE</span>
          <span className="text-[#c5a254]">•</span>
          <span>MASQUERADE REQUIRED</span>
          <span className="text-[#c5a254]">•</span>
          <span>RED CARPET</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#c5a254]/10 py-6 text-center text-sm tracking-widest text-[#c0c0c0]/40">
        SOLIDUM 2026 — CASINO ROYALE MASQUERADE • BLACK • BURGUNDY • SILVER • GOLD
      </footer>
    </div>
  );
}
