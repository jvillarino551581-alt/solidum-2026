import { getAllRSVPs, getAllAttendance } from "@/lib/store";

export async function GET() {
  try {
    const [rsvps, attendance] = await Promise.all([getAllRSVPs(), getAllAttendance()]);
    const map = new Map(attendance.map((a: { uuid: string; checkInTime: string }) => [a.uuid, a]));
    const header = ["Timestamp", "UUID", "Name", "YearLevel", "Email", "IDNumber", "Allergens", "Status", "CheckInTime"];
    const rows = rsvps.map((r: { timestamp: string; uuid: string; name: string; yearLevel: string; email: string; idNumber: string; allergens: string }) => {
      const a = map.get(r.uuid) as { checkInTime: string } | undefined;
      return [r.timestamp, r.uuid, `"${r.name.replace(/"/g, '""')}"`, r.yearLevel, r.email, r.idNumber, `"${r.allergens.replace(/"/g, '""')}"`, a ? "Present" : "Not Yet", a?.checkInTime || ""].join(",");
    });
    const csv = [header.join(","), ...rows].join("\n");
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=SOLIDUM2026-attendance.csv",
      },
    });
  } catch (e) {
    return new Response((e as Error).message, { status: 500 });
  }
}
