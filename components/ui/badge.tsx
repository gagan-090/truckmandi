import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-sm leading-none font-semibold whitespace-nowrap [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        neutral: "bg-steel-100 text-steel-700",
        outline: "border border-steel-300 bg-white text-steel-700",
        trust: "border border-trust-200 bg-trust-50 text-trust-700",
        accent: "border border-brand-200 bg-brand-50 text-brand-700",
        solid: "bg-steel-900 text-white",
        featured: "bg-brand-600 text-white",
        warning: "border border-amber-200 bg-amber-50 text-amber-800",
        danger: "border border-red-200 bg-red-50 text-red-700",
      },
      size: {
        sm: "px-1.5 py-1 text-[11px] [&_svg]:size-3",
        md: "px-2 py-1.5 text-xs [&_svg]:size-3.5",
      },
    },
    defaultVariants: { variant: "neutral", size: "sm" },
  },
);

export interface BadgeProps
  extends ComponentProps<"span">, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { badgeVariants };
