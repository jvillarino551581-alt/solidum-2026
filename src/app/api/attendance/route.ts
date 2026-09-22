import { NextResponse } from "next/server";
import { findRSVPByUUID, findAttendanceByUUID, getAllAttendance, appendAttendance } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const { uuid, scannedBy } = await req.json();
    if (!uuid) return NextResponse.json({ error: "Missing uuid" }, { status: 400 });

    // Extract uuid from verify URL if full URL was scanned
    let clean = String(uuid).trim();
    // If QR contains URL, extract last segment
    if (clean.includes("/verify/")) clean = clean.split("/verify/").pop()!.split("?")[0].split("#")[0];
    if (clean.includes("/")) clean = clean.split("/").pop()!;

    const rsvp = await findRSVPByUUID(clean);
    if (!rsvp) return NextResponse.json({ error: "RSVP not found. Invalid QR." }, { status: 404 });

    const existing = await findAttendanceByUUID(rsvp.uuid);
    if (existing) {
      return NextResponse.json({ error: "Already checked in", existing, rsvp }, { status: 409 });
    }

    const row = {
      uuid: rsvp.uuid,
      idNumber: rsvp.idNumber,
      name: rsvp.name,
      yearLevel: rsvp.yearLevel,
      checkInTime: new Date().toISOString(),
      scannedBy: scannedBy || "staff",
      status: "Present",
    };
    await appendAttendance(row);
    return NextResponse.json({ success: true, rsvp, attendance: row });
  } catch (e) {
    console.error(e);
    const msg = (e as Error).message;
    if (msg.includes("Missing")) return NextResponse.json({ error: "Firebase not configured. Check env." }, { status: 500 });
    return NextResponse.json({ error: "Failed to record attendance" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const attendance = await getAllAttendance();
    return NextResponse.json({ attendance });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
