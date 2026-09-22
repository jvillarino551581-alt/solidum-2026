import QRCode from "qrcode";

export async function generateQRDataURL(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    width: 400,
    margin: 2,
    color: { dark: "#0a0a0a", light: "#faf7f2" },
    errorCorrectionLevel: "M",
  });
}

export function buildVerifyUrl(uuid: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
  // Prefer explicit base if set
  const b = process.env.NEXT_PUBLIC_BASE_URL || base;
  return `${b.replace(/\/$/, "")}/verify/${uuid}`;
}
