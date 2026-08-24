import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextResponse } from "next/server";
import { getSessionSecret } from "./user-store";

export const SESSION_COOKIE = "truckmitr_session";
/** Written by an earlier iteration; cleared on every auth transition. */
export const LEGACY_USER_COOKIE = "truckmitr_user_data";

const MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

/**
 * Signed session cookie.
 *
 * The previous value was literally `sess_<email>`, so anyone could set that
 * cookie by hand and be signed in as any user. The value is now
 * `<email>.<expiry>.<hmac>` and is rejected unless the HMAC matches the
 * server secret.
 */
export async function createSessionValue(email: string): Promise<string> {
  const expiresAt = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = `${Buffer.from(email.toLowerCase()).toString("base64url")}.${expiresAt}`;
  return `${payload}.${await sign(payload)}`;
}

export async function readSessionEmail(
  value: string | undefined,
): Promise<string | null> {
  if (!value) return null;

  const parts = value.split(".");
  if (parts.length !== 3) return null;

  const [encodedEmail, expiry, signature] = parts;
  const payload = `${encodedEmail}.${expiry}`;

  const expected = await sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  if (!Number.isFinite(Number(expiry)) || Date.now() > Number(expiry)) {
    return null;
  }

  const email = Buffer.from(encodedEmail, "base64url").toString("utf8");
  return email.includes("@") ? email : null;
}

async function sign(payload: string): Promise<string> {
  const secret = await getSessionSecret();
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/** Signs the user in on an outgoing response. */
export async function attachSession(
  response: NextResponse,
  email: string,
): Promise<NextResponse> {
  response.cookies.set(SESSION_COOKIE, await createSessionValue(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
  // Identity now comes from the signed cookie alone.
  response.cookies.delete(LEGACY_USER_COOKIE);
  return response;
}

export function clearSession(response: NextResponse): NextResponse {
  response.cookies.delete(SESSION_COOKIE);
  response.cookies.delete(LEGACY_USER_COOKIE);
  return response;
}
