import type { SelectOption } from "@/types/common";
import type { SellerType } from "@/types/seller";
import type {
  AxleConfiguration,
  BodyType,
  EmissionNorm,
  FuelType,
  Transmission,
  VehicleCondition,
} from "@/types/vehicle";

/**
 * Human labels for every controlled value in the domain. UI never
 * derives a label by string-munging an enum.
 */

export const fuelTypeOptions: SelectOption<FuelType>[] = [
  { value: "diesel", label: "Diesel" },
  { value: "petrol", label: "Petrol" },
  { value: "cng", label: "CNG" },
  { value: "lng", label: "LNG" },
  { value: "electric", label: "Electric" },
  { value: "hybrid", label: "Hybrid" },
];

export const transmissionOptions: SelectOption<Transmission>[] = [
  { value: "manual", label: "Manual" },
  { value: "automatic", label: "Automatic" },
  { value: "amt", label: "AMT" },
];

export const conditionOptions: SelectOption<VehicleCondition>[] = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "needs-work", label: "Needs work" },
];

export const sellerTypeOptions: SelectOption<SellerType>[] = [
  { value: "individual", label: "Individual owner" },
  { value: "dealer", label: "Dealer" },
  { value: "fleet-owner", label: "Fleet owner" },
];

export const bodyTypeOptions: SelectOption<BodyType>[] = [
  { value: "open-body", label: "Open body" },
  { value: "closed-container", label: "Closed container" },
  { value: "flatbed", label: "Flatbed" },
  { value: "tipper-body", label: "Tipper body" },
  { value: "tanker-body", label: "Tanker body" },
  { value: "mixer-drum", label: "Mixer drum" },
  { value: "chassis-cabin", label: "Chassis & cabin" },
  { value: "passenger", label: "Passenger" },
  { value: "refrigerated", label: "Refrigerated" },
];

export const axleOptions: SelectOption<AxleConfiguration>[] = [
  { value: "4x2", label: "4x2" },
  { value: "6x2", label: "6x2" },
  { value: "6x4", label: "6x4" },
  { value: "8x2", label: "8x2" },
  { value: "8x4", label: "8x4" },
  { value: "10x2", label: "10x2" },
  { value: "12x2", label: "12x2" },
];

export const emissionNormOptions: SelectOption<EmissionNorm>[] = [
  { value: "BS3", label: "BS III" },
  { value: "BS4", label: "BS IV" },
  { value: "BS6", label: "BS VI" },
  { value: "BS6-Phase-2", label: "BS VI Phase 2" },
];

function toLookup<T extends string>(options: SelectOption<T>[]) {
  return Object.fromEntries(options.map((o) => [o.value, o.label])) as Record<
    T,
    string
  >;
}

export const fuelTypeLabels = toLookup(fuelTypeOptions);
export const transmissionLabels = toLookup(transmissionOptions);
export const conditionLabels = toLookup(conditionOptions);
export const sellerTypeLabels = toLookup(sellerTypeOptions);
export const bodyTypeLabels = toLookup(bodyTypeOptions);
export const emissionNormLabels = toLookup(emissionNormOptions);

/** Price buckets that make sense for Indian CV budgets. */
export const priceBuckets = [
  { label: "Under ₹3 Lakh", min: 0, max: 300_000 },
  { label: "₹3 – 6 Lakh", min: 300_000, max: 600_000 },
  { label: "₹6 – 10 Lakh", min: 600_000, max: 1_000_000 },
  { label: "₹10 – 15 Lakh", min: 1_000_000, max: 1_500_000 },
  { label: "₹15 – 25 Lakh", min: 1_500_000, max: 2_500_000 },
  { label: "Above ₹25 Lakh", min: 2_500_000, max: 10_000_000 },
];

export const kilometerBuckets = [
  { label: "Under 25,000 km", max: 25_000 },
  { label: "Under 50,000 km", max: 50_000 },
  { label: "Under 1 Lakh km", max: 100_000 },
  { label: "Under 2 Lakh km", max: 200_000 },
  { label: "Under 5 Lakh km", max: 500_000 },
];

export const ownershipBuckets = [
  { label: "1st owner only", max: 1 },
  { label: "Up to 2 owners", max: 2 },
  { label: "Up to 3 owners", max: 3 },
];
