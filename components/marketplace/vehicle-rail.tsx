import { VehicleCard, type VehicleCardVariant } from "./vehicle-card";
import { cn } from "@/lib/utils/cn";
import type { VehicleSummary } from "@/types/vehicle";

/**
 * Horizontally scrollable row. Below `lg` this is how listings are browsed;
 * it is CSS scroll-snap only, so it costs no JavaScript.
 */
export function VehicleRail({
  vehicles,
  variant = "default",
  priorityCount = 0,
  className,
}: {
  vehicles: VehicleSummary[];
  variant?: VehicleCardVariant;
  priorityCount?: number;
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "scroll-rail -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0",
        className,
      )}
    >
      {vehicles.map((vehicle, index) => (
        <li
          key={vehicle.id}
          className="w-[78vw] max-w-80 shrink-0 snap-start xs:w-[70vw] sm:w-72 lg:w-80"
        >
          <VehicleCard
            vehicle={vehicle}
            variant={variant}
            priority={index < priorityCount}
            className="h-full"
          />
        </li>
      ))}
    </ul>
  );
}
