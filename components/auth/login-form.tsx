"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/features/auth/schemas";
import { useSession } from "@/features/auth/session-context";
import type { LoginInput } from "@/features/auth/schemas";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultEmail = searchParams?.get("email") || "";
  const passwordReset = searchParams?.get("password_reset");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    passwordReset
      ? "Your password has been updated! Please sign in with your email and new password."
      : null,
  );

  const { refresh } = useSession();
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: defaultEmail, password: "" },
  });

  async function resendVerification(email: string) {
    setResending(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setSuccessMessage(data.message ?? "Confirmation link sent.");
      setErrorMessage(null);
      setUnverifiedEmail(null);
    } catch {
      setErrorMessage("Could not send the confirmation link. Try again.");
    } finally {
      setResending(false);
    }
  }

  async function onSubmit(values: LoginInput) {
    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setUnverifiedEmail(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Failed to sign in.");
        if (data.code === "email_unverified") {
          setUnverifiedEmail(data.email ?? values.email);
        }
        setSubmitting(false);
        return;
      }

      // Re-read the session before navigating, otherwise the header keeps
      // rendering whoever was signed in previously.
      refresh();
      router.push("/account");
      router.refresh();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
      {successMessage && (
        <div className="flex items-start gap-2.5 rounded-md border border-trust-200 bg-trust-50 p-3 text-sm text-trust-800">
          <CheckCircle2 className="size-5 shrink-0 text-trust-600 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {unverifiedEmail && (
        <button
          type="button"
          onClick={() => resendVerification(unverifiedEmail)}
          disabled={resending}
          className="w-full rounded-md border border-steel-300 bg-white px-3 py-2 text-sm font-semibold text-steel-800 transition-colors hover:bg-steel-50 disabled:opacity-60"
        >
          {resending ? "Sending…" : "Resend confirmation link"}
        </button>
      )}

      <FormField
        id="login-email"
        label="Email address"
        required
        error={form.formState.errors.email?.message}
      >
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          autoFocus
          placeholder="name@example.com"
          aria-invalid={Boolean(form.formState.errors.email)}
          {...form.register("email")}
        />
      </FormField>

      <FormField
        id="login-password"
        label="Password"
        required
        error={form.formState.errors.password?.message}
      >
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          aria-invalid={Boolean(form.formState.errors.password)}
          {...form.register("password")}
        />
      </FormField>

      <div className="flex items-center justify-between text-xs pt-1">
        <Link
          href="/auth/forgot-password"
          className="font-medium text-brand-700 hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" block size="lg" disabled={submitting}>
        {submitting ? <Loader2 className="animate-spin" /> : <KeyRound className="size-4" />}
        Sign In to Account
      </Button>
    </form>
  );
}
