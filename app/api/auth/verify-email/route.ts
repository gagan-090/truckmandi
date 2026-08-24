import { NextResponse } from "next/server";
import { attachSession } from "@/lib/auth/session";
import {
  consumeToken,
  getUserByEmail,
  markEmailVerified,
  verifyToken,
} from "@/lib/auth/user-store";

/**
 * Confirms an email address and signs the user in.
 *
 * Opening the link is what proves control of the mailbox, so this is the
 * first point at which a session is legitimate.
 */
export async function POST(req: Request) {
  let token: unknown;
  try {
    ({ token } = await req.json());
  } catch {
    token = undefined;
  }

  if (typeof token !== "string" || token.length === 0) {
    return NextResponse.json(
      { success: false, message: "This confirmation link is not valid." },
      { status: 400 },
    );
  }

  const email = await verifyToken(token, "verify");
  if (!email) {
    return NextResponse.json(
      {
        success: false,
        code: "invalid_token",
        message:
          "This confirmation link is invalid or has expired. Request a new one from the sign-in page.",
      },
      { status: 400 },
    );
  }

  await markEmailVerified(email);
  await consumeToken(token);

  const user = await getUserByEmail(email);
  if (!user) {
    return NextResponse.json(
      { success: false, message: "That account no longer exists." },
      { status: 404 },
    );
  }

  const response = NextResponse.json({
    success: true,
    email,
    message: "Email confirmed. You are now signed in.",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
    },
  });

  return attachSession(response, email);
}
