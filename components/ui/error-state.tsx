import { TriangleAlert } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface ErrorStateProps extends ComponentProps<"div"> {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We could not load this section. Please try again in a moment.",
  action,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/70 px-6 py-12 text-center",
        className,
      )}
      {...props}
    >
      <div className="mb-4 grid size-14 place-items-center rounded-full bg-white text-red-600 shadow-xs">
        <TriangleAlert className="size-6" />
      </div>
      <h3 className="text-lg font-bold text-steel-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-pretty text-steel-600">
        {description}
      </p>
      {action && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div>
      )}
    </div>
  );
}
