import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { appendRSVP, findRSVPByEmail, findRSVPByIdNumber } from "@/lib/store";
import { generateQRDataURL, buildVerifyUrl } from "@/lib/qr";
import { sendQRMail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, yearLevel, email, idNumber, allergens } = body;

    // Validation
    if (!name || !yearLevel || !email || !idNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!["1st Year", "2nd Year", "3rd Year", "4th Year", "Faculty / Staff"].includes(yearLevel)) {
      return NextResponse.json({ error: "Invalid year level" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (!/^[A-Z0-9]{6}$/i.test(String(idNumber).trim())) {
      return NextResponse.json({ error: "ID Number must be exactly 6 characters (e.g. 000001)" }, { status: 400 });
    }

    // Check duplicates (if Firebase configured)
    try {
      const dupEmail = await findRSVPByEmail(email);
      if (dupEmail) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
      const dupId = await findRSVPByIdNumber(idNumber);
      if (dupId) return NextResponse.json({ error: "ID Number already registered" }, { status: 409 });
    } catch (e) {
      // If Firebase not configured (no env), allow but warn
      if ((e as Error).message.includes("Missing")) {
        // In demo mode without Firebase, still generate QR
      } else throw e;
    }

    const uuid = uuidv4();
    const timestamp = new Date().toISOString();
    const allergenStr = Array.isArray(allergens) ? allergens.join(", ") : String(allergens || "");
    const verifyUrl = buildVerifyUrl(uuid);
    const qrDataUrl = await generateQRDataURL(verifyUrl);

    // Try to save to Firestore
    let stored = false;
    let emailSent = "no";
    try {
      await appendRSVP({
        timestamp,
        uuid,
        name: String(name).trim(),
        yearLevel,
        email: String(email).trim().toLowerCase(),
        idNumber: String(idNumber).trim(),
        allergens: allergenStr,
        qrToken: verifyUrl,
        emailSent: "pending",
      });
      stored = true;
    } catch (e) {
      console.error("Firestore append failed:", e);
      // If missing env, continue without Firestore for demo
      if ((e as Error).message.includes("Missing")) stored = false;
      else return NextResponse.json({ error: "Failed to save RSVP" }, { status: 500 });
    }

    // Try to send email (if configured)
    try {
      await sendQRMail({ to: email, name: String(name).trim(), qrDataUrl, verifyUrl, uuid });
      emailSent = "yes";
      // Optionally update Firestore emailSent to yes — best effort, not critical
    } catch (e) {
      console.error("Email failed:", e);
      // don't fail RSVP if email fails, just report
      emailSent = "failed";
    }

    return NextResponse.json({
      uuid,
      verifyUrl,
      qrDataUrl,
      stored,
      emailSent,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
