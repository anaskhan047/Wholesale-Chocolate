import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/constants";

export { AUTH_COOKIE };

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export async function setAuthCookie(token: string) {
  const store = await cookies();
  store.set(AUTH_COOKIE, token, COOKIE_OPTIONS);
}

export async function clearAuthCookie() {
  const store = await cookies();
  store.delete(AUTH_COOKIE);
}

export async function getAuthCookie() {
  const store = await cookies();
  return store.get(AUTH_COOKIE)?.value ?? "";
}
