"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";
import type { SearchQuery } from "@/types/search";
import { track } from "@/lib/analytics/analytics";

/**
 * The URL is the single source of truth for search state. This hook is the
 * only place that writes to it, so every filter control stays consistent
 * and every result page stays shareable.
 */
export function useFilterNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const params = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams],
  );

  const push = useCallback(
    (next: URLSearchParams) => {
      // Any filter change invalidates the current page number.
      next.delete("page");
      const query = next.toString();
      startTransition(() => {
        router.push(query ? `${pathname}?${query}` : pathname, {
          scroll: false,
        });
      });
    },
    [pathname, router],
  );

  /** Toggles one value inside a comma-separated multi-select param. */
  const toggleValue = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      const current = (next.get(key) ?? "").split(",").filter(Boolean);
      const selected = current.includes(value);
      const updated = selected
        ? current.filter((item) => item !== value)
        : [...current, value];

      if (updated.length) next.set(key, updated.join(","));
      else next.delete(key);

      if (!selected) track({ name: "filter_applied", filter: key, value });
      push(next);
    },
    [params, push],
  );

  const setValue = useCallback(
    (key: string, value: string | number | undefined | null) => {
      const next = new URLSearchParams(params.toString());
      if (value === undefined || value === null || value === "") {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
      push(next);
    },
    [params, push],
  );

  /** Applies several changes in one navigation, e.g. a price range. */
  const setValues = useCallback(
    (updates: Record<string, string | number | undefined | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === null || value === "") {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      }
      push(next);
    },
    [params, push],
  );

  const removeKey = useCallback(
    (key: string) => {
      const next = new URLSearchParams(params.toString());
      next.delete(key);
      push(next);
    },
    [params, push],
  );

  /** Clears filters but keeps the sort order the user chose. */
  const clearAll = useCallback(() => {
    const next = new URLSearchParams();
    const sort = params.get("sort");
    if (sort) next.set("sort", sort);
    push(next);
  }, [params, push]);

  const isChecked = useCallback(
    (key: string, value: string) =>
      (params.get(key) ?? "").split(",").filter(Boolean).includes(value),
    [params],
  );

  /** Sort is the one control that should not reset scroll position. */
  const setSort = useCallback(
    (sort: SearchQuery["sort"]) => {
      const next = new URLSearchParams(params.toString());
      if (sort === "relevance") next.delete("sort");
      else next.set("sort", sort);
      push(next);
    },
    [params, push],
  );

  const goToPage = useCallback(
    (page: number) => {
      const next = new URLSearchParams(params.toString());
      if (page <= 1) next.delete("page");
      else next.set("page", String(page));
      const query = next.toString();
      startTransition(() => {
        router.push(query ? `${pathname}?${query}` : pathname);
      });
    },
    [params, pathname, router],
  );

  return {
    params,
    isPending,
    toggleValue,
    setValue,
    setValues,
    removeKey,
    clearAll,
    isChecked,
    setSort,
    goToPage,
  };
}
