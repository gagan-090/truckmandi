import { describe, expect, it } from "vitest";
import { mockVehicles } from "@/data/mock-vehicles";
import {
  applyFilters,
  buildFacets,
  sortVehicles,
} from "@/features/vehicles/filtering";
import { parseSearchParams } from "@/features/search/utils";

const query = (params: Record<string, string>) => parseSearchParams(params);

describe("applyFilters", () => {
  it("returns everything for an empty query", () => {
    expect(applyFilters(mockVehicles, query({}))).toHaveLength(
      mockVehicles.length,
    );
  });

  it("narrows by category", () => {
    const result = applyFilters(mockVehicles, query({ category: "tippers" }));
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((v) => v.category.id === "tippers")).toBe(true);
  });

  it("treats multiple values in one group as OR", () => {
    const result = applyFilters(
      mockVehicles,
      query({ category: "tippers,buses" }),
    );
    expect(
      result.every((v) => ["tippers", "buses"].includes(v.category.id)),
    ).toBe(true);
    expect(result.length).toBeGreaterThan(
      applyFilters(mockVehicles, query({ category: "tippers" })).length,
    );
  });

  it("treats different groups as AND", () => {
    const result = applyFilters(
      mockVehicles,
      query({ category: "tippers", brand: "tata" }),
    );
    expect(
      result.every(
        (v) => v.category.id === "tippers" && v.brand.slug === "tata",
      ),
    ).toBe(true);
  });

  it("matches a region slug and the cities inside it", () => {
    const byRegion = applyFilters(mockVehicles, query({ city: "delhi-ncr" }));
    expect(byRegion.length).toBeGreaterThan(0);
    expect(
      byRegion.every((v) =>
        ["New Delhi", "Gurugram", "Noida", "Faridabad", "Ghaziabad"].includes(
          v.location.city,
        ),
      ),
    ).toBe(true);
  });

  it("respects price bounds", () => {
    const result = applyFilters(
      mockVehicles,
      query({ minPrice: "1000000", maxPrice: "2000000" }),
    );
    expect(
      result.every((v) => v.price >= 1_000_000 && v.price <= 2_000_000),
    ).toBe(true);
  });

  it("requires every keyword to match, so terms narrow", () => {
    const one = applyFilters(mockVehicles, query({ q: "tata" }));
    const two = applyFilters(mockVehicles, query({ q: "tata tipper" }));

    expect(two.length).toBeLessThanOrEqual(one.length);
    expect(two.every((v) => v.brand.slug === "tata")).toBe(true);
  });

  it("filters on verification", () => {
    const result = applyFilters(mockVehicles, query({ verified: "1" }));
    expect(result.every((v) => v.verification.isVerified)).toBe(true);
  });

  it("keeps vehicles with no GVW out of a minimum-GVW search", () => {
    const result = applyFilters(mockVehicles, query({ minGvw: "16000" }));
    expect(result.every((v) => (v.specifications.gvwKg ?? 0) >= 16_000)).toBe(
      true,
    );
  });

  it("returns nothing for a contradictory query rather than throwing", () => {
    const result = applyFilters(
      mockVehicles,
      query({ category: "buses", fuel: "electric" }),
    );
    expect(result).toEqual([]);
  });
});

describe("buildFacets", () => {
  it("counts a group with that group's own filter removed", () => {
    // With Tata selected, other brands must still show reachable counts —
    // otherwise the user can never widen the search.
    const facets = buildFacets(mockVehicles, query({ brand: "tata" }));
    const others = facets.brand.filter((facet) => facet.value !== "tata");

    expect(others.length).toBeGreaterThan(0);
    expect(others.every((facet) => facet.count > 0)).toBe(true);
  });

  it("still applies other groups when counting", () => {
    const all = buildFacets(mockVehicles, query({}));
    const narrowed = buildFacets(mockVehicles, query({ category: "tippers" }));

    const allTata = all.brand.find((f) => f.value === "tata")?.count ?? 0;
    const tipperTata =
      narrowed.brand.find((f) => f.value === "tata")?.count ?? 0;

    expect(tipperTata).toBeLessThan(allTata);
  });

  it("omits facet values with no results", () => {
    const facets = buildFacets(mockVehicles, query({ category: "buses" }));
    expect(facets.brand.every((facet) => facet.count > 0)).toBe(true);
  });

  it("reports the price and year range of the current result set", () => {
    const facets = buildFacets(mockVehicles, query({}));
    expect(facets.priceRange.min).toBeLessThan(facets.priceRange.max);
    expect(facets.yearRange.min).toBeLessThanOrEqual(facets.yearRange.max);
  });
});

describe("sortVehicles", () => {
  it("orders by price ascending and descending", () => {
    const asc = sortVehicles(mockVehicles, "price-asc").map((v) => v.price);
    const desc = sortVehicles(mockVehicles, "price-desc").map((v) => v.price);

    expect([...asc].sort((a, b) => a - b)).toEqual(asc);
    expect([...desc].sort((a, b) => b - a)).toEqual(desc);
  });

  it("orders by newest year and lowest kilometres", () => {
    const byYear = sortVehicles(mockVehicles, "year-desc");
    expect(byYear[0].manufacturingYear).toBeGreaterThanOrEqual(
      byYear[byYear.length - 1].manufacturingYear,
    );

    const byKm = sortVehicles(mockVehicles, "km-asc").map((v) => v.kilometers);
    expect([...byKm].sort((a, b) => a - b)).toEqual(byKm);
  });

  it("does not mutate the input array", () => {
    const original = [...mockVehicles];
    sortVehicles(mockVehicles, "price-asc");
    expect(mockVehicles).toEqual(original);
  });

  it("ranks a matching keyword above a non-matching one", () => {
    const ranked = sortVehicles(mockVehicles, "relevance", "bharatbenz");
    expect(ranked[0].brand.slug).toBe("bharatbenz");
  });
});
