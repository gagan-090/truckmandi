import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

export function Input({
  className,
  type = "text",
  ...props
}: ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "h-11 w-full rounded-md border border-steel-300 bg-white px-3 text-sm text-steel-900 shadow-xs transition-colors",
        "placeholder:text-steel-400",
        "hover:border-steel-400",
        "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none",
        "disabled:cursor-not-allowed disabled:bg-steel-50 disabled:text-steel-400",
        "aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/20",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "w-full rounded-md border border-steel-300 bg-white px-3 py-2.5 text-sm text-steel-900 shadow-xs transition-colors",
        "placeholder:text-steel-400",
        "hover:border-steel-400",
        "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none",
        "disabled:cursor-not-allowed disabled:bg-steel-50",
        "aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/20",
        className,
      )}
      {...props}
    />
  );
}
