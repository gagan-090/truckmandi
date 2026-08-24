"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFilterNavigation } from "@/features/search/hooks";
import {
  conditionOptions,
  kilometerBuckets,
  ownershipBuckets,
  priceBuckets,
  transmissionOptions,
} from "@/data/vehicle-types";
import { CURRENT_YEAR, OLDEST_LISTING_YEAR } from "@/config/constants";
import { formatPriceCompact } from "@/lib/utils/format-currency";
import type { SearchFacets, SearchQuery } from "@/types/search";
import { FacetCheckbox, FilterGroup } from "./filter-group";

export interface SearchFiltersProps {
  query: SearchQuery;
  facets: SearchFacets;
}

/**
 * The full filter set, shared by the desktop sidebar and the mobile sheet.
 * Every control writes to the URL through `useFilterNavigation`; nothing
 * here holds filter state of its own.
 */
export function SearchFilters({ query, facets }: SearchFiltersProps) {
  const { toggleValue, setValue, setValues, isChecked } = useFilterNavigation();

  const priceActive =
    query.minPrice !== undefined || query.maxPrice !== undefined;
  const yearActive = query.yearFrom !== undefined || query.yearTo !== undefined;

  return (
    <div className="divide-y divide-steel-200">
      {facets.category.length > 0 && (
        <FilterGroup title="Category" count={query.category?.length}>
          <div className="space-y-0.5">
            {facets.category.map((facet) => (
              <FacetCheckbox
                key={facet.value}
                label={facet.label}
                count={facet.count}
                checked={isChecked("category", facet.value)}
                onToggle={() => toggleValue("category", facet.value)}
              />
            ))}
          </div>
        </FilterGroup>
      )}

      {facets.brand.length > 0 && (
        <FilterGroup title="Brand" count={query.brand?.length}>
          <div className="max-h-64 space-y-0.5 overflow-y-auto pr-1">
            {facets.brand.map((facet) => (
              <FacetCheckbox
                key={facet.value}
                label={facet.label}
                count={facet.count}
                checked={isChecked("brand", facet.value)}
                onToggle={() => toggleValue("brand", facet.value)}
              />
            ))}
          </div>
        </FilterGroup>
      )}

      <FilterGroup title="Budget" count={priceActive ? 1 : 0}>
        <div className="space-y-0.5">
          {priceBuckets.map((bucket) => {
            const selected =
              query.minPrice === bucket.min && query.maxPrice === bucket.max;
            return (
              <FacetCheckbox
                key={bucket.label}
                label={bucket.label}
                checked={selected}
                onToggle={() =>
                  setValues(
                    selected
                      ? { minPrice: null, maxPrice: null }
                      : { minPrice: bucket.min, maxPrice: bucket.max },
                  )
                }
              />
            );
          })}
        </div>

        <div className="mt-3.5 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div>
            <label htmlFor="minPrice" className="sr-only">
              Minimum price
            </label>
            <Input
              id="minPrice"
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="Min ₹"
              defaultValue={query.minPrice ?? ""}
              key={`min-${query.minPrice ?? ""}`}
              onBlur={(event) =>
                setValue("minPrice", event.currentTarget.value || null)
              }
              className="h-10 text-sm"
            />
          </div>
          <span aria-hidden className="text-sm text-steel-400">
            to
          </span>
          <div>
            <label htmlFor="maxPrice" className="sr-only">
              Maximum price
            </label>
            <Input
              id="maxPrice"
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="Max ₹"
              defaultValue={query.maxPrice ?? ""}
              key={`max-${query.maxPrice ?? ""}`}
              onBlur={(event) =>
                setValue("maxPrice", event.currentTarget.value || null)
              }
              className="h-10 text-sm"
            />
          </div>
        </div>

        {facets.priceRange.max > 0 && (
          <p className="mt-2 text-xs text-steel-500">
            Listings range from ₹{formatPriceCompact(facets.priceRange.min)} to
            ₹{formatPriceCompact(facets.priceRange.max)}
          </p>
        )}
      </FilterGroup>

      {facets.city.length > 0 && (
        <FilterGroup title="Location" count={query.city?.length}>
          <div className="max-h-64 space-y-0.5 overflow-y-auto pr-1">
            {facets.city.map((facet) => (
              <FacetCheckbox
                key={facet.value}
                label={facet.label}
                count={facet.count}
                checked={isChecked("city", facet.value)}
                onToggle={() => toggleValue("city", facet.value)}
              />
            ))}
          </div>
        </FilterGroup>
      )}

      <FilterGroup title="Year" count={yearActive ? 1 : 0} defaultOpen={false}>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div>
            <label htmlFor="yearFrom" className="sr-only">
              From year
            </label>
            <Input
              id="yearFrom"
              type="number"
              inputMode="numeric"
              min={OLDEST_LISTING_YEAR}
              max={CURRENT_YEAR}
              placeholder={String(OLDEST_LISTING_YEAR)}
              defaultValue={query.yearFrom ?? ""}
              key={`yf-${query.yearFrom ?? ""}`}
              onBlur={(event) =>
                setValue("yearFrom", event.currentTarget.value || null)
              }
              className="h-10 text-sm"
            />
          </div>
          <span aria-hidden className="text-sm text-steel-400">
            to
          </span>
          <div>
            <label htmlFor="yearTo" className="sr-only">
              To year
            </label>
            <Input
              id="yearTo"
              type="number"
              inputMode="numeric"
              min={OLDEST_LISTING_YEAR}
              max={CURRENT_YEAR}
              placeholder={String(CURRENT_YEAR)}
              defaultValue={query.yearTo ?? ""}
              key={`yt-${query.yearTo ?? ""}`}
              onBlur={(event) =>
                setValue("yearTo", event.currentTarget.value || null)
              }
              className="h-10 text-sm"
            />
          </div>
        </div>
      </FilterGroup>

      <FilterGroup
        title="Kilometres driven"
        count={query.maxKm !== undefined ? 1 : 0}
        defaultOpen={false}
      >
        <div className="space-y-0.5">
          {kilometerBuckets.map((bucket) => (
            <FacetCheckbox
              key={bucket.label}
              label={bucket.label}
              checked={query.maxKm === bucket.max}
              onToggle={() =>
                setValue(
                  "maxKm",
                  query.maxKm === bucket.max ? null : bucket.max,
                )
              }
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup
        title="Ownership"
        count={query.maxOwners !== undefined ? 1 : 0}
        defaultOpen={false}
      >
        <div className="space-y-0.5">
          {ownershipBuckets.map((bucket) => (
            <FacetCheckbox
              key={bucket.label}
              label={bucket.label}
              checked={query.maxOwners === bucket.max}
              onToggle={() =>
                setValue(
                  "maxOwners",
                  query.maxOwners === bucket.max ? null : bucket.max,
                )
              }
            />
          ))}
        </div>
      </FilterGroup>

      {facets.fuel.length > 0 && (
        <FilterGroup
          title="Fuel"
          count={query.fuel?.length}
          defaultOpen={false}
        >
          <div className="space-y-0.5">
            {facets.fuel.map((facet) => (
              <FacetCheckbox
                key={facet.value}
                label={facet.label}
                count={facet.count}
                checked={isChecked("fuel", facet.value)}
                onToggle={() => toggleValue("fuel", facet.value)}
              />
            ))}
          </div>
        </FilterGroup>
      )}

      <FilterGroup
        title="Transmission"
        count={query.transmission?.length}
        defaultOpen={false}
      >
        <div className="space-y-0.5">
          {transmissionOptions.map((option) => (
            <FacetCheckbox
              key={option.value}
              label={option.label}
              checked={isChecked("transmission", option.value)}
              onToggle={() => toggleValue("transmission", option.value)}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup
        title="Load capacity"
        count={
          (query.minGvw !== undefined ? 1 : 0) +
          (query.minPayload !== undefined ? 1 : 0)
        }
        defaultOpen={false}
      >
        <div className="space-y-3">
          <div>
            <label
              htmlFor="minGvw"
              className="mb-1.5 block text-xs font-medium text-steel-600"
            >
              Minimum GVW (kg)
            </label>
            <Input
              id="minGvw"
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="e.g. 7500"
              defaultValue={query.minGvw ?? ""}
              key={`gvw-${query.minGvw ?? ""}`}
              onBlur={(event) =>
                setValue("minGvw", event.currentTarget.value || null)
              }
              className="h-10 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="minPayload"
              className="mb-1.5 block text-xs font-medium text-steel-600"
            >
              Minimum payload (kg)
            </label>
            <Input
              id="minPayload"
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="e.g. 3000"
              defaultValue={query.minPayload ?? ""}
              key={`pl-${query.minPayload ?? ""}`}
              onBlur={(event) =>
                setValue("minPayload", event.currentTarget.value || null)
              }
              className="h-10 text-sm"
            />
          </div>
        </div>
      </FilterGroup>

      <FilterGroup
        title="Condition"
        count={query.condition?.length}
        defaultOpen={false}
      >
        <div className="space-y-0.5">
          {conditionOptions.map((option) => (
            <FacetCheckbox
              key={option.value}
              label={option.label}
              checked={isChecked("condition", option.value)}
              onToggle={() => toggleValue("condition", option.value)}
            />
          ))}
        </div>
      </FilterGroup>

      {facets.sellerType.length > 0 && (
        <FilterGroup
          title="Seller type"
          count={query.sellerType?.length}
          defaultOpen={false}
        >
          <div className="space-y-0.5">
            {facets.sellerType.map((facet) => (
              <FacetCheckbox
                key={facet.value}
                label={facet.label}
                count={facet.count}
                checked={isChecked("sellerType", facet.value)}
                onToggle={() => toggleValue("sellerType", facet.value)}
              />
            ))}
          </div>
        </FilterGroup>
      )}

      <FilterGroup
        title="Trust & pricing"
        count={(query.verifiedOnly ? 1 : 0) + (query.negotiableOnly ? 1 : 0)}
      >
        <div className="space-y-0.5">
          <FacetCheckbox
            label="Verified listings only"
            checked={Boolean(query.verifiedOnly)}
            onToggle={() =>
              setValue("verified", query.verifiedOnly ? null : "1")
            }
          />
          <FacetCheckbox
            label="Price negotiable"
            checked={Boolean(query.negotiableOnly)}
            onToggle={() =>
              setValue("negotiable", query.negotiableOnly ? null : "1")
            }
          />
        </div>
      </FilterGroup>
    </div>
  );
}

/** Sidebar wrapper with the clear-all control. */
export function FilterSidebar({
  query,
  facets,
  activeCount,
}: SearchFiltersProps & { activeCount: number }) {
  const { clearAll } = useFilterNavigation();

  return (
    <aside
      aria-label="Search filters"
      className="hidden w-72 shrink-0 lg:block xl:w-80"
    >
      <div className="sticky top-[5.5rem] max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-lg border border-steel-200 bg-white px-4 pb-2">
        <div className="sticky top-0 z-10 -mx-4 flex items-center justify-between gap-2 border-b border-steel-200 bg-white px-4 py-3.5">
          <h2 className="text-sm font-bold text-steel-900">
            Filters
            {activeCount > 0 && (
              <span className="tabular ml-1.5 text-steel-500">
                ({activeCount})
              </span>
            )}
          </h2>
          {activeCount > 0 && (
            <Button variant="link" size="xs" onClick={clearAll}>
              Clear all
            </Button>
          )}
        </div>

        <SearchFilters query={query} facets={facets} />
      </div>
    </aside>
  );
}
