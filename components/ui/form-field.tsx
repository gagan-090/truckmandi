import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Wires a label, hint and error message to a control. Pass the same `id` to
 * the input and set `aria-describedby={`${id}-error`}` where relevant —
 * `FormField` renders the ids this expects.
 */
export function FormField({
  id,
  label,
  error,
  hint,
  required,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-steel-800"
      >
        {label}
        {required && (
          <span aria-hidden className="ml-0.5 text-brand-600">
            *
          </span>
        )}
      </label>

      {children}

      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-steel-500">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 text-xs font-medium text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}
