import type { SearchQuery, SortOption, VehicleFilters } from "@/types/search";
import { searchQuerySchema } from "./schemas";

/** What Next hands a page as `searchParams`. */
export type SearchParamsInput = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Turns raw URL params into a validated `SearchQuery`. Unknown, malformed
 * or out-of-range values are dropped rather than throwing — a bad link
 * should degrade to a broader search, not a 500.
 */
export function parseSearchParams(params: SearchParamsInput): SearchQuery {
  const flat: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(params)) {
    flat[key] = firstValue(value);
  }

  const parsed = searchQuerySchema.parse(flat);

  // A reversed range is a typo, not a request for zero results.
  let { minPrice, maxPrice, yearFrom, yearTo, minGvw, maxGvw } = parsed;
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }
  if (yearFrom !== undefined && yearTo !== undefined && yearFrom > yearTo) {
    [yearFrom, yearTo] = [yearTo, yearFrom];
  }
  if (minGvw !== undefined && maxGvw !== undefined && minGvw > maxGvw) {
    [minGvw, maxGvw] = [maxGvw, minGvw];
  }

  return {
    q: parsed.q,
    category: parsed.category,
    brand: parsed.brand,
    model: parsed.model,
    city: parsed.city,
    fuel: parsed.fuel,
    transmission: parsed.transmission,
    condition: parsed.condition,
    sellerType: parsed.sellerType,
    minPrice,
    maxPrice,
    yearFrom,
    yearTo,
    maxKm: parsed.maxKm,
    maxOwners: parsed.maxOwners,
    minGvw,
    maxGvw,
    minPayload: parsed.minPayload,
    verifiedOnly: parsed.verified,
    negotiableOnly: parsed.negotiable,
    sort: parsed.sort,
    page: parsed.page,
    pageSize: parsed.pageSize,
  };
}

/** Inverse of `parseSearchParams`. Omits defaults so URLs stay short. */
export function buildSearchParams(
  query: Partial<SearchQuery>,
): URLSearchParams {
  const params = new URLSearchParams();

  const setCsv = (key: string, value: readonly string[] | undefined) => {
    if (value?.length) params.set(key, value.join(","));
  };
  const setNumber = (key: string, value: number | undefined) => {
    if (value !== undefined) params.set(key, String(value));
  };

  if (query.q) params.set("q", query.q);
  setCsv("category", query.category);
  setCsv("brand", query.brand);
  setCsv("model", query.model);
  setCsv("city", query.city);
  setCsv("fuel", query.fuel);
  setCsv("transmission", query.transmission);
  setCsv("condition", query.condition);
  setCsv("sellerType", query.sellerType);
  setNumber("minPrice", query.minPrice);
  setNumber("maxPrice", query.maxPrice);
  setNumber("yearFrom", query.yearFrom);
  setNumber("yearTo", query.yearTo);
  setNumber("maxKm", query.maxKm);
  setNumber("maxOwners", query.maxOwners);
  setNumber("minGvw", query.minGvw);
  setNumber("maxGvw", query.maxGvw);
  setNumber("minPayload", query.minPayload);
  if (query.verifiedOnly) params.set("verified", "1");
  if (query.negotiableOnly) params.set("negotiable", "1");
  if (query.sort && query.sort !== "relevance") params.set("sort", query.sort);
  if (query.page && query.page > 1) params.set("page", String(query.page));

  return params;
}

export function buildSearchHref(
  pathname: string,
  query: Partial<SearchQuery>,
): string {
  const params = buildSearchParams(query);
  const suffix = params.toString();
  return suffix ? `${pathname}?${suffix}` : pathname;
}

const FILTER_KEYS = [
  "q",
  "category",
  "brand",
  "model",
  "city",
  "fuel",
  "transmission",
  "condition",
  "sellerType",
  "minPrice",
  "maxPrice",
  "yearFrom",
  "yearTo",
  "maxKm",
  "maxOwners",
  "minGvw",
  "maxGvw",
  "minPayload",
  "verifiedOnly",
  "negotiableOnly",
] as const satisfies readonly (keyof VehicleFilters)[];

/** How many filters the user has actually applied. Drives the badge count. */
export function countActiveFilters(filters: VehicleFilters): number {
  return FILTER_KEYS.reduce((total, key) => {
    const value = filters[key];
    if (value === undefined || value === false) return total;
    if (Array.isArray(value)) return total + value.length;
    if (typeof value === "string" && value.trim() === "") return total;
    return total + 1;
  }, 0);
}

export function hasActiveFilters(filters: VehicleFilters): boolean {
  return countActiveFilters(filters) > 0;
}

/** Strips every filter but keeps sort, and resets pagination. */
export function clearedQuery(query: SearchQuery): SearchQuery {
  return { sort: query.sort, page: 1, pageSize: query.pageSize };
}

/** Adds or removes one value from a multi-select filter group. */
export function toggleFilterValue<T extends string>(
  current: readonly T[] | undefined,
  value: T,
): T[] | undefined {
  const set = new Set(current ?? []);
  if (set.has(value)) {
    set.delete(value);
  } else {
    set.add(value);
  }
  const next = Array.from(set);
  return next.length ? next : undefined;
}

export const sortLabels: Record<SortOption, string> = {
  relevance: "Most relevant",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  "year-desc": "Year: newest first",
  "km-asc": "Kilometres: lowest first",
  newest: "Recently listed",
};
