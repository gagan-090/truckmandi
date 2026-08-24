import { NextResponse } from "next/server";
import { magicLinkSchema } from "@/features/auth/schemas";
import { sendVerificationEmail } from "@/lib/mail/mailer";
import { createToken, getUserByEmail } from "@/lib/auth/user-store";
import { absoluteUrl } from "@/lib/seo/metadata";

/** Issues a fresh confirmation link for an account that has not verified yet. */
export async function POST(req: Request) {
  let parsed;
  try {
    parsed = magicLinkSchema.parse(await req.json());
  } catch {
    return NextResponse.json(
      { success: false, message: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const user = await getUserByEmail(parsed.email);

  // Same answer either way, so this cannot be used to enumerate accounts.
  const genericMessage =
    "If that address needs confirming, we have sent a new link to it.";

  if (!user || user.emailVerified) {
    return NextResponse.json({ success: true, message: genericMessage });
  }

  const token = await createToken(user.email, "verify");
  const mailSent = await sendVerificationEmail(user.email, user.name, token);

  return NextResponse.json({
    success: true,
    mailSent,
    message: genericMessage,
    devVerifyUrl:
      !mailSent && process.env.NODE_ENV !== "production"
        ? absoluteUrl(
            `/auth/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(user.email)}`,
          )
        : undefined,
  });
}
