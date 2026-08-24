import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold whitespace-nowrap transition-[background-color,border-color,color,box-shadow] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-steel-900 text-white shadow-xs hover:bg-steel-800 active:bg-steel-950",
        accent:
          "bg-brand-600 text-white shadow-xs hover:bg-brand-700 active:bg-brand-800",
        secondary:
          "border border-steel-300 bg-white text-steel-800 hover:border-steel-400 hover:bg-steel-50 active:bg-steel-100",
        ghost: "text-steel-700 hover:bg-steel-100 hover:text-steel-900",
        subtle: "bg-steel-100 text-steel-800 hover:bg-steel-200",
        outlineAccent:
          "border border-brand-300 bg-brand-50 text-brand-700 hover:border-brand-400 hover:bg-brand-100",
        success:
          "bg-trust-600 text-white shadow-xs hover:bg-trust-700 active:bg-trust-800",
        link: "h-auto p-0 text-brand-700 underline-offset-4 hover:underline",
        danger: "bg-red-600 text-white shadow-xs hover:bg-red-700",
      },
      size: {
        // 44px minimum touch target on every size except `xs`, which is
        // only used inside rows that already have a large hit area.
        xs: "h-8 px-2.5 text-xs",
        sm: "h-10 px-3.5 text-sm [&_svg]:size-4",
        md: "h-11 px-5 text-sm [&_svg]:size-4",
        lg: "h-12 px-6 text-base [&_svg]:size-5",
        icon: "size-11 [&_svg]:size-5",
        iconSm: "size-9 [&_svg]:size-4",
      },
      block: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", block: false },
  },
);

export interface ButtonProps
  extends ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  block,
  asChild = false,
  type,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, block }), className)}
      // Buttons inside forms default to submit, which surprises people.
      type={asChild ? undefined : (type ?? "button")}
      {...props}
    />
  );
}

export { buttonVariants };
