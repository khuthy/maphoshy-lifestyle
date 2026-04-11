// Uses globalThis.crypto.subtle (Web Crypto API) — compatible with both
// the Edge Runtime (middleware) and the Node.js runtime (API routes).
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const COOKIE_NAME = "ml_admin";
const SALT = "maphoshy-admin-2024";

async function computeToken(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + SALT);
  const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Verifies a plain-text password attempt and returns the token if valid. */
export async function verifyPassword(attempt: string): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || attempt !== password) return null;
  return computeToken(password);
}

/** Checks admin auth from a server component (uses next/headers cookies). */
export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const password = process.env.ADMIN_PASSWORD;
    if (!password) return false;
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;
    const expected = await computeToken(password);
    return token === expected;
  } catch {
    return false;
  }
}

/** Checks admin auth from an API route or middleware (uses NextRequest). */
export async function isAdminRequest(req: NextRequest): Promise<boolean> {
  try {
    const password = process.env.ADMIN_PASSWORD;
    if (!password) return false;
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) return false;
    const expected = await computeToken(password);
    return token === expected;
  } catch {
    return false;
  }
}

export { COOKIE_NAME };
