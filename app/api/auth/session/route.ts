import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth";

/**
 * The browser's single source of truth for "who am I".
 *
 * The session cookie is httpOnly, so client components cannot read it
 * directly — and the mirrored `truckmitr_user_data` cookie is not safe to
 * parse in the browser either, because `NextResponse.cookies.set()` encodes
 * the value a second time. Reading the session here, server-side, sidesteps
 * both problems and keeps one implementation of the rules.
 */
export async function GET() {
  const user = await getCurrentUser();

  return NextResponse.json(
    { user },
    { headers: { "Cache-Control": "no-store" } },
  );
}
