import { getAllRSVPs, getAllAttendance } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [rsvps, attendance] = await Promise.all([getAllRSVPs(), getAllAttendance()]);
    return Response.json({ rsvps, attendance });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}