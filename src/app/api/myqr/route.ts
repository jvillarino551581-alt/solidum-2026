import { findRSVPByEmail } from "@/lib/store";
import { generateQRDataURL, buildVerifyUrl } from "@/lib/qr";

export async function POST(req: Request) {
  let email: string;
  try {
    const body = await req.json();
    email = String(body.email || "").trim().toLowerCase();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  try {
    const rsvp = await findRSVPByEmail(email);
    if (!rsvp) {
      return Response.json({ error: "No RSVP found for that email address" }, { status: 404 });
    }
    const verifyUrl = buildVerifyUrl(rsvp.uuid);
    const qrDataUrl = await generateQRDataURL(verifyUrl);
    return Response.json({
      uuid: rsvp.uuid,
      name: rsvp.name,
      yearLevel: rsvp.yearLevel,
      verifyUrl,
      qrDataUrl,
    });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}