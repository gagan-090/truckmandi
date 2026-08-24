"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema } from "@/features/auth/schemas";
import type { ForgotPasswordInput } from "@/features/auth/schemas";

export function ForgotPasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordInput) {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Failed to process request.");
        setSubmitting(false);
        return;
      }

      setSentEmail(values.email);
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sentEmail) {
    return (
      <div className="text-center py-2">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand-100 text-brand-600">
          <Mail className="size-7" />
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-steel-900">
          Reset Link Sent!
        </h3>
        <p className="mt-2 text-sm text-steel-600">
          We sent a password reset magic link to <strong className="text-steel-900">{sentEmail}</strong>. Please check your inbox and click the link to reset your password.
        </p>
        <Button
          variant="subtle"
          className="mt-6 w-full"
          asChild
        >
          <Link href="/auth/login">Back to Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
      {errorMessage && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <FormField
        id="forgot-email"
        label="Email address"
        required
        hint="Enter the email address associated with your account"
        error={form.formState.errors.email?.message}
      >
        <Input
          id="forgot-email"
          type="email"
          autoComplete="email"
          autoFocus
          placeholder="name@example.com"
          aria-invalid={Boolean(form.formState.errors.email)}
          {...form.register("email")}
        />
      </FormField>

      <Button type="submit" block size="lg" disabled={submitting}>
        {submitting && <Loader2 className="animate-spin" />}
        Send Password Reset Magic Link
      </Button>

      <div className="text-center pt-2">
        <Link
          href="/auth/login"
          className="text-xs font-semibold text-brand-700 hover:underline"
        >
          Remember your password? Sign in
        </Link>
      </div>
    </form>
  );
}
