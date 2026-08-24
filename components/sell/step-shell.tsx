"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { sellSteps } from "@/features/sell/steps";

export interface StepShellProps {
  title: string;
  description?: string;
  stepIndex: number;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitting?: boolean;
  nextLabel?: string;
  children: ReactNode;
}

/**
 * Shared frame for every wizard step: heading, form element and the
 * back/continue pair. Keeps the steps themselves to just their fields.
 */
export function StepShell({
  title,
  description,
  stepIndex,
  onSubmit,
  submitting = false,
  nextLabel = "Continue",
  children,
}: StepShellProps) {
  const previous = stepIndex > 0 ? sellSteps[stepIndex - 1] : null;

  return (
    <form onSubmit={onSubmit} noValidate className="min-w-0">
      <header className="mb-6">
        <h1 className="font-display text-xl font-extrabold text-steel-900 sm:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm text-pretty text-steel-600">
            {description}
          </p>
        )}
      </header>

      {children}

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-steel-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        {previous ? (
          <Button asChild variant="ghost" size="md">
            <Link href={previous.href}>
              <ArrowLeft />
              Back
            </Link>
          </Button>
        ) : (
          <span />
        )}

        <Button
          type="submit"
          variant="accent"
          size="lg"
          disabled={submitting}
          className="sm:min-w-44"
        >
          {submitting && <Loader2 className="animate-spin" />}
          {nextLabel}
          {!submitting && <ArrowRight />}
        </Button>
      </div>
    </form>
  );
}
