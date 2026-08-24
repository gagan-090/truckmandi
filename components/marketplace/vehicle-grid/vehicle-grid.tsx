import { VehicleCard, type VehicleCardVariant } from "../vehicle-card";
import { VehicleCardSkeleton } from "../vehicle-card/vehicle-card-skeleton";
import { cn } from "@/lib/utils/cn";
import type { VehicleSummary } from "@/types/vehicle";

export interface VehicleGridProps {
  vehicles: VehicleSummary[];
  variant?: VehicleCardVariant;
  /** How many cards load eagerly. Should cover the first visible row. */
  priorityCount?: number;
  columns?: "grid" | "list";
  className?: string;
}

export function VehicleGrid({
  vehicles,
  variant = "default",
  priorityCount = 0,
  columns = "grid",
  className,
}: VehicleGridProps) {
  return (
    <div
      className={cn(
        columns === "list"
          ? "flex flex-col gap-4"
          : "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-5 3xl:grid-cols-4",
        className,
      )}
    >
      {vehicles.map((vehicle, index) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          variant={variant}
          priority={index < priorityCount}
        />
      ))}
    </div>
  );
}

export function VehicleGridSkeleton({
  count = 6,
  variant = "default",
  columns = "grid",
}: {
  count?: number;
  variant?: VehicleCardVariant;
  columns?: "grid" | "list";
}) {
  return (
    <div
      className={cn(
        columns === "list"
          ? "flex flex-col gap-4"
          : "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-5 3xl:grid-cols-4",
      )}
    >
      {Array.from({ length: count }, (_, index) => (
        <VehicleCardSkeleton key={index} variant={variant} />
      ))}
    </div>
  );
}
