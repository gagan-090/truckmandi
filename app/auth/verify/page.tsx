import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { OtpForm } from "@/components/auth/otp-form";
import { Skeleton } from "@/components/ui/skeleton";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Verify Your Number",
  description: "Enter the one-time code sent to your mobile number.",
  path: "/auth/verify",
  noIndex: true,
});

export default function VerifyPage() {
  return (
    <AuthShell
      title="Enter your code"
      description="We have sent a 6-digit verification code to your mobile."
      footer={
        <Link
          href="/auth/login"
          className="font-semibold text-brand-700 hover:underline"
        >
          Use a different number
        </Link>
      }
    >
      {/* OtpForm reads the phone from search params. */}
      <Suspense fallback={<Skeleton className="h-44 w-full" />}>
        <OtpForm />
      </Suspense>
    </AuthShell>
  );
}
