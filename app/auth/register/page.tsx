import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Create an Account",
  description:
    "Create a free TruckMitr Exchange account to save vehicles, send enquiries and list your own.",
  path: "/auth/register",
  noIndex: true,
});

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Free to join. Save vehicles, track enquiries and list your own."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-brand-700 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
