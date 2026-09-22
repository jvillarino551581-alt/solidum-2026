import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/scan", "/admin"];
const COOKIE = "solidum_auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (!isProtected) return NextResponse.next();
  const cookie = req.cookies.get(COOKIE)?.value;
  if (cookie === "authenticated") return NextResponse.next();
  // API attendance also protected? For now allow API but check in route if needed
  if (pathname.startsWith("/api/attendance") || pathname.startsWith("/api/admin")) {
    // let API handle auth separately or allow? Enforce redirect for pages only
    // but for API, return 401 JSON
    if (cookie !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/scan/:path*", "/admin/:path*", "/api/attendance/:path*", "/api/admin/:path*"],
};
