import { fuelTypeLabels, sellerTypeLabels } from "@/data/vehicle-types";
import { getRegionBySlug, regions } from "@/data/locations";
import { brands } from "@/data/brands";
import { vehicleCategories } from "@/data/vehicle-categories";
import type { FacetValue, SearchFacets, SearchQuery } from "@/types/search";
import type { VehicleFilters as Filters } from "@/types/search";
import type { Vehicle } from "@/types/vehicle";

/**
 * In-memory filtering, sorting and facet counting for the mock catalogue.
 * Once Laravel serves search, this moves server-side and only the facet
 * shapes stay — which is why the return types live in `types/search`.
 */

type FilterKey = keyof Filters;

function matchesText(vehicle: Vehicle, term: string): boolean {
  const haystack = [
    vehicle.title,
    vehicle.brand.name,
    vehicle.model,
    vehicle.variant,
    vehicle.category.name,
    vehicle.location.city,
    vehicle.location.state,
    vehicle.specifications.bodyType,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  // Every word must appear somewhere, so "tata tipper" narrows rather than widens.
  return term
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

/** A city filter value may be a region slug ("delhi-ncr") or a city slug. */
function matchesCity(vehicle: Vehicle, slugs: readonly string[]): boolean {
  return slugs.some((slug) => {
    if (vehicle.location.regionSlug === slug) return true;
    if (vehicle.location.citySlug === slug) return true;
    const region = getRegionBySlug(slug);
    return region ? region.cities.includes(vehicle.location.city) : false;
  });
}

/** Predicate per filter, so facet counting can skip exactly one of them. */
const predicates: Record<
  FilterKey,
  (vehicle: Vehicle, filters: Filters) => boolean
> = {
  q: (v, f) => (f.q ? matchesText(v, f.q) : true),
  category: (v, f) => !f.category?.length || f.category.includes(v.category.id),
  brand: (v, f) => !f.brand?.length || f.brand.includes(v.brand.slug),
  model: (v, f) =>
    !f.model?.length ||
    f.model.includes(v.model.toLowerCase().replace(/\s+/g, "-")),
  city: (v, f) => !f.city?.length || matchesCity(v, f.city),
  fuel: (v, f) => !f.fuel?.length || f.fuel.includes(v.fuelType),
  transmission: (v, f) =>
    !f.transmission?.length ||
    (v.transmission ? f.transmission.includes(v.transmission) : false),
  condition: (v, f) =>
    !f.condition?.length || f.condition.includes(v.condition),
  sellerType: (v, f) =>
    !f.sellerType?.length || f.sellerType.includes(v.seller.type),
  minPrice: (v, f) => f.minPrice === undefined || v.price >= f.minPrice,
  maxPrice: (v, f) => f.maxPrice === undefined || v.price <= f.maxPrice,
  yearFrom: (v, f) =>
    f.yearFrom === undefined || v.manufacturingYear >= f.yearFrom,
  yearTo: (v, f) => f.yearTo === undefined || v.manufacturingYear <= f.yearTo,
  maxKm: (v, f) => f.maxKm === undefined || v.kilometers <= f.maxKm,
  maxOwners: (v, f) =>
    f.maxOwners === undefined || v.ownershipCount <= f.maxOwners,
  minGvw: (v, f) =>
    f.minGvw === undefined || (v.specifications.gvwKg ?? 0) >= f.minGvw,
  maxGvw: (v, f) =>
    f.maxGvw === undefined ||
    (v.specifications.gvwKg === undefined
      ? true
      : v.specifications.gvwKg <= f.maxGvw),
  minPayload: (v, f) =>
    f.minPayload === undefined ||
    (v.specifications.payloadKg ?? 0) >= f.minPayload,
  verifiedOnly: (v, f) => !f.verifiedOnly || v.verification.isVerified,
  negotiableOnly: (v, f) => !f.negotiableOnly || v.negotiable,
};

const FILTER_KEYS = Object.keys(predicates) as FilterKey[];

export function applyFilters(vehicles: Vehicle[], filters: Filters): Vehicle[] {
  return vehicles.filter((vehicle) =>
    FILTER_KEYS.every((key) => predicates[key](vehicle, filters)),
  );
}

/**
 * Counts for one facet group are computed with that group's own filter
 * removed. Otherwise selecting "Tata" would show every other brand at zero
 * and the user could never widen the search.
 */
function applyFiltersExcept(
  vehicles: Vehicle[],
  filters: Filters,
  except: FilterKey,
): Vehicle[] {
  const keys = FILTER_KEYS.filter((key) => key !== except);
  return vehicles.filter((vehicle) =>
    keys.every((key) => predicates[key](vehicle, filters)),
  );
}

function countBy<T extends string>(
  vehicles: Vehicle[],
  select: (vehicle: Vehicle) => T | undefined,
): Map<T, number> {
  const counts = new Map<T, number>();
  for (const vehicle of vehicles) {
    const key = select(vehicle);
    if (key === undefined) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function toFacet(
  counts: Map<string, number>,
  options: Array<{ value: string; label: string }>,
): FacetValue[] {
  return options
    .map((option) => ({
      value: option.value,
      label: option.label,
      count: counts.get(option.value) ?? 0,
    }))
    .filter((facet) => facet.count > 0)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function buildFacets(
  vehicles: Vehicle[],
  filters: Filters,
): SearchFacets {
  const categoryPool = applyFiltersExcept(vehicles, filters, "category");
  const brandPool = applyFiltersExcept(vehicles, filters, "brand");
  const cityPool = applyFiltersExcept(vehicles, filters, "city");
  const fuelPool = applyFiltersExcept(vehicles, filters, "fuel");
  const sellerPool = applyFiltersExcept(vehicles, filters, "sellerType");

  const priced = applyFilters(vehicles, {
    ...filters,
    minPrice: undefined,
    maxPrice: undefined,
  });
  const dated = applyFilters(vehicles, {
    ...filters,
    yearFrom: undefined,
    yearTo: undefined,
  });

  const prices = priced.map((v) => v.price);
  const years = dated.map((v) => v.manufacturingYear);

  return {
    category: toFacet(
      countBy(categoryPool, (v) => v.category.id),
      vehicleCategories.map((c) => ({ value: c.id, label: c.name })),
    ),
    brand: toFacet(
      countBy(brandPool, (v) => v.brand.slug),
      brands.map((b) => ({ value: b.slug, label: b.name })),
    ),
    city: toFacet(
      countBy(cityPool, (v) => v.location.regionSlug),
      regions.map((r) => ({ value: r.slug, label: r.name })),
    ),
    fuel: toFacet(
      countBy(fuelPool, (v) => v.fuelType),
      Object.entries(fuelTypeLabels).map(([value, label]) => ({
        value,
        label,
      })),
    ),
    sellerType: toFacet(
      countBy(sellerPool, (v) => v.seller.type),
      Object.entries(sellerTypeLabels).map(([value, label]) => ({
        value,
        label,
      })),
    ),
    priceRange: {
      min: prices.reduce((min, p) => (p < min ? p : min), prices[0] ?? 0),
      max: prices.reduce((max, p) => (p > max ? p : max), prices[0] ?? 0),
    },
    yearRange: {
      min: years.reduce((min, y) => (y < min ? y : min), years[0] ?? 0),
      max: years.reduce((max, y) => (y > max ? y : max), years[0] ?? 0),
    },
  };
}

/**
 * Relevance ranks a verified, freshly listed, frequently viewed vehicle
 * above a stale one — and honours the keyword when there is one.
 */
function relevanceScore(vehicle: Vehicle, term: string | undefined): number {
  let score = 0;
  if (vehicle.featured) score += 30;
  if (vehicle.verification.isVerified) score += 20;
  if (vehicle.verification.inspected) score += 10;
  score += Math.min(15, vehicle.viewCount / 300);

  const ageDays =
    (Date.now() - new Date(vehicle.createdAt).getTime()) / 86_400_000;
  score += Math.max(0, 15 - ageDays / 2);

  if (term) {
    const lower = term.toLowerCase();
    if (vehicle.title.toLowerCase().includes(lower)) score += 25;
    if (vehicle.brand.name.toLowerCase().includes(lower)) score += 10;
  }
  return score;
}

export function sortVehicles(
  vehicles: Vehicle[],
  sort: SearchQuery["sort"],
  term?: string,
): Vehicle[] {
  const sorted = [...vehicles];

  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "year-desc":
      return sorted.sort(
        (a, b) =>
          b.manufacturingYear - a.manufacturingYear ||
          a.kilometers - b.kilometers,
      );
    case "km-asc":
      return sorted.sort((a, b) => a.kilometers - b.kilometers);
    case "newest":
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "relevance":
    default:
      return sorted.sort(
        (a, b) => relevanceScore(b, term) - relevanceScore(a, term),
      );
  }
}
