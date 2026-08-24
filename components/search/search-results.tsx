import { Suspense } from "react";
import { VehicleGrid } from "@/components/marketplace/vehicle-grid";
import { formatNumber } from "@/lib/utils/format-number";
import { countActiveFilters } from "@/features/search/utils";
import type { VehicleSearchResult } from "@/features/vehicles/api";
import type { SearchQuery } from "@/types/search";
import { ActiveFilters } from "./active-filters";
import { FilterSidebar } from "./search-filters";
import { MobileFilterSheet } from "./mobile-filter-sheet";
import { SearchEmptyState } from "./search-empty-state";
import { SearchPagination } from "./search-pagination";
import { SortSelector } from "./sort-selector";

export interface SearchResultsProps {
  query: SearchQuery;
  result: VehicleSearchResult;
}

/**
 * Sidebar + results layout, shared by /vehicles and every SEO landing page.
 * Server rendered; only the filter controls are client islands.
 */
export function SearchResults({ query, result }: SearchResultsProps) {
  const { page, facets } = result;
  const activeCount = countActiveFilters(query);
  const from = (page.page - 1) * page.pageSize + 1;
  const to = Math.min(page.page * page.pageSize, page.total);

  return (
    <div className="flex items-start gap-6 xl:gap-8">
      <Suspense
        fallback={<div className="hidden w-72 shrink-0 lg:block xl:w-80" />}
      >
        <FilterSidebar
          query={query}
          facets={facets}
          activeCount={activeCount}
        />
      </Suspense>

      <div className="min-w-0 flex-1">
        {/* Sticky above the mobile bottom bar, never overlapping it. */}
        <div className="sticky top-16 z-30 -mx-4 mb-4 border-b border-steel-200 bg-white/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
          <div className="flex items-center gap-2.5 lg:justify-between">
            <p className="hidden text-sm text-steel-600 lg:block">
              {page.total > 0 ? (
                <>
                  Showing{" "}
                  <span className="tabular font-semibold text-steel-900">
                    {formatNumber(from)}–{formatNumber(to)}
                  </span>{" "}
                  of{" "}
                  <span className="tabular font-semibold text-steel-900">
                    {formatNumber(page.total)}
                  </span>{" "}
                  trucks
                </>
              ) : (
                "No matching trucks"
              )}
            </p>

            <div className="flex flex-1 items-center gap-2 lg:flex-none">
              <Suspense fallback={null}>
                <MobileFilterSheet
                  query={query}
                  facets={facets}
                  activeCount={activeCount}
                  resultCount={page.total}
                />
              </Suspense>
              <Suspense fallback={null}>
                <SortSelector value={query.sort} />
              </Suspense>
            </div>
          </div>

          <p className="mt-2 text-xs text-steel-600 lg:hidden">
            {formatNumber(page.total)}{" "}
            {page.total === 1 ? "truck" : "trucks"}
          </p>
        </div>

        {activeCount > 0 && (
          <div className="mb-5">
            <Suspense fallback={null}>
              <ActiveFilters query={query} />
            </Suspense>
          </div>
        )}

        {page.items.length === 0 ? (
          <Suspense fallback={null}>
            <SearchEmptyState hasFilters={activeCount > 0} />
          </Suspense>
        ) : (
          <>
            <VehicleGrid vehicles={page.items} priorityCount={3} />

            <div className="mt-10">
              <Suspense fallback={null}>
                <SearchPagination
                  page={page.page}
                  totalPages={page.totalPages}
                />
              </Suspense>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
