import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";
import type { VehicleCardVariant } from "./vehicle-card";

/** Mirrors `VehicleCard` box for box so nothing shifts on load. */
export function VehicleCardSkeleton({
  variant = "default",
  className,
}: {
  variant?: VehicleCardVariant;
  className?: string;
}) {
  const isHorizontal = variant === "horizontal";

  return (
    <div
      className={cn(
        "flex overflow-hidden rounded-lg border border-steel-200 bg-white",
        isHorizontal ? "flex-col sm:flex-row" : "flex-col",
        className,
      )}
    >
      <Skeleton
        className={cn(
          "shrink-0 rounded-none",
          isHorizontal
            ? "aspect-[4/3] sm:aspect-auto sm:w-64 lg:w-72"
            : variant === "featured"
              ? "aspect-[16/11]"
              : "aspect-[4/3]",
        )}
      />

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-3 w-2/5" />
        </div>
        <Skeleton className="h-6 w-28" />
        <div className="flex gap-3">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-14" />
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-steel-100 pt-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}
