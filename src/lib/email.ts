import nodemailer from "nodemailer";

export function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) throw new Error("Missing GMAIL_USER or GMAIL_APP_PASSWORD");
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export async function sendQRMail(opts: {
  to: string;
  name: string;
  qrDataUrl: string;
  verifyUrl: string;
  uuid: string;
}) {
  const transporter = getTransporter();
  const from = process.env.GMAIL_USER!;
  // Convert data URL to attachment
  const base64 = opts.qrDataUrl.split(",")[1];
  const buffer = Buffer.from(base64, "base64");

  const html = `
  <div style="background:#0a0a0a;padding:24px;font-family:Georgia,serif;color:#faf7f2">
    <div style="max-width:560px;margin:0 auto;background:#141414;border:1px solid #c5a25455;padding:32px;text-align:center">
      <p style="letter-spacing:0.4em;font-size:11px;color:#c0c0c0">SOLIDUM 2026</p>
      <h1 style="font-size:28px;letter-spacing:0.15em;margin:8px 0;color:#faf7f2">CASINO ROYALE</h1>
      <p style="color:#c5a254;letter-spacing:0.3em;font-size:12px">MASQUERADE</p>
      <p style="margin:16px 0;color:#c0c0c0;font-size:14px">Dear ${opts.name},</p>
      <p style="color:#c0c0c0;font-size:14px;line-height:1.6">Your RSVP for <strong style="color:#faf7f2">SOLIDUM 2026</strong> is confirmed.<br/>Present this QR code at the entrance for check-in. Do not share it.</p>
      <div style="margin:24px 0">
        <img src="cid:qr" alt="QR Code" style="width:260px;height:260px;border:4px solid #c5a254;padding:8px;background:#faf7f2" />
      </div>
      <p style="font-size:12px;color:#c0c0c0;word-break:break-all">Verify: <a href="${opts.verifyUrl}" style="color:#c5a254">${opts.verifyUrl}</a></p>
      <p style="font-size:11px;color:#c0c0c0;margin-top:16px">ID: ${opts.uuid}</p>
      <div style="margin-top:24px;border-top:1px solid #c5a25430;padding-top:16px">
        <p style="font-size:11px;letter-spacing:0.2em;color:#c0c0c0">BLACK TIE • MASQUERADE REQUIRED • RED CARPET</p>
        <p style="font-size:11px;color:#c0c0c080;margin-top:8px">If you have allergens noted, our team is prepared. See you on the red carpet.</p>
      </div>
    </div>
  </div>`;

  await transporter.sendMail({
    from: `"SOLIDUM 2026" <${from}>`,
    to: opts.to,
    subject: "SOLIDUM 2026 — Your QR Code is Ready ♠",
    html,
    attachments: [
      {
        filename: `SOLIDUM2026-${opts.uuid}.png`,
        content: buffer,
        cid: "qr",
        contentType: "image/png",
      },
    ],
  });
}
