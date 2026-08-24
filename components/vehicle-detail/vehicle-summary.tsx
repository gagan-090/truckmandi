import { Calendar, Fuel, Gauge, Settings2, Users, Weight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { fuelTypeLabels, transmissionLabels } from "@/data/vehicle-types";
import {
  formatKilometers,
  formatOwnership,
  formatWeight,
} from "@/lib/utils/format-number";
import type { Vehicle } from "@/types/vehicle";

interface SummaryItem {
  icon: LucideIcon;
  label: string;
  value: string;
}

/**
 * The six figures a buyer checks before reading anything else. Rendered as a
 * definition list so screen readers get the label/value pairing.
 */
export function VehicleSummaryStats({ vehicle }: { vehicle: Vehicle }) {
  const items: SummaryItem[] = [
    { icon: Calendar, label: "Year", value: String(vehicle.manufacturingYear) },
    {
      icon: Gauge,
      label: "Kilometres",
      value: formatKilometers(vehicle.kilometers),
    },
    { icon: Fuel, label: "Fuel", value: fuelTypeLabels[vehicle.fuelType] },
    {
      icon: Users,
      label: "Ownership",
      value: formatOwnership(vehicle.ownershipCount),
    },
    {
      icon: Weight,
      label: "GVW",
      value: formatWeight(vehicle.specifications.gvwKg),
    },
    {
      icon: Settings2,
      label: "Transmission",
      value: vehicle.transmission
        ? transmissionLabels[vehicle.transmission]
        : "—",
    },
  ];

  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-steel-200 bg-steel-200 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="bg-white px-4 py-3.5">
          <dt className="flex items-center gap-1.5 text-xs text-steel-500">
            <item.icon aria-hidden className="size-3.5 shrink-0" />
            {item.label}
          </dt>
          <dd className="tabular mt-1 text-sm font-bold text-steel-900">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
