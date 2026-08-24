"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFilterNavigation } from "@/features/search/hooks";
import { cn } from "@/lib/utils/cn";

export interface SearchPaginationProps {
  page: number;
  totalPages: number;
}

/** Compact page list: first, last, and a window around the current page. */
function pageWindow(page: number, totalPages: number): Array<number | "gap"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, page]);
  if (page > 1) pages.add(page - 1);
  if (page < totalPages) pages.add(page + 1);

  const sorted = [...pages].sort((a, b) => a - b);
  const output: Array<number | "gap"> = [];

  sorted.forEach((value, index) => {
    if (index > 0 && value - sorted[index - 1] > 1) output.push("gap");
    output.push(value);
  });

  return output;
}

export function SearchPagination({ page, totalPages }: SearchPaginationProps) {
  const { goToPage, isPending } = useFilterNavigation();

  if (totalPages <= 1) return null;

  const pages = pageWindow(page, totalPages);

  return (
    <nav
      aria-label="Search results pages"
      className={cn(
        "flex items-center justify-center gap-1.5",
        isPending && "opacity-60",
      )}
    >
      <button
        type="button"
        onClick={() => goToPage(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="grid size-10 place-items-center rounded-md border border-steel-300 bg-white text-steel-700 transition-colors hover:border-steel-400 hover:bg-steel-50 disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
      </button>

      <ul className="flex items-center gap-1.5">
        {pages.map((entry, index) =>
          entry === "gap" ? (
            <li
              key={`gap-${index}`}
              aria-hidden
              className="grid size-10 place-items-center text-sm text-steel-400"
            >
              …
            </li>
          ) : (
            <li key={entry}>
              <button
                type="button"
                onClick={() => goToPage(entry)}
                aria-current={entry === page ? "page" : undefined}
                aria-label={`Page ${entry}`}
                className={cn(
                  "tabular grid size-10 place-items-center rounded-md border text-sm font-semibold transition-colors",
                  entry === page
                    ? "border-steel-900 bg-steel-900 text-white"
                    : "border-steel-300 bg-white text-steel-700 hover:border-steel-400 hover:bg-steel-50",
                )}
              >
                {entry}
              </button>
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        onClick={() => goToPage(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="grid size-10 place-items-center rounded-md border border-steel-300 bg-white text-steel-700 transition-colors hover:border-steel-400 hover:bg-steel-50 disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
