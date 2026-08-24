"use client";

import { useSearchParams } from "next/navigation";
import { SearchBar, type SearchBarProps } from "./search-bar";

/**
 * The results-page search field. Reading `useSearchParams` opts the tree
 * out of static prerendering, so this component is always rendered inside
 * a Suspense boundary on the pages that use it.
 */
export function ResultsSearchBar(
  props: Omit<SearchBarProps, "defaultValue" | "preservedParams">,
) {
  const searchParams = useSearchParams();

  return (
    <SearchBar
      {...props}
      defaultValue={searchParams.get("q") ?? ""}
      preservedParams={searchParams.toString()}
    />
  );
}
