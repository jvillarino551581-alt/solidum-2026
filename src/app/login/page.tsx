"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/scan");
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]/55 bg-damask flex flex-col">
      <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg,#9a7b2e,#e8c77a,#9a7b2e)" }} />
      <header className="border-b border-[#c5a254]/20 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-serif tracking-[0.3em] text-sm text-[#c5a254]">SOLIDUM 2026</Link>
        <span className="text-sm tracking-widest text-[#c0c0c0]/50">STAFF ACCESS</span>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <form onSubmit={submit} className="w-full max-w-md bg-[#141414] border border-[#c5a254]/20 p-8">
          <p className="text-center text-sm tracking-[0.4em] text-[#c5a254]">♦</p>
          <h1 className="text-center font-serif text-3xl lg:text-4xl tracking-[0.2em] mt-2">STAFF LOGIN</h1>
          <p className="text-center text-sm text-[#c0c0c0]/50 mt-2">Enter the shared staff password to access Scanner & Dashboard.</p>
          {err && <div className="mt-6 bg-[#6a0d1a]/40 border border-[#6a0d1a] p-3 text-sm text-center">{err}</div>}
          <label className="block mt-6 text-sm tracking-[0.2em] text-[#c5a254]">PASSWORD</label>
          <input type="password" required value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" className="mt-2 w-full bg-[#0a0a0a] border border-[#c0c0c0]/20 px-4 py-3 text-base text-[#faf7f2] placeholder:text-[#c0c0c0]/30 focus:border-[#c5a254]/60 outline-none" />
          <button disabled={loading} className="mt-6 w-full bg-gradient-to-r from-[#6a0d1a] to-[#8b1a2b] border border-[#c5a254]/40 py-3 text-sm tracking-[0.2em] text-white hover:from-[#7a1020] hover:to-[#9b1d30] disabled:opacity-60">
            {loading ? "VERIFYING..." : "ENTER"}
          </button>
          <p className="text-center text-sm text-[#c0c0c0]/30 mt-4">Protected: Scanner + Admin Dashboard</p>
        </form>
      </main>
    </div>
  );
}