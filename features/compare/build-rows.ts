import {
  bodyTypeLabels,
  conditionLabels,
  emissionNormLabels,
  fuelTypeLabels,
  sellerTypeLabels,
  transmissionLabels,
} from "@/data/vehicle-types";
import { formatPriceShort } from "@/lib/utils/format-currency";
import {
  formatKilometers,
  formatNumber,
  formatOwnership,
  formatWeight,
} from "@/lib/utils/format-number";
import { defaultEmiFor } from "@/features/finance/emi";
import { formatEmi } from "@/lib/utils/format-currency";
import type { Vehicle } from "@/types/vehicle";

/** The header data each compare column needs. */
export interface CompareVehicle {
  id: string;
  slug: string;
  title: string;
  categoryName: string;
  price: number;
  previousPrice?: number;
  verified: boolean;
  imageUrl?: string;
  blurDataURL?: string;
}

export interface CompareRow {
  label: string;
  group: string;
  /** True on the first row of a group, so the table can print a heading. */
  isGroupStart: boolean;
  /** Vehicle id -> display value. "yes"/"no" render as icons. */
  values: Record<string, string>;
}

export function toCompareVehicle(vehicle: Vehicle): CompareVehicle {
  return {
    id: vehicle.id,
    slug: vehicle.slug,
    title: vehicle.title,
    categoryName: vehicle.category.name,
    price: vehicle.price,
    previousPrice: vehicle.previousPrice,
    verified: vehicle.verification.isVerified,
    imageUrl: vehicle.images[0]?.url,
    blurDataURL: vehicle.images[0]?.blurDataURL,
  };
}

interface RowSpec {
  group: string;
  label: string;
  value: (vehicle: Vehicle) => string;
}

const specs: RowSpec[] = [
  {
    group: "Pricing",
    label: "Asking price",
    value: (v) => formatPriceShort(v.price),
  },
  {
    group: "Pricing",
    label: "Indicative EMI",
    value: (v) => formatEmi(defaultEmiFor(v.price).monthlyEmi),
  },
  {
    group: "Pricing",
    label: "Negotiable",
    value: (v) => (v.negotiable ? "yes" : "no"),
  },

  { group: "Vehicle", label: "Brand", value: (v) => v.brand.name },
  { group: "Vehicle", label: "Model", value: (v) => v.model },
  { group: "Vehicle", label: "Variant", value: (v) => v.variant ?? "—" },
  { group: "Vehicle", label: "Category", value: (v) => v.category.name },
  {
    group: "Vehicle",
    label: "Manufacturing year",
    value: (v) => String(v.manufacturingYear),
  },
  {
    group: "Vehicle",
    label: "Kilometres driven",
    value: (v) => formatKilometers(v.kilometers),
  },
  {
    group: "Vehicle",
    label: "Ownership",
    value: (v) => formatOwnership(v.ownershipCount),
  },
  {
    group: "Vehicle",
    label: "Condition",
    value: (v) => conditionLabels[v.condition],
  },

  {
    group: "Engine",
    label: "Engine capacity",
    value: (v) =>
      v.specifications.engineCapacityCc
        ? `${formatNumber(v.specifications.engineCapacityCc)} cc`
        : "—",
  },
  {
    group: "Engine",
    label: "Max power",
    value: (v) =>
      v.specifications.maxPowerBhp
        ? `${v.specifications.maxPowerBhp} bhp`
        : "—",
  },
  {
    group: "Engine",
    label: "Max torque",
    value: (v) =>
      v.specifications.maxTorqueNm
        ? `${formatNumber(v.specifications.maxTorqueNm)} Nm`
        : "—",
  },
  { group: "Engine", label: "Fuel", value: (v) => fuelTypeLabels[v.fuelType] },
  {
    group: "Engine",
    label: "Transmission",
    value: (v) => (v.transmission ? transmissionLabels[v.transmission] : "—"),
  },
  {
    group: "Engine",
    label: "Emission norm",
    value: (v) =>
      v.specifications.emissionNorm
        ? emissionNormLabels[v.specifications.emissionNorm]
        : "—",
  },

  {
    group: "Load",
    label: "Gross vehicle weight",
    value: (v) => formatWeight(v.specifications.gvwKg),
  },
  {
    group: "Load",
    label: "Payload",
    value: (v) => formatWeight(v.specifications.payloadKg),
  },
  {
    group: "Load",
    label: "Body type",
    value: (v) =>
      v.specifications.bodyType
        ? bodyTypeLabels[v.specifications.bodyType]
        : "—",
  },
  {
    group: "Load",
    label: "Axle configuration",
    value: (v) => v.specifications.axleConfiguration ?? "—",
  },
  {
    group: "Load",
    label: "Tyres",
    value: (v) =>
      v.specifications.tyreCount ? String(v.specifications.tyreCount) : "—",
  },

  {
    group: "Trust",
    label: "Verified listing",
    value: (v) => (v.verification.isVerified ? "yes" : "no"),
  },
  {
    group: "Trust",
    label: "RC available",
    value: (v) => (v.verification.rcAvailable ? "yes" : "no"),
  },
  {
    group: "Trust",
    label: "Insurance valid",
    value: (v) => (v.verification.insuranceValid ? "yes" : "no"),
  },
  {
    group: "Trust",
    label: "Fitness valid",
    value: (v) => (v.verification.fitnessValid ? "yes" : "no"),
  },
  {
    group: "Trust",
    label: "Inspected",
    value: (v) => (v.verification.inspected ? "yes" : "no"),
  },
  {
    group: "Trust",
    label: "Inspection score",
    value: (v) =>
      v.verification.inspectionScore !== undefined
        ? `${v.verification.inspectionScore}/100`
        : "—",
  },

  {
    group: "Seller",
    label: "Seller type",
    value: (v) => sellerTypeLabels[v.seller.type],
  },
  {
    group: "Seller",
    label: "Location",
    value: (v) => `${v.location.city}, ${v.location.state}`,
  },
];

/**
 * Builds comparison rows and drops any row where no vehicle has a value —
 * a tanker-and-pickup comparison should not show five empty spec rows.
 */
export function buildCompareRows(vehicles: Vehicle[]): CompareRow[] {
  const rows: CompareRow[] = [];
  let lastGroup = "";

  for (const spec of specs) {
    const values: Record<string, string> = {};
    let hasValue = false;

    for (const vehicle of vehicles) {
      const value = spec.value(vehicle);
      values[vehicle.id] = value;
      if (value !== "—") hasValue = true;
    }

    if (!hasValue) continue;

    rows.push({
      label: spec.label,
      group: spec.group,
      isGroupStart: spec.group !== lastGroup,
      values,
    });
    lastGroup = spec.group;
  }

  return rows;
}
