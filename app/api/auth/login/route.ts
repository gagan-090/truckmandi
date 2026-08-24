import { NextResponse } from "next/server";
import { loginSchema } from "@/features/auth/schemas";
import { attachSession } from "@/lib/auth/session";
import { getUserByEmail, verifyPassword } from "@/lib/auth/user-store";

/**
 * Signs an existing user in.
 *
 * This route used to auto-provision an account for any unknown email and
 * accept whatever password came with it, which meant there was effectively
 * no authentication: every "wrong" login silently created a new user.
 */
export async function POST(req: Request) {
  let parsed;
  try {
    parsed = loginSchema.parse(await req.json());
  } catch {
    return NextResponse.json(
      { success: false, message: "Enter your email and password." },
      { status: 400 },
    );
  }

  const user = await getUserByEmail(parsed.email);
  const passwordOk = user
    ? await verifyPassword(parsed.password, user.passwordHash)
    : false;

  // One message for both cases, so this cannot be used to discover which
  // addresses have accounts.
  if (!user || !passwordOk) {
    return NextResponse.json(
      { success: false, message: "Incorrect email or password." },
      { status: 401 },
    );
  }

  if (!user.emailVerified) {
    return NextResponse.json(
      {
        success: false,
        code: "email_unverified",
        email: user.email,
        message:
          "Please confirm your email address first. Check your inbox for the link we sent.",
      },
      { status: 403 },
    );
  }

  const response = NextResponse.json({
    success: true,
    message: "Signed in successfully.",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
    },
  });

  return attachSession(response, user.email);
}
