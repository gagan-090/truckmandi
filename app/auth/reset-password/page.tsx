import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Set New Password",
  description: "Set a new password for your TruckMitr Exchange account.",
  path: "/auth/reset-password",
  noIndex: true,
});

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Create new password"
      description="Enter and confirm your new password below."
      footer={
        <>
          Back to{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-brand-700 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="h-40 animate-pulse rounded-md bg-steel-100" />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
