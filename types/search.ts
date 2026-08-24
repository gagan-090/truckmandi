import type {
  FuelType,
  Transmission,
  VehicleCategoryId,
  VehicleCondition,
} from "./vehicle";
import type { SellerType } from "./seller";

export const SORT_OPTIONS = [
  "relevance",
  "price-asc",
  "price-desc",
  "year-desc",
  "km-asc",
  "newest",
] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

/**
 * The complete, validated shape of a marketplace search.
 * Parsed from URL search params — never trusted as-is from the browser.
 */
export interface VehicleFilters {
  q?: string;
  category?: VehicleCategoryId[];
  brand?: string[];
  model?: string[];
  city?: string[];
  fuel?: FuelType[];
  transmission?: Transmission[];
  condition?: VehicleCondition[];
  sellerType?: SellerType[];
  minPrice?: number;
  maxPrice?: number;
  yearFrom?: number;
  yearTo?: number;
  maxKm?: number;
  maxOwners?: number;
  minGvw?: number;
  maxGvw?: number;
  minPayload?: number;
  verifiedOnly?: boolean;
  negotiableOnly?: boolean;
}

export interface SearchQuery extends VehicleFilters {
  sort: SortOption;
  page: number;
  pageSize: number;
}

/** One selectable value in a filter group, with its live result count. */
export interface FacetValue {
  value: string;
  label: string;
  count: number;
}

export interface SearchFacets {
  category: FacetValue[];
  brand: FacetValue[];
  city: FacetValue[];
  fuel: FacetValue[];
  sellerType: FacetValue[];
  priceRange: { min: number; max: number };
  yearRange: { min: number; max: number };
}
