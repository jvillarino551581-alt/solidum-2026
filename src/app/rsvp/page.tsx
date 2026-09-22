"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Faculty / Staff"] as const;
const ALLERGEN_OPTIONS = ["Nuts", "Dairy", "Gluten", "Seafood", "Soy", "Eggs", "Shellfish", "None"];

export default function RSVPPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", yearLevel: "1st Year", email: "", idNumber: "", allergens: [] as string[], otherAllergen: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleAllergen(a: string) {
    setForm((f) => ({
      ...f,
      allergens: f.allergens.includes(a) ? f.allergens.filter((x) => x !== a) : [...f.allergens, a],
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const allergensCombined = [...form.allergens, form.otherAllergen.trim()].filter(Boolean);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          yearLevel: form.yearLevel,
          email: form.email,
          idNumber: form.idNumber,
          allergens: allergensCombined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      // store qr for success page
      sessionStorage.setItem("solidum_last_qr", JSON.stringify({ ...data, name: form.name }));
      router.push(`/rsvp/success/${data.uuid}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]/55 bg-damask">
      <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg,#9a7b2e,#e8c77a,#9a7b2e)" }} />
      <header className="border-b border-[#c5a254]/20 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-serif tracking-[0.3em] text-sm text-[#c5a254]">SOLIDUM 2026</Link>
        <Link href="/" className="text-sm tracking-widest text-[#c0c0c0] hover:text-[#c5a254]">← BACK TO HOME</Link>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <p className="text-sm lg:text-base tracking-[0.4em] text-[#c0c0c0]/60">CASINO ROYALE MASQUERADE</p>
          <h1 className="font-serif text-4xl lg:text-5xl tracking-[0.15em] mt-2">R S V P</h1>
          <div className="mx-auto mt-4 h-px w-24 bg-[#c5a254]/40" />
          <p className="text-base text-[#c0c0c0]/70 mt-4">Reserve your place on the red carpet. All fields required.</p>
        </div>

        <form onSubmit={submit} className="bg-[#141414] border border-[#c5a254]/20 p-6 lg:p-8 space-y-6">
          {error && <div className="bg-[#6a0d1a]/40 border border-[#6a0d1a] text-sm p-3 text-[#faf7f2]">{error}</div>}

          <div>
            <label className="text-sm tracking-[0.2em] text-[#c5a254]">FULL NAME</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Juan Dela Cruz" className="mt-2 w-full bg-[#0a0a0a] border border-[#c0c0c0]/20 px-4 py-3 text-base text-[#faf7f2] placeholder:text-[#c0c0c0]/30 focus:border-[#c5a254]/60 outline-none" />
          </div>

          <div>
            <label className="text-sm tracking-[0.2em] text-[#c5a254]">YEAR LEVEL</label>
            <select value={form.yearLevel} onChange={(e) => setForm({ ...form, yearLevel: e.target.value })} className="mt-2 w-full bg-[#0a0a0a] border border-[#c0c0c0]/20 px-4 py-3 text-base text-[#faf7f2] focus:border-[#c5a254]/60 outline-none">
              {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm tracking-[0.2em] text-[#c5a254]">EMAIL ADDRESS</label>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="juan@email.com" className="mt-2 w-full bg-[#0a0a0a] border border-[#c0c0c0]/20 px-4 py-3 text-base text-[#faf7f2] placeholder:text-[#c0c0c0]/30 focus:border-[#c5a254]/60 outline-none" />
            </div>
            <div>
              <label className="text-sm tracking-[0.2em] text-[#c5a254]">ID NUMBER</label>
              <input required value={form.idNumber} onChange={(e) => setForm({ ...form, idNumber: e.target.value })} placeholder="XXXXXX" className="mt-2 w-full bg-[#0a0a0a] border border-[#c0c0c0]/20 px-4 py-3 text-base text-[#faf7f2] placeholder:text-[#c0c0c0]/30 focus:border-[#c5a254]/60 outline-none" />
              <p className="text-sm text-[#c0c0c0]/40 mt-1">Unique 6-digit ID — used for check-in verification</p>
            </div>
          </div>

          <div>
            <label className="text-sm tracking-[0.2em] text-[#c5a254]">ALLERGENS & DIETARY NOTES</label>
            <p className="text-sm text-[#c0c0c0]/50 mt-1">Select any that apply. This helps catering.</p>
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
              {ALLERGEN_OPTIONS.map((a) => (
                <label key={a} className={`cursor-pointer border px-3 py-2 text-sm tracking-widest text-center transition ${form.allergens.includes(a) ? "bg-[#c5a254] text-[#0a0a0a] border-[#c5a254]" : "border-[#c0c0c0]/20 text-[#c0c0c0]/70 hover:border-[#c5a254]/40"}`}>
                  <input type="checkbox" className="hidden" checked={form.allergens.includes(a)} onChange={() => toggleAllergen(a)} />
                  {a.toUpperCase()}
                </label>
              ))}
            </div>
            <input value={form.otherAllergen} onChange={(e) => setForm({ ...form, otherAllergen: e.target.value })} placeholder="Other allergens / notes (optional)" className="mt-3 w-full bg-[#0a0a0a] border border-[#c0c0c0]/20 px-4 py-3 text-base text-[#faf7f2] placeholder:text-[#c0c0c0]/30 focus:border-[#c5a254]/60 outline-none" />
          </div>

          <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-[#6a0d1a] to-[#8b1a2b] border border-[#c5a254]/50 py-4 text-base tracking-[0.2em] text-white hover:from-[#7a1020] hover:to-[#9b1d30] disabled:opacity-60 transition">
            {loading ? "RESERVING..." : "CONFIRM RSVP — GENERATE QR"}
          </button>

          <p className="text-center text-sm text-[#c0c0c0]/40">By RSVPing you agree to present your QR code at the entrance. ♠ ♥ ♦ ♣</p>
        </form>
      </main>
    </div>
  );
}