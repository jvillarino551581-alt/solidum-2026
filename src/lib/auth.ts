import { cookies } from "next/headers";

const COOKIE_NAME = "solidum_auth";
const COOKIE_VALUE = "authenticated";

export async function isAuthenticated() {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === COOKIE_VALUE;
}

export function verifyPassword(input: string) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) throw new Error("Missing ADMIN_PASSWORD");
  return input === pw;
}

export async function setAuthCookie() {
  const store = await cookies();
  store.set(COOKIE_NAME, COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12h
  });
}

export async function clearAuthCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
