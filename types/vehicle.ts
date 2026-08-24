import type { Taxonomy } from "./common";
import type { Seller } from "./seller";

export const VEHICLE_CATEGORIES = [
  "trucks",
  "pickups",
  "mini-trucks",
  "lcv",
  "hcv",
  "buses",
  "trailers",
  "tippers",
  "tankers",
  "transit-mixers",
  "construction",
  "three-wheelers",
  "other",
] as const;

export type VehicleCategoryId = (typeof VEHICLE_CATEGORIES)[number];

export const FUEL_TYPES = [
  "diesel",
  "petrol",
  "cng",
  "lng",
  "electric",
  "hybrid",
] as const;
export type FuelType = (typeof FUEL_TYPES)[number];

export const TRANSMISSIONS = ["manual", "automatic", "amt"] as const;
export type Transmission = (typeof TRANSMISSIONS)[number];

export const VEHICLE_CONDITIONS = [
  "excellent",
  "good",
  "fair",
  "needs-work",
] as const;
export type VehicleCondition = (typeof VEHICLE_CONDITIONS)[number];

export const VEHICLE_STATUSES = [
  "available",
  "reserved",
  "sold",
  "draft",
  "under-review",
] as const;
export type VehicleStatus = (typeof VEHICLE_STATUSES)[number];

export const BODY_TYPES = [
  "open-body",
  "closed-container",
  "flatbed",
  "tipper-body",
  "tanker-body",
  "mixer-drum",
  "chassis-cabin",
  "passenger",
  "refrigerated",
] as const;
export type BodyType = (typeof BODY_TYPES)[number];

export const AXLE_CONFIGURATIONS = [
  "4x2",
  "6x2",
  "6x4",
  "8x2",
  "8x4",
  "10x2",
  "12x2",
] as const;
export type AxleConfiguration = (typeof AXLE_CONFIGURATIONS)[number];

export const EMISSION_NORMS = ["BS3", "BS4", "BS6", "BS6-Phase-2"] as const;
export type EmissionNorm = (typeof EMISSION_NORMS)[number];

export interface VehicleCategory extends Taxonomy {
  id: VehicleCategoryId;
  /** Short line used on category tiles and landing page intros. */
  description: string;
  /** Lucide icon name, resolved through the category icon map. */
  icon: string;
  /** Indicative GVW band, shown on the category landing page. */
  gvwRange?: string;
}

export interface Brand extends Taxonomy {
  id: string;
  /** Country of origin or parent group — shown on brand landing pages. */
  origin: string;
  popular: boolean;
}

export interface VehicleLocation {
  city: string;
  citySlug: string;
  state: string;
  /** Region slug for landing pages, e.g. "delhi-ncr". */
  regionSlug: string;
  region: string;
  pincode?: string;
}

export interface VehicleImage {
  url: string;
  alt: string;
  width: number;
  height: number;
  /** Tiny base64 LQIP served as the Next/Image blur placeholder. */
  blurDataURL?: string;
  /** Required while the catalogue uses openly licensed stand-in photos. */
  credit?: {
    author: string;
    license: string;
    source: string;
  };
}

export interface VehicleVerification {
  isVerified: boolean;
  rcAvailable: boolean;
  insuranceValid: boolean;
  fitnessValid: boolean;
  permitValid: boolean;
  inspected: boolean;
  /** ISO date. Present only when `inspected` is true. */
  inspectedAt?: string;
  inspectionScore?: number;
}

export interface VehicleSpecifications {
  engineCapacityCc?: number;
  maxPowerBhp?: number;
  maxTorqueNm?: number;
  gvwKg?: number;
  payloadKg?: number;
  wheelbaseMm?: number;
  bodyLengthFt?: number;
  tyreCount?: number;
  axleConfiguration?: AxleConfiguration;
  emissionNorm?: EmissionNorm;
  bodyType?: BodyType;
  seatingCapacity?: number;
  cabinType?: "day-cab" | "sleeper-cab" | "crew-cab";
  tankCapacityLitres?: number;
  drumCapacityCubicMetres?: number;
}

export interface Vehicle {
  id: string;
  slug: string;
  title: string;

  category: VehicleCategory;
  brand: Brand;
  model: string;
  variant?: string;

  manufacturingYear: number;
  registrationYear?: number;
  registrationNumber?: string;

  price: number;
  negotiable: boolean;
  /** Set when the seller has reduced the asking price. */
  previousPrice?: number;

  fuelType: FuelType;
  transmission?: Transmission;

  kilometers: number;
  ownershipCount: number;
  condition: VehicleCondition;

  specifications: VehicleSpecifications;
  highlights: string[];
  description: string;

  location: VehicleLocation;
  images: VehicleImage[];
  seller: Seller;
  verification: VehicleVerification;
  status: VehicleStatus;

  featured: boolean;
  viewCount: number;

  createdAt: string;
  updatedAt: string;
}

/** The projection listing grids need. Keeps card props honest. */
export type VehicleSummary = Pick<
  Vehicle,
  | "id"
  | "slug"
  | "title"
  | "category"
  | "brand"
  | "model"
  | "variant"
  | "manufacturingYear"
  | "price"
  | "negotiable"
  | "previousPrice"
  | "fuelType"
  | "kilometers"
  | "ownershipCount"
  | "location"
  | "images"
  | "verification"
  | "status"
  | "featured"
  | "createdAt"
> & {
  specifications: Pick<
    VehicleSpecifications,
    "gvwKg" | "payloadKg" | "bodyType"
  >;
  seller: Pick<Seller, "id" | "name" | "type" | "slug" | "verified">;
  /**
   * Computed server-side. Cards must not derive freshness from `Date.now()`
   * at render time — that differs between the server and the client and
   * causes a hydration mismatch.
   */
  justListed: boolean;
};
