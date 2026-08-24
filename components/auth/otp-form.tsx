"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { otpSchema, type OtpInput } from "@/features/auth/schemas";

const RESEND_SECONDS = 30;

export function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  const rawPhone = searchParams.get("phone") ?? "";
  // Never echo an arbitrary query value back into the page.
  const phone = /^(?:\+91)?\d{10}$/.test(rawPhone) ? rawPhone : null;

  const form = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "" },
  });

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  async function onSubmit() {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    router.push("/account");
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="space-y-5"
    >
      {phone && (
        <p className="rounded-md bg-steel-50 px-3.5 py-2.5 text-center text-sm text-steel-600">
          Code sent to{" "}
          <span className="tabular font-semibold text-steel-900">
            {phone.replace(/^(\+91)?(\d{5})(\d{5})$/, "$1 $2 $3").trim()}
          </span>
        </p>
      )}

      <FormField
        id="otp"
        label="Verification code"
        required
        error={form.formState.errors.code?.message}
      >
        <Input
          id="otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          maxLength={6}
          placeholder="000000"
          aria-invalid={Boolean(form.formState.errors.code)}
          className="tabular text-center text-lg tracking-[0.4em]"
          {...form.register("code")}
        />
      </FormField>

      <Button type="submit" block size="lg" disabled={submitting}>
        {submitting && <Loader2 className="animate-spin" />}
        Verify & continue
      </Button>

      <p className="text-center text-sm text-steel-600">
        {secondsLeft > 0 ? (
          <>
            Resend code in{" "}
            <span className="tabular font-semibold text-steel-900">
              {secondsLeft}s
            </span>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setSecondsLeft(RESEND_SECONDS)}
            className="font-semibold text-brand-700 underline-offset-4 hover:underline"
          >
            Resend code
          </button>
        )}
      </p>
    </form>
  );
}
