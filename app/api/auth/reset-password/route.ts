import { NextResponse } from "next/server";
import { resetPasswordSchema } from "@/features/auth/schemas";
import { consumeToken, updateUserPassword, verifyToken } from "@/lib/auth/user-store";

export async function POST(req: Request) {
  try {
    const { token, password, confirmPassword } = await req.json();
    const parsed = resetPasswordSchema.parse({ password, confirmPassword });

    const email = await verifyToken(token, "reset");
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired password reset link." },
        { status: 400 },
      );
    }

    await updateUserPassword(email, parsed.password);
    await consumeToken(token);

    return NextResponse.json({
      success: true,
      email,
      message: "Password reset successful! Please sign in with your new password.",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: errorMessage(err) || "Failed to reset password." },
      { status: 400 },
    );
  }
}

function errorMessage(err: unknown): string | null {
  return err instanceof Error ? err.message : null;
}
