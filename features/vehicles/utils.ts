import {
  bodyTypeLabels,
  conditionLabels,
  emissionNormLabels,
  fuelTypeLabels,
  transmissionLabels,
} from "@/data/vehicle-types";
import {
  formatKilometers,
  formatNumber,
  formatOwnership,
  formatWeight,
} from "@/lib/utils/format-number";
import type { Vehicle, VehicleSummary } from "@/types/vehicle";

/** A listing counts as fresh for its first three days. */
const JUST_LISTED_WINDOW_MS = 3 * 86_400_000;

/** Narrows a full `Vehicle` to what listing grids need. */
export function toVehicleSummary(vehicle: Vehicle): VehicleSummary {
  return {
    id: vehicle.id,
    slug: vehicle.slug,
    title: vehicle.title,
    category: vehicle.category,
    brand: vehicle.brand,
    model: vehicle.model,
    variant: vehicle.variant,
    manufacturingYear: vehicle.manufacturingYear,
    price: vehicle.price,
    negotiable: vehicle.negotiable,
    previousPrice: vehicle.previousPrice,
    fuelType: vehicle.fuelType,
    kilometers: vehicle.kilometers,
    ownershipCount: vehicle.ownershipCount,
    location: vehicle.location,
    // Only the first photo reaches a card; the rest are dead weight in RSC payload.
    images: vehicle.images.slice(0, 1),
    verification: vehicle.verification,
    status: vehicle.status,
    featured: vehicle.featured,
    createdAt: vehicle.createdAt,
    justListed:
      Date.now() - new Date(vehicle.createdAt).getTime() <
      JUST_LISTED_WINDOW_MS,
    specifications: {
      gvwKg: vehicle.specifications.gvwKg,
      payloadKg: vehicle.specifications.payloadKg,
      bodyType: vehicle.specifications.bodyType,
    },
    seller: {
      id: vehicle.seller.id,
      name: vehicle.seller.name,
      type: vehicle.seller.type,
      slug: vehicle.seller.slug,
      verified: vehicle.seller.verified,
    },
  };
}

export interface SpecRow {
  label: string;
  value: string;
}

export interface SpecGroup {
  title: string;
  rows: SpecRow[];
}

const present = (rows: SpecRow[]) => rows.filter((row) => row.value !== "—");

/**
 * Groups a vehicle's specifications for the detail page. Empty fields are
 * dropped rather than rendered as dashes — a tanker has no seating capacity.
 */
export function buildSpecGroups(vehicle: Vehicle): SpecGroup[] {
  const s = vehicle.specifications;

  const groups: SpecGroup[] = [
    {
      title: "Overview",
      rows: present([
        {
          label: "Manufacturing year",
          value: String(vehicle.manufacturingYear),
        },
        {
          label: "Registration year",
          value: vehicle.registrationYear
            ? String(vehicle.registrationYear)
            : "—",
        },
        {
          label: "Kilometres driven",
          value: formatKilometers(vehicle.kilometers),
        },
        { label: "Ownership", value: formatOwnership(vehicle.ownershipCount) },
        { label: "Condition", value: conditionLabels[vehicle.condition] },
        {
          label: "Registration number",
          value: maskRegistrationNumber(vehicle.registrationNumber),
        },
      ]),
    },
    {
      title: "Engine & transmission",
      rows: present([
        {
          label: "Engine capacity",
          value: s.engineCapacityCc
            ? `${formatNumber(s.engineCapacityCc)} cc`
            : "—",
        },
        {
          label: "Max power",
          value: s.maxPowerBhp ? `${s.maxPowerBhp} bhp` : "—",
        },
        {
          label: "Max torque",
          value: s.maxTorqueNm ? `${formatNumber(s.maxTorqueNm)} Nm` : "—",
        },
        { label: "Fuel type", value: fuelTypeLabels[vehicle.fuelType] },
        {
          label: "Transmission",
          value: vehicle.transmission
            ? transmissionLabels[vehicle.transmission]
            : "—",
        },
        {
          label: "Emission norm",
          value: s.emissionNorm ? emissionNormLabels[s.emissionNorm] : "—",
        },
      ]),
    },
    {
      title: "Load & dimensions",
      rows: present([
        { label: "Gross vehicle weight", value: formatWeight(s.gvwKg) },
        { label: "Payload capacity", value: formatWeight(s.payloadKg) },
        {
          label: "Wheelbase",
          value: s.wheelbaseMm ? `${formatNumber(s.wheelbaseMm)} mm` : "—",
        },
        {
          label: "Body length",
          value: s.bodyLengthFt ? `${s.bodyLengthFt} ft` : "—",
        },
        {
          label: "Body type",
          value: s.bodyType ? bodyTypeLabels[s.bodyType] : "—",
        },
        {
          label: "Axle configuration",
          value: s.axleConfiguration ?? "—",
        },
        {
          label: "Number of tyres",
          value: s.tyreCount ? String(s.tyreCount) : "—",
        },
      ]),
    },
    {
      title: "Body & capacity",
      rows: present([
        {
          label: "Seating capacity",
          value: s.seatingCapacity ? `${s.seatingCapacity} seats` : "—",
        },
        {
          label: "Tank capacity",
          value: s.tankCapacityLitres
            ? `${formatNumber(s.tankCapacityLitres)} litres`
            : "—",
        },
        {
          label: "Drum capacity",
          value: s.drumCapacityCubicMetres
            ? `${s.drumCapacityCubicMetres} m³`
            : "—",
        },
        {
          label: "Cabin type",
          value: s.cabinType ? cabinTypeLabel(s.cabinType) : "—",
        },
      ]),
    },
  ];

  return groups.filter((group) => group.rows.length > 0);
}

function cabinTypeLabel(
  value: NonNullable<Vehicle["specifications"]["cabinType"]>,
) {
  const labels = {
    "day-cab": "Day cab",
    "sleeper-cab": "Sleeper cab",
    "crew-cab": "Crew cab",
  } as const;
  return labels[value];
}

/**
 * Registration numbers identify a real vehicle and its owner, so only the
 * RTO prefix is public. The full number is released after seller contact.
 */
export function maskRegistrationNumber(value: string | undefined): string {
  if (!value) return "—";
  const parts = value.trim().split(/\s+/);
  if (parts.length < 2) return "—";
  return `${parts.slice(0, 2).join(" ")} ${"•".repeat(2)} ${"•".repeat(4)}`;
}

/** The four figures a buyer scans first on a card. */
export function buildKeySpecs(vehicle: Vehicle | VehicleSummary) {
  return [
    { label: "Year", value: String(vehicle.manufacturingYear) },
    { label: "KM driven", value: formatKilometers(vehicle.kilometers) },
    { label: "Owners", value: formatOwnership(vehicle.ownershipCount) },
    { label: "GVW", value: formatWeight(vehicle.specifications.gvwKg) },
  ];
}

export function countVerifiedDocuments(vehicle: Vehicle): number {
  const v = vehicle.verification;
  return [
    v.rcAvailable,
    v.insuranceValid,
    v.fitnessValid,
    v.permitValid,
    v.inspected,
  ].filter(Boolean).length;
}

/** Percentage saved versus the seller's previous asking price. */
export function priceDropPercent(
  vehicle: Pick<VehicleSummary, "price" | "previousPrice">,
): number | undefined {
  if (!vehicle.previousPrice || vehicle.previousPrice <= vehicle.price) {
    return undefined;
  }
  return Math.round(
    ((vehicle.previousPrice - vehicle.price) / vehicle.previousPrice) * 100,
  );
}
