"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/components/auth/auth-shell";
import { useSession } from "@/features/auth/session-context";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { refresh } = useSession();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";
  const type = searchParams?.get("type") || "verify";
  const emailParam = searchParams?.get("email") || "";

  // A missing token needs no request, so it is decided during render
  // rather than by setting state from inside the effect.
  const [result, setResult] = useState<{
    verifying: boolean;
    success: boolean;
    message: string;
  } | null>(null);

  const missingToken = !token;
  const verifying = missingToken ? false : (result?.verifying ?? true);
  const success = missingToken ? false : (result?.success ?? false);
  const message = missingToken
    ? "Invalid or missing verification link."
    : (result?.message ?? "Confirming your email link…");

  useEffect(() => {
    if (!token) return;

    async function verify() {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, type }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          // Confirming the link proves the mailbox, so the API signs the
          // user in as part of this response — go straight to the account.
          setResult({
            verifying: false,
            success: true,
            message: "Email confirmed. Taking you to your account…",
          });
          refresh();
          setTimeout(() => {
            router.push("/account");
            router.refresh();
          }, 1200);
        } else {
          setResult({
            verifying: false,
            success: false,
            message: data.message || "We could not confirm this link.",
          });
        }
      } catch {
        setResult({
          verifying: false,
          success: false,
          message: "Something went wrong while confirming your email.",
        });
      }
    }

    verify();
  }, [token, type, emailParam, router, refresh]);

  return (
    <AuthShell
      title="Email Verification"
      description="Verifying your account details."
    >
      <div className="text-center py-4 space-y-4">
        {verifying ? (
          <>
            <Loader2 className="mx-auto size-10 animate-spin text-brand-600" />
            <p className="text-sm font-medium text-steel-700">{message}</p>
          </>
        ) : success ? (
          <>
            <CheckCircle2 className="mx-auto size-12 text-trust-600" />
            <p className="text-base font-bold text-steel-900">{message}</p>
            <Button
              className="mt-4 w-full"
              onClick={() => router.push(`/auth/login?verified=1&email=${encodeURIComponent(emailParam)}`)}
            >
              Go to Sign In
            </Button>
          </>
        ) : (
          <>
            <XCircle className="mx-auto size-12 text-red-600" />
            <p className="text-sm font-medium text-red-700">{message}</p>
            <Button
              variant="subtle"
              className="mt-4 w-full"
              onClick={() => router.push("/auth/login")}
            >
              Back to Sign In
            </Button>
          </>
        )}
      </div>
    </AuthShell>
  );
}
