"use client";

import { Button } from "@/components/ui/button";
import { getBrandBySlug } from "@/data/brands";
import { getRegionBySlug } from "@/data/locations";
import { getCategoryById } from "@/data/vehicle-categories";
import {
  conditionLabels,
  fuelTypeLabels,
  sellerTypeLabels,
  transmissionLabels,
} from "@/data/vehicle-types";
import { useFilterNavigation } from "@/features/search/hooks";
import { formatPriceShort } from "@/lib/utils/format-currency";
import { formatKilometers, formatWeight } from "@/lib/utils/format-number";
import { titleCase } from "@/lib/utils/slugify";
import type { SearchQuery } from "@/types/search";
import { FilterChip } from "./filter-chip";

/**
 * Every applied filter as a removable chip. This is what makes a long URL
 * legible — the user can see and undo exactly what narrowed the results.
 */
export function ActiveFilters({ query }: { query: SearchQuery }) {
  const { toggleValue, removeKey, clearAll, setValues } = useFilterNavigation();

  const chips: Array<{ key: string; label: string; onRemove: () => void }> = [];

  if (query.q) {
    chips.push({
      key: "q",
      label: `“${query.q}”`,
      onRemove: () => removeKey("q"),
    });
  }

  for (const id of query.category ?? []) {
    chips.push({
      key: `category-${id}`,
      label: getCategoryById(id)?.name ?? titleCase(id),
      onRemove: () => toggleValue("category", id),
    });
  }

  for (const slug of query.brand ?? []) {
    chips.push({
      key: `brand-${slug}`,
      label: getBrandBySlug(slug)?.name ?? titleCase(slug),
      onRemove: () => toggleValue("brand", slug),
    });
  }

  for (const slug of query.city ?? []) {
    chips.push({
      key: `city-${slug}`,
      label: getRegionBySlug(slug)?.name ?? titleCase(slug),
      onRemove: () => toggleValue("city", slug),
    });
  }

  for (const fuel of query.fuel ?? []) {
    chips.push({
      key: `fuel-${fuel}`,
      label: fuelTypeLabels[fuel],
      onRemove: () => toggleValue("fuel", fuel),
    });
  }

  for (const value of query.transmission ?? []) {
    chips.push({
      key: `transmission-${value}`,
      label: transmissionLabels[value],
      onRemove: () => toggleValue("transmission", value),
    });
  }

  for (const value of query.condition ?? []) {
    chips.push({
      key: `condition-${value}`,
      label: `${conditionLabels[value]} condition`,
      onRemove: () => toggleValue("condition", value),
    });
  }

  for (const value of query.sellerType ?? []) {
    chips.push({
      key: `sellerType-${value}`,
      label: sellerTypeLabels[value],
      onRemove: () => toggleValue("sellerType", value),
    });
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    const from = query.minPrice ? formatPriceShort(query.minPrice) : null;
    const to = query.maxPrice ? formatPriceShort(query.maxPrice) : null;
    chips.push({
      key: "price",
      label:
        from && to ? `${from} – ${to}` : from ? `Above ${from}` : `Under ${to}`,
      onRemove: () => setValues({ minPrice: null, maxPrice: null }),
    });
  }

  if (query.yearFrom !== undefined || query.yearTo !== undefined) {
    chips.push({
      key: "year",
      label:
        query.yearFrom && query.yearTo
          ? `${query.yearFrom} – ${query.yearTo}`
          : query.yearFrom
            ? `${query.yearFrom} onwards`
            : `Up to ${query.yearTo}`,
      onRemove: () => setValues({ yearFrom: null, yearTo: null }),
    });
  }

  if (query.maxKm !== undefined) {
    chips.push({
      key: "maxKm",
      label: `Under ${formatKilometers(query.maxKm)}`,
      onRemove: () => removeKey("maxKm"),
    });
  }

  if (query.maxOwners !== undefined) {
    chips.push({
      key: "maxOwners",
      label:
        query.maxOwners === 1
          ? "First owner only"
          : `Up to ${query.maxOwners} owners`,
      onRemove: () => removeKey("maxOwners"),
    });
  }

  if (query.minGvw !== undefined) {
    chips.push({
      key: "minGvw",
      label: `GVW ${formatWeight(query.minGvw)}+`,
      onRemove: () => removeKey("minGvw"),
    });
  }

  if (query.minPayload !== undefined) {
    chips.push({
      key: "minPayload",
      label: `Payload ${formatWeight(query.minPayload)}+`,
      onRemove: () => removeKey("minPayload"),
    });
  }

  if (query.verifiedOnly) {
    chips.push({
      key: "verified",
      label: "Verified only",
      onRemove: () => removeKey("verified"),
    });
  }

  if (query.negotiableOnly) {
    chips.push({
      key: "negotiable",
      label: "Negotiable",
      onRemove: () => removeKey("negotiable"),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <FilterChip
          key={chip.key}
          label={chip.label}
          onRemove={chip.onRemove}
        />
      ))}
      {chips.length > 1 && (
        <Button variant="link" size="xs" onClick={clearAll} className="ml-1">
          Clear all
        </Button>
      )}
    </div>
  );
}
