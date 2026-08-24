import { NextResponse } from "next/server";
import { registerSchema } from "@/features/auth/schemas";
import { sendVerificationEmail } from "@/lib/mail/mailer";
import { createToken, createUser, getUserByEmail } from "@/lib/auth/user-store";
import { absoluteUrl } from "@/lib/seo/metadata";

/**
 * Creates an account and sends a verification email.
 *
 * Deliberately does NOT sign the user in: the address is unproven until the
 * link is opened. This route previously wrote `emailVerified: true` and set
 * session cookies immediately, so verification never happened.
 */
export async function POST(req: Request) {
  let parsed;
  try {
    parsed = registerSchema.parse(await req.json());
  } catch {
    return NextResponse.json(
      { success: false, message: "Please check the details and try again." },
      { status: 400 },
    );
  }

  const existing = await getUserByEmail(parsed.email);
  if (existing) {
    return NextResponse.json(
      {
        success: false,
        code: "email_taken",
        message: existing.emailVerified
          ? "An account with this email already exists. Sign in instead."
          : "This email is already registered but not confirmed. Check your inbox for the link, or request a new one.",
      },
      { status: 409 },
    );
  }

  const user = await createUser({
    name: parsed.name,
    email: parsed.email,
    phone: parsed.phone,
    password: parsed.password,
    emailVerified: false,
  });

  // Lost a race with a concurrent signup for the same address.
  if (!user) {
    return NextResponse.json(
      {
        success: false,
        code: "email_taken",
        message: "An account with this email already exists. Sign in instead.",
      },
      { status: 409 },
    );
  }

  const token = await createToken(user.email, "verify");
  const mailSent = await sendVerificationEmail(user.email, user.name, token);

  return NextResponse.json({
    success: true,
    requiresVerification: true,
    email: user.email,
    mailSent,
    message: mailSent
      ? `We have sent a confirmation link to ${user.email}. Open it to activate your account.`
      : `Your account is ready, but we could not send the confirmation email to ${user.email}. Use the link below to continue.`,
    // Fallback link so verification stays completable when SMTP is unavailable on showcase
    devVerifyUrl: !mailSent
      ? absoluteUrl(
          `/auth/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(user.email)}`,
        )
      : undefined,
  });
}
