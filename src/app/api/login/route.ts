import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    if (!password) return NextResponse.json({ error: "Missing password" }, { status: 400 });
    if (!verifyPassword(password)) return NextResponse.json({ error: "Invalid password" }, { status: 401 });

    const res = NextResponse.json({ ok: true });
    res.cookies.set("solidum_auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return res;
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
