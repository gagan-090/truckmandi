"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MailCheck, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema } from "@/features/auth/schemas";
import type { RegisterInput } from "@/features/auth/schemas";

interface SentState {
  email: string;
  message: string;
  /** Present only outside production when SMTP delivery failed. */
  devVerifyUrl?: string;
}

export function RegisterForm() {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sent, setSent] = useState<SentState | null>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false as unknown as true,
    },
  });

  async function onSubmit(values: RegisterInput) {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Failed to create account.");
        setSubmitting(false);
        return;
      }

      // Registration no longer signs you in: the address is unproven until
      // the emailed link is opened.
      setSent({
        email: data.email,
        message: data.message,
        devVerifyUrl: data.devVerifyUrl,
      });
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const errors = form.formState.errors;
  const acceptTerms = useWatch({ control: form.control, name: "acceptTerms" });

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-trust-50 text-trust-600">
          <MailCheck className="size-7" />
        </div>
        <h2 className="mt-4 font-display text-lg font-bold text-steel-900">
          Confirm your email
        </h2>
        <p className="mt-2 text-sm text-pretty text-steel-600">{sent.message}</p>
        <p className="mt-3 text-xs text-steel-500">
          The link expires in 30 minutes. Check your spam folder if it has not
          arrived in a couple of minutes.
        </p>

        {sent.devVerifyUrl && (
          <a
            href={sent.devVerifyUrl}
            className="mt-4 inline-block rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold break-all text-amber-900"
          >
            Development only — email could not be sent. Open this link to
            confirm.
          </a>
        )}

        <Button asChild variant="secondary" block className="mt-6">
          <Link href="/auth/login">Go to sign in</Link>
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

      <FormField id="reg-name" label="Full name" required error={errors.name?.message}>
        <Input
          id="reg-name"
          autoComplete="name"
          placeholder="e.g. Rahul Sharma"
          aria-invalid={Boolean(errors.name)}
          {...form.register("name")}
        />
      </FormField>

      <FormField id="reg-email" label="Email address" required error={errors.email?.message}>
        <Input
          id="reg-email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          aria-invalid={Boolean(errors.email)}
          {...form.register("email")}
        />
      </FormField>

      <FormField
        id="reg-phone"
        label="Mobile number"
        required
        hint="Used for notifications & vehicle enquiries"
        error={errors.phone?.message}
      >
        <Input
          id="reg-phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="98765 43210"
          aria-invalid={Boolean(errors.phone)}
          {...form.register("phone")}
        />
      </FormField>

      <FormField id="reg-password" label="Create password" required error={errors.password?.message}>
        <Input
          id="reg-password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          aria-invalid={Boolean(errors.password)}
          {...form.register("password")}
        />
      </FormField>

      <FormField
        id="reg-confirm-password"
        label="Confirm password"
        required
        error={errors.confirmPassword?.message}
      >
        <Input
          id="reg-confirm-password"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          aria-invalid={Boolean(errors.confirmPassword)}
          {...form.register("confirmPassword")}
        />
      </FormField>

      <div>
        <div className="flex items-start gap-3 pt-1">
          <Checkbox
            id="reg-terms"
            checked={acceptTerms === true}
            onCheckedChange={(checked) =>
              form.setValue("acceptTerms", (checked === true) as true, {
                shouldValidate: true,
              })
            }
            className="mt-0.5"
          />
          <Label htmlFor="reg-terms" className="cursor-pointer text-xs font-normal text-steel-600">
            I agree to the terms of use and privacy policy
          </Label>
        </div>
        {errors.acceptTerms && (
          <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
            {errors.acceptTerms.message}
          </p>
        )}
      </div>

      <Button type="submit" block size="lg" disabled={submitting} className="mt-2">
        {submitting ? <Loader2 className="animate-spin" /> : <UserPlus className="size-4" />}
        Create account
      </Button>
    </form>
  );
}
