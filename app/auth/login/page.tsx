import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Sign In",
  description:
    "Sign in to TruckMitr Exchange to manage your saved vehicles, enquiries and listings.",
  path: "/auth/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <AuthShell
      title="Sign in to your account"
      description="Sign in with your email and password, or get an instant magic sign-in link."
      footer={
        <>
          New to TruckMitr Exchange?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-brand-700 hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="h-44 animate-pulse rounded-md bg-steel-100" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
