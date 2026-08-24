import { z } from "zod";
import { SEARCH_PAGE_SIZE } from "@/config/constants";
import { SELLER_TYPES } from "@/types/seller";
import { SORT_OPTIONS } from "@/types/search";
import {
  FUEL_TYPES,
  TRANSMISSIONS,
  VEHICLE_CATEGORIES,
  VEHICLE_CONDITIONS,
} from "@/types/vehicle";

/**
 * Search params arrive from the address bar, so they are untrusted input.
 * Everything is coerced and clamped here; the rest of the app consumes the
 * parsed `SearchQuery` and never touches raw params.
 */

/** Multi-value params are comma separated: `?brand=tata,mahindra`. */
function csvEnum<T extends readonly [string, ...string[]]>(values: T) {
  const member = z.enum(values);
  return z
    .string()
    .optional()
    .transform((raw) => {
      if (!raw) return undefined;
      const parsed = raw
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
        .filter((part) => member.safeParse(part).success) as T[number][];
      return parsed.length ? Array.from(new Set(parsed)) : undefined;
    });
}

/** Free-form slug lists (brands, cities, models) that the API owns. */
const csvSlug = z
  .string()
  .optional()
  .transform((raw) => {
    if (!raw) return undefined;
    const parsed = raw
      .split(",")
      .map((part) => part.trim().toLowerCase())
      .filter((part) => /^[a-z0-9-]{1,60}$/.test(part));
    return parsed.length ? Array.from(new Set(parsed)).slice(0, 20) : undefined;
  });

function boundedInt(min: number, max: number) {
  return z
    .string()
    .optional()
    .transform((raw) => {
      if (raw === undefined || raw === "") return undefined;
      const value = Number(raw);
      if (!Number.isFinite(value)) return undefined;
      return Math.min(max, Math.max(min, Math.round(value)));
    });
}

const flag = z
  .string()
  .optional()
  .transform((raw) => (raw === "1" || raw === "true" ? true : undefined));

const CURRENT_YEAR = new Date().getFullYear();

export const searchQuerySchema = z.object({
  q: z
    .string()
    .optional()
    .transform((raw) => {
      const trimmed = raw?.trim().slice(0, 80);
      return trimmed ? trimmed : undefined;
    }),
  category: csvEnum(VEHICLE_CATEGORIES),
  brand: csvSlug,
  model: csvSlug,
  city: csvSlug,
  fuel: csvEnum(FUEL_TYPES),
  transmission: csvEnum(TRANSMISSIONS),
  condition: csvEnum(VEHICLE_CONDITIONS),
  sellerType: csvEnum(SELLER_TYPES),
  minPrice: boundedInt(0, 100_000_000),
  maxPrice: boundedInt(0, 100_000_000),
  yearFrom: boundedInt(1990, CURRENT_YEAR + 1),
  yearTo: boundedInt(1990, CURRENT_YEAR + 1),
  maxKm: boundedInt(0, 2_000_000),
  maxOwners: boundedInt(1, 10),
  minGvw: boundedInt(0, 100_000),
  maxGvw: boundedInt(0, 100_000),
  minPayload: boundedInt(0, 100_000),
  verified: flag,
  negotiable: flag,
  sort: z
    .string()
    .optional()
    .transform((raw) =>
      SORT_OPTIONS.includes(raw as (typeof SORT_OPTIONS)[number])
        ? (raw as (typeof SORT_OPTIONS)[number])
        : "relevance",
    ),
  page: z
    .string()
    .optional()
    .transform((raw) => {
      const value = Number(raw);
      return Number.isFinite(value) && value > 0
        ? Math.min(500, Math.floor(value))
        : 1;
    }),
  pageSize: z
    .string()
    .optional()
    .transform((raw) => {
      const value = Number(raw);
      return Number.isFinite(value) && value > 0
        ? Math.min(48, Math.floor(value))
        : SEARCH_PAGE_SIZE;
    }),
});

export type RawSearchQuery = z.output<typeof searchQuerySchema>;
