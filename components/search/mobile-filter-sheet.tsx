"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useFilterNavigation } from "@/features/search/hooks";
import { formatNumber } from "@/lib/utils/format-number";
import type { SearchFacets, SearchQuery } from "@/types/search";
import { SearchFilters } from "./search-filters";

export interface MobileFilterSheetProps {
  query: SearchQuery;
  facets: SearchFacets;
  activeCount: number;
  resultCount: number;
}

/**
 * Full-height filter sheet for touch widths. Filters apply immediately as
 * they are tapped — the footer button dismisses and shows the count that
 * is already live behind the sheet.
 */
export function MobileFilterSheet({
  query,
  facets,
  activeCount,
  resultCount,
}: MobileFilterSheetProps) {
  const [open, setOpen] = useState(false);
  const { clearAll } = useFilterNavigation();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        className="w-full lg:hidden"
      >
        <SlidersHorizontal />
        Filters
        {activeCount > 0 && (
          <span className="tabular grid min-w-5 place-items-center rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
            {activeCount}
          </span>
        )}
      </Button>

      <SheetContent side="bottom" className="h-[92dvh] lg:hidden">
        <SheetHeader className="flex items-center justify-between gap-3">
          <SheetTitle className="font-display text-base font-bold text-steel-900">
            Filters
            {activeCount > 0 && (
              <span className="tabular ml-1.5 font-sans text-sm font-medium text-steel-500">
                ({activeCount})
              </span>
            )}
          </SheetTitle>
          {activeCount > 0 && (
            <Button variant="link" size="xs" onClick={clearAll}>
              Clear all
            </Button>
          )}
        </SheetHeader>

        <SheetBody>
          <SearchFilters query={query} facets={facets} />
        </SheetBody>

        <SheetFooter>
          <Button block size="lg" onClick={() => setOpen(false)}>
            Show {formatNumber(resultCount)}{" "}
            {resultCount === 1 ? "truck" : "trucks"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
