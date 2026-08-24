import type { VehicleCategory, VehicleCategoryId } from "@/types/vehicle";
import { VEHICLE_CATEGORIES } from "@/types/vehicle";

export const vehicleCategories: VehicleCategory[] = [
  {
    id: "trucks",
    slug: "trucks",
    name: "Trucks",
    description:
      "Rigid goods carriers from 7T to 31T for long-haul and regional freight.",
    icon: "Truck",
    gvwRange: "7T – 31T",
  },
  {
    id: "pickups",
    slug: "pickups",
    name: "Pickups",
    description:
      "Sub-2T payload workhorses for last-mile distribution and rural loads.",
    icon: "TruckElectric",
    gvwRange: "1.7T – 3.5T",
  },
  {
    id: "mini-trucks",
    slug: "mini-trucks",
    name: "Mini Trucks",
    description:
      "Compact city carriers built for narrow lanes and daily intra-city runs.",
    icon: "Package",
    gvwRange: "1T – 2T",
  },
  {
    id: "lcv",
    slug: "lcv",
    name: "LCV",
    description:
      "Light commercial vehicles balancing payload with city manoeuvrability.",
    icon: "Container",
    gvwRange: "3.5T – 7.5T",
  },
  {
    id: "hcv",
    slug: "hcv",
    name: "HCV",
    description:
      "Heavy commercial vehicles for bulk tonnage over long distances.",
    icon: "Truck",
    gvwRange: "16T – 49T",
  },
  {
    id: "buses",
    slug: "buses",
    name: "Buses",
    description:
      "Staff, school and intercity passenger vehicles from 13 to 55 seats.",
    icon: "Bus",
    gvwRange: "13 – 55 seats",
  },
  {
    id: "trailers",
    slug: "trailers",
    name: "Trailers",
    description:
      "Tractor-trailers and multi-axle haulage for containerised freight.",
    icon: "Caravan",
    gvwRange: "35T – 55T",
  },
  {
    id: "tippers",
    slug: "tippers",
    name: "Tippers",
    description:
      "Hydraulic tipping bodies for mining, quarry and construction haulage.",
    icon: "Construction",
    gvwRange: "9T – 31T",
  },
  {
    id: "tankers",
    slug: "tankers",
    name: "Tankers",
    description:
      "Liquid and gas carriers for fuel, milk, water and chemical transport.",
    icon: "Fuel",
    gvwRange: "6KL – 25KL",
  },
  {
    id: "transit-mixers",
    slug: "transit-mixers",
    name: "Transit Mixers",
    description:
      "Ready-mix concrete carriers with rotating drums from 4 to 9 cubic metres.",
    icon: "Cylinder",
    gvwRange: "4m³ – 9m³",
  },
  {
    id: "construction",
    slug: "construction",
    name: "Construction Vehicles",
    description:
      "Backhoe loaders, excavators and earthmovers for site and infra work.",
    icon: "Wrench",
    gvwRange: "Earthmoving",
  },
  {
    id: "three-wheelers",
    slug: "three-wheelers",
    name: "3-Wheelers",
    description:
      "Cargo three-wheelers for the tightest last-mile delivery routes.",
    icon: "Bike",
    gvwRange: "500kg – 1T",
  },
  {
    id: "other",
    slug: "other",
    name: "Other Commercial",
    description:
      "Ambulances, refuse compactors, tow trucks and specialised bodies.",
    icon: "Boxes",
    gvwRange: "Specialised",
  },
];

const categoryBySlug = new Map(vehicleCategories.map((c) => [c.slug, c]));

export function getCategoryBySlug(slug: string): VehicleCategory {
  const found = categoryBySlug.get(slug);
  if (found) return found;

  const formattedName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    id: (VEHICLE_CATEGORIES.includes(slug as any)
      ? slug
      : "trucks") as VehicleCategoryId,
    slug,
    name: formattedName,
    description: `${formattedName} commercial vehicles for transport and logistics.`,
    icon: "Truck",
    gvwRange: "Commercial",
  };
}

export function getCategoryById(
  id: VehicleCategoryId,
): VehicleCategory | undefined {
  return categoryBySlug.get(id);
}

export const homepageCategorySlugs: VehicleCategoryId[] = [
  "trucks",
  "pickups",
  "tippers",
  "lcv",
  "buses",
  "mini-trucks",
  "trailers",
  "transit-mixers",
];
