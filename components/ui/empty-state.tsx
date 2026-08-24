import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface EmptyStateProps extends ComponentProps<"div"> {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-steel-300 bg-steel-50/60 px-6 py-14 text-center",
        className,
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 grid size-14 place-items-center rounded-full bg-white text-steel-400 shadow-xs [&_svg]:size-6">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-steel-900">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-pretty text-steel-600">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div>
      )}
    </div>
  );
}
