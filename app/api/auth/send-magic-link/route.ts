import { NextResponse } from "next/server";
import { magicLinkSchema } from "@/features/auth/schemas";
import { sendMagicLinkEmail } from "@/lib/mail/mailer";
import { createToken, getUserByEmail } from "@/lib/auth/user-store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = magicLinkSchema.parse(body);

    const user = await getUserByEmail(parsed.email);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "No account found with this email. Please create an account." },
        { status: 400 },
      );
    }

    const token = await createToken(parsed.email, "magic");
    const mailSent = await sendMagicLinkEmail(parsed.email, token);

    return NextResponse.json({
      success: true,
      mailSent,
      message: mailSent
        ? "Magic sign in link sent to your email address!"
        : "Magic link generated! Check your email to sign in.",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: errorMessage(err) || "Failed to send magic link." },
      { status: 400 },
    );
  }
}

function errorMessage(err: unknown): string | null {
  return err instanceof Error ? err.message : null;
}
