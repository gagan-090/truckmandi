"use client";

import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useFilterNavigation } from "@/features/search/hooks";

export function SearchEmptyState({ hasFilters }: { hasFilters: boolean }) {
  const { clearAll } = useFilterNavigation();

  return (
    <EmptyState
      icon={<SearchX />}
      title="No trucks found"
      description={
        hasFilters
          ? "Try removing a filter or expanding your search area. Widening the price range or including nearby cities usually helps."
          : "There are no listings in this section yet. New trucks are added every day — check back soon."
      }
      action={
        hasFilters ? (
          <>
            <Button onClick={clearAll}>Clear filters</Button>
            <Button variant="secondary" asChild>
              <Link href="/vehicles">Browse all trucks</Link>
            </Button>
          </>
        ) : (
          <Button asChild>
            <Link href="/vehicles">Browse all trucks</Link>
          </Button>
        )
      }
    />
  );
}
