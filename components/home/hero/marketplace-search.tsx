"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { vehicleCategories } from "@/data/vehicle-categories";
import { regions } from "@/data/locations";
import { buildSearchHref } from "@/features/search/utils";
import type { VehicleCategoryId } from "@/types/vehicle";

const ANY = "any";

/**
 * The hero search. Keyword, category and city compose into the same URL
 * shape the results page parses, so the landing search and the filter
 * sidebar are never out of step.
 */
export function MarketplaceSearch() {
  const router = useRouter();
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState<string>(ANY);
  const [city, setCity] = useState<string>(ANY);

  function submit(event: FormEvent) {
    event.preventDefault();
    router.push(
      buildSearchHref("/vehicles", {
        q: term.trim() || undefined,
        category:
          category === ANY ? undefined : [category as VehicleCategoryId],
        city: city === ANY ? undefined : [city],
      }),
    );
  }

  return (
    <form
      role="search"
      onSubmit={submit}
      className="rounded-xl border border-white/15 bg-white/10 p-2 shadow-xl backdrop-blur-md sm:p-2.5"
    >
      <div className="grid gap-2 rounded-lg bg-white p-2 sm:grid-cols-[minmax(0,1.4fr)_minmax(9.5rem,0.9fr)_minmax(8rem,0.8fr)_auto] sm:items-center sm:gap-1.5">
        <div className="relative flex items-center">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 size-4 text-steel-400"
          />
          <label htmlFor="hero-q" className="sr-only">
            Search by brand or model
          </label>
          <input
            id="hero-q"
            type="search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Tata 407, tipper, 19 ft container…"
            enterKeyHint="search"
            className="h-12 w-full rounded-md border-0 pr-2 pl-9 text-sm text-steel-900 placeholder:text-steel-400 focus:ring-0 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
        </div>

        <div className="sm:border-l sm:border-steel-200 sm:pl-1.5">
          <label htmlFor="hero-category" className="sr-only">
            Vehicle category
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger
              id="hero-category"
              className="h-12 border-0 shadow-none focus:ring-0"
            >
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>All categories</SelectItem>
              {vehicleCategories.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="sm:border-l sm:border-steel-200 sm:pl-1.5">
          <label htmlFor="hero-city" className="sr-only">
            City
          </label>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger
              id="hero-city"
              className="h-12 border-0 shadow-none focus:ring-0"
            >
              <SelectValue placeholder="All India" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>All India</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region.slug} value={region.slug}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" variant="accent" size="lg" className="sm:px-7">
          <Search className="sm:hidden" />
          Search
        </Button>
      </div>
    </form>
  );
}
