import { getAllRSVPs, getAllAttendance } from "@/lib/store";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ q?: string; year?: string }> }) {
  const sp = await searchParams;
  const q = (sp.q || "").toLowerCase();
  const yearFilter = sp.year || "";

  let rsvps: Awaited<ReturnType<typeof getAllRSVPs>> = [];
  let attendance: Awaited<ReturnType<typeof getAllAttendance>> = [];
  let error: string | null = null;
  try {
    [rsvps, attendance] = await Promise.all([getAllRSVPs(), getAllAttendance()]);
  } catch (e) {
    error = (e as Error).message;
  }

  const checkedIds = new Set(attendance.map((a: { uuid: string }) => a.uuid));
  const filtered = rsvps.filter((r: { yearLevel: string; name: string; email: string; idNumber: string; uuid: string }) => {
    if (yearFilter && r.yearLevel !== yearFilter) return false;
    if (!q) return true;
    return r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.idNumber.toLowerCase().includes(q) || r.uuid.toLowerCase().includes(q);
  });

  const total = rsvps.length;
  const checked = attendance.length;
  const remaining = total - checked;

  return (
    <div className="min-h-screen bg-[#0a0a0a]/55 bg-damask">
      <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg,#9a7b2e,#e8c77a,#9a7b2e)" }} />
      <header className="border-b border-[#c5a254]/20 px-6 py-4 flex justify-between items-center">
        <span className="font-serif tracking-[0.3em] text-sm text-[#c5a254]">SOLIDUM 2026 — ADMIN</span>
        <div className="flex gap-4 text-sm tracking-widest">
          <Link href="/scan" className="text-[#c0c0c0] hover:text-[#c5a254]">SCANNER</Link>
          <Link href="/" className="text-[#c0c0c0]/50 hover:text-[#c5a254]">HOME</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="font-serif text-3xl lg:text-4xl tracking-[0.15em]">ATTENDANCE DASHBOARD</h1>
        <p className="text-base text-[#c0c0c0]/50 mt-1">Live from Firebase Firestore — RSVP + Attendance collections</p>

        {error && <div className="mt-6 bg-[#6a0d1a]/30 border border-[#6a0d1a] p-4 text-sm">{error.includes("Missing") ? "Firebase not configured. Set FIREBASE_* env vars to see live data." : error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-[#141414] border border-[#c5a254]/20 p-6 text-center">
            <p className="text-sm tracking-widest text-[#c0c0c0]/60">TOTAL RSVPS</p>
            <p className="text-4xl font-serif text-[#faf7f2] mt-2">{total}</p>
          </div>
          <div className="bg-[#141414] border border-green-800/40 p-6 text-center">
            <p className="text-sm tracking-widest text-green-400/70">CHECKED IN</p>
            <p className="text-4xl font-serif text-green-300 mt-2">{checked}</p>
          </div>
          <div className="bg-[#141414] border border-[#c0c0c0]/20 p-6 text-center">
            <p className="text-sm tracking-widest text-[#c0c0c0]/60">REMAINING</p>
            <p className="text-4xl font-serif text-[#c0c0c0] mt-2">{remaining}</p>
          </div>
          <div className="bg-[#141414] border border-[#c5a254]/20 p-6 text-center">
            <p className="text-sm tracking-widest text-[#c5a254]">RATE</p>
            <p className="text-4xl font-serif text-[#c5a254] mt-2">{total ? Math.round((checked / total) * 100) : 0}%</p>
          </div>
        </div>

        <form className="mt-8 flex flex-col md:flex-row gap-3 bg-[#141414] border border-[#c0c0c0]/10 p-4">
          <input name="q" defaultValue={sp.q || ""} placeholder="Search name, email, ID, UUID..." className="flex-1 bg-[#0a0a0a] border border-[#c0c0c0]/20 px-4 py-2 text-base text-[#faf7f2] placeholder:text-[#c0c0c0]/30 focus:border-[#c5a254]/60 outline-none" />
          <select name="year" defaultValue={yearFilter} className="bg-[#0a0a0a] border border-[#c0c0c0]/20 px-4 py-2 text-base text-[#faf7f2]">
            <option value="">All Years</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
            <option value="Faculty / Staff">Faculty / Staff</option>
          </select>
          <button className="border border-[#c5a254]/40 px-6 py-2 text-sm tracking-widest text-[#c5a254] hover:bg-[#c5a254]/10">FILTER</button>
          <a href="/api/export" className="bg-[#c5a254] text-[#0a0a0a] px-6 py-2 text-sm tracking-widest font-semibold text-center hover:bg-[#e8c77a]">EXPORT CSV</a>
        </form>

        <div className="mt-6 overflow-x-auto border border-[#c0c0c0]/10">
          <table className="w-full text-sm">
            <thead className="bg-[#141414] text-sm tracking-widest text-[#c5a254]">
              <tr>
                <th className="px-4 py-3 text-left">NAME</th>
                <th className="px-4 py-3 text-left">YEAR</th>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">EMAIL</th>
                <th className="px-4 py-3 text-left">ALLERGENS</th>
                <th className="px-4 py-3 text-left">STATUS</th>
                <th className="px-4 py-3 text-left">TIME</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c0c0c0]/10">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-[#c0c0c0]/40">No records yet. RSVPs will appear here.</td></tr>
              ) : (
                filtered.map((r: { uuid: string; name: string; yearLevel: string; idNumber: string; email: string; allergens: string }) => {
                  const att = attendance.find((a: { uuid: string }) => a.uuid === r.uuid);
                  const isChecked = checkedIds.has(r.uuid);
                  return (
                    <tr key={r.uuid} className={isChecked ? "bg-green-900/10" : "bg-[#0a0a0a]"}>
                      <td className="px-4 py-3 text-[#faf7f2]">{r.name}</td>
                      <td className="px-4 py-3 text-[#c0c0c0]/70">{r.yearLevel}</td>
                      <td className="px-4 py-3 font-mono text-sm text-[#c5a254]">{r.idNumber}</td>
                      <td className="px-4 py-3 text-sm text-[#c0c0c0]/60">{r.email}</td>
                      <td className="px-4 py-3 text-sm text-[#c0c0c0]/60">{r.allergens || "—"}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 text-sm tracking-widest border ${isChecked ? "border-green-700 text-green-300 bg-green-900/20" : "border-[#c0c0c0]/20 text-[#c0c0c0]/50"}`}>{isChecked ? "PRESENT" : "NOT YET"}</span></td>
                      <td className="px-4 py-3 text-sm font-mono text-[#c0c0c0]/50">{att ? new Date(att.checkInTime).toLocaleString() : "—"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}