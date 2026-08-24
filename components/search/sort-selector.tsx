"use client";

import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterNavigation } from "@/features/search/hooks";
import { sortLabels } from "@/features/search/utils";
import { SORT_OPTIONS } from "@/types/search";
import type { SortOption } from "@/types/search";

export function SortSelector({ value }: { value: SortOption }) {
  const { setSort } = useFilterNavigation();

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown
        aria-hidden
        className="hidden size-4 shrink-0 text-steel-400 sm:block"
      />
      <label htmlFor="sort" className="sr-only">
        Sort results
      </label>
      <Select
        value={value}
        onValueChange={(next) => setSort(next as SortOption)}
      >
        <SelectTrigger id="sort" className="h-10 w-full min-w-44 sm:w-52">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {sortLabels[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
