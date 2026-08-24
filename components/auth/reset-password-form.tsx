"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { resetPasswordSchema } from "@/features/auth/schemas";
import type { ResetPasswordInput } from "@/features/auth/schemas";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: ResetPasswordInput) {
    if (!token) {
      setErrorMessage("Invalid or missing password reset token.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: values.password,
          confirmPassword: values.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Failed to reset password.");
        setSubmitting(false);
        return;
      }

      router.push(`/auth/login?password_reset=1&email=${encodeURIComponent(data.email || "")}`);
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const errors = form.formState.errors;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
      {errorMessage && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <FormField id="reset-password" label="New password" required error={errors.password?.message}>
        <Input
          id="reset-password"
          type="password"
          autoComplete="new-password"
          autoFocus
          placeholder="At least 6 characters"
          aria-invalid={Boolean(errors.password)}
          {...form.register("password")}
        />
      </FormField>

      <FormField
        id="reset-confirm-password"
        label="Confirm new password"
        required
        error={errors.confirmPassword?.message}
      >
        <Input
          id="reset-confirm-password"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your new password"
          aria-invalid={Boolean(errors.confirmPassword)}
          {...form.register("confirmPassword")}
        />
      </FormField>

      <Button type="submit" block size="lg" disabled={submitting}>
        {submitting ? <Loader2 className="animate-spin" /> : <KeyRound className="size-4" />}
        Update Password & Sign In
      </Button>
    </form>
  );
}
