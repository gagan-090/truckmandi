import {
  Bike,
  Boxes,
  Bus,
  Caravan,
  Construction,
  Container,
  Cylinder,
  Fuel,
  Package,
  Truck,
  TruckElectric,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Maps the icon name stored on a category to a component. Data files stay
 * serialisable; only this module imports the icon set.
 */
const iconMap: Record<string, LucideIcon> = {
  Truck,
  TruckElectric,
  Package,
  Container,
  Bus,
  Caravan,
  Construction,
  Fuel,
  Cylinder,
  Wrench,
  Bike,
  Boxes,
};

export function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = iconMap[name] ?? Truck;
  return <Icon aria-hidden className={className} />;
}
