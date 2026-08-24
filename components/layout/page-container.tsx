import type { ComponentProps, ElementType } from "react";
import { cn } from "@/lib/utils/cn";

const widths = {
  default: "max-w-[1400px]",
  wide: "max-w-[1680px]",
  narrow: "max-w-4xl",
  prose: "max-w-3xl",
} as const;

export interface PageContainerProps extends ComponentProps<"div"> {
  width?: keyof typeof widths;
  as?: ElementType;
}

/** The single source of horizontal page gutters and max width. */
export function PageContainer({
  className,
  width = "default",
  as: Comp = "div",
  ...props
}: PageContainerProps) {
  return (
    <Comp
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        widths[width],
        className,
      )}
      {...props}
    />
  );
}

/** Consistent vertical rhythm between homepage / landing page sections. */
export function Section({
  className,
  as: Comp = "section",
  ...props
}: ComponentProps<"section"> & { as?: ElementType }) {
  return (
    <Comp className={cn("py-12 sm:py-16 lg:py-20", className)} {...props} />
  );
}
