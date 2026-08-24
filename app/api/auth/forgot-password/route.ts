import { NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/features/auth/schemas";
import { sendForgotPasswordEmail } from "@/lib/mail/mailer";
import { createToken, getUserByEmail } from "@/lib/auth/user-store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.parse(body);

    const user = await getUserByEmail(parsed.email);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "If an account exists with this email, we sent a password reset link." },
        { status: 200 },
      );
    }

    const token = await createToken(parsed.email, "reset");
    const mailSent = await sendForgotPasswordEmail(parsed.email, token);

    return NextResponse.json({
      success: true,
      mailSent,
      message: "Password reset magic link sent to your email address!",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: errorMessage(err) || "Failed to process forgot password request." },
      { status: 400 },
    );
  }
}

function errorMessage(err: unknown): string | null {
  return err instanceof Error ? err.message : null;
}
