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
            <img src="/dresscode.png" alt="SOLIDUM 2026 Dress Code Moodboard" className="w-full max-w-[620px] h-auto border border-[#c5a254]/30" />
          </div>
        </div>
      </main>
    </div>
  );
}