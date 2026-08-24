import { describe, expect, it } from "vitest";
import {
  buildSearchHref,
  buildSearchParams,
  clearedQuery,
  countActiveFilters,
  parseSearchParams,
  toggleFilterValue,
} from "@/features/search/utils";
import { SEARCH_PAGE_SIZE } from "@/config/constants";

describe("parseSearchParams", () => {
  it("applies defaults for an empty query", () => {
    const query = parseSearchParams({});
    expect(query.sort).toBe("relevance");
    expect(query.page).toBe(1);
    expect(query.pageSize).toBe(SEARCH_PAGE_SIZE);
    expect(query.category).toBeUndefined();
  });

  it("splits comma-separated multi-selects", () => {
    const query = parseSearchParams({
      category: "trucks,tippers",
      brand: "tata",
    });
    expect(query.category).toEqual(["trucks", "tippers"]);
    expect(query.brand).toEqual(["tata"]);
  });

  it("drops values outside the known enum", () => {
    const query = parseSearchParams({ category: "trucks,spaceships" });
    expect(query.category).toEqual(["trucks"]);
  });

  it("drops a multi-select entirely when nothing is valid", () => {
    expect(parseSearchParams({ fuel: "plutonium" }).fuel).toBeUndefined();
  });

  it("de-duplicates repeated values", () => {
    expect(parseSearchParams({ brand: "tata,tata,mahindra" }).brand).toEqual([
      "tata",
      "mahindra",
    ]);
  });

  it("rejects slugs containing unsafe characters", () => {
    expect(parseSearchParams({ brand: "<script>,tata" }).brand).toEqual([
      "tata",
    ]);
  });

  it("coerces and clamps numeric filters", () => {
    const query = parseSearchParams({ minPrice: "-500", maxKm: "999999999" });
    expect(query.minPrice).toBe(0);
    expect(query.maxKm).toBe(2_000_000);
  });

  it("ignores non-numeric values rather than producing NaN", () => {
    expect(parseSearchParams({ minPrice: "abc" }).minPrice).toBeUndefined();
  });

  it("swaps a reversed range instead of returning nothing", () => {
    const query = parseSearchParams({ minPrice: "900000", maxPrice: "300000" });
    expect(query.minPrice).toBe(300_000);
    expect(query.maxPrice).toBe(900_000);

    const years = parseSearchParams({ yearFrom: "2023", yearTo: "2018" });
    expect(years.yearFrom).toBe(2018);
    expect(years.yearTo).toBe(2023);
  });

  it("reads boolean flags only from 1 or true", () => {
    expect(parseSearchParams({ verified: "1" }).verifiedOnly).toBe(true);
    expect(parseSearchParams({ verified: "true" }).verifiedOnly).toBe(true);
    expect(parseSearchParams({ verified: "0" }).verifiedOnly).toBeUndefined();
  });

  it("falls back to relevance for an unknown sort", () => {
    expect(parseSearchParams({ sort: "cheapest" }).sort).toBe("relevance");
    expect(parseSearchParams({ sort: "price-asc" }).sort).toBe("price-asc");
  });

  it("normalises invalid pagination", () => {
    expect(parseSearchParams({ page: "0" }).page).toBe(1);
    expect(parseSearchParams({ page: "-3" }).page).toBe(1);
    expect(parseSearchParams({ page: "9999" }).page).toBe(500);
    expect(parseSearchParams({ page: "3" }).page).toBe(3);
  });

  it("takes the first value when a param is repeated", () => {
    expect(parseSearchParams({ q: ["tipper", "truck"] }).q).toBe("tipper");
  });

  it("trims and length-caps the keyword", () => {
    expect(parseSearchParams({ q: "   " }).q).toBeUndefined();
    expect(parseSearchParams({ q: "  tata 407  " }).q).toBe("tata 407");
    expect(parseSearchParams({ q: "x".repeat(200) }).q).toHaveLength(80);
  });
});

describe("buildSearchParams", () => {
  it("round-trips through parseSearchParams", () => {
    const original = parseSearchParams({
      q: "tipper",
      category: "tippers",
      brand: "tata,bharatbenz",
      minPrice: "1500000",
      maxPrice: "3000000",
      verified: "1",
      sort: "price-asc",
      page: "2",
    });

    const rebuilt = parseSearchParams(
      Object.fromEntries(buildSearchParams(original)),
    );

    expect(rebuilt.q).toBe(original.q);
    expect(rebuilt.category).toEqual(original.category);
    expect(rebuilt.brand).toEqual(original.brand);
    expect(rebuilt.minPrice).toBe(original.minPrice);
    expect(rebuilt.verifiedOnly).toBe(true);
    expect(rebuilt.sort).toBe("price-asc");
    expect(rebuilt.page).toBe(2);
  });

  it("omits defaults so URLs stay short", () => {
    const params = buildSearchParams({ sort: "relevance", page: 1 });
    expect(params.toString()).toBe("");
  });

  it("builds a clean href", () => {
    expect(buildSearchHref("/vehicles", { category: ["trucks"] })).toBe(
      "/vehicles?category=trucks",
    );
    expect(buildSearchHref("/vehicles", {})).toBe("/vehicles");
  });
});

describe("countActiveFilters", () => {
  it("counts each selected value, not each group", () => {
    const query = parseSearchParams({
      category: "trucks,tippers",
      brand: "tata",
      verified: "1",
    });
    expect(countActiveFilters(query)).toBe(4);
  });

  it("ignores sort and pagination", () => {
    expect(
      countActiveFilters(parseSearchParams({ sort: "price-asc", page: "3" })),
    ).toBe(0);
  });
});

describe("clearedQuery", () => {
  it("keeps sort but drops every filter and resets the page", () => {
    const query = parseSearchParams({
      category: "trucks",
      sort: "price-desc",
      page: "4",
    });
    const cleared = clearedQuery(query);

    expect(cleared.sort).toBe("price-desc");
    expect(cleared.page).toBe(1);
    expect(cleared.category).toBeUndefined();
  });
});

describe("toggleFilterValue", () => {
  it("adds, removes and collapses to undefined when empty", () => {
    expect(toggleFilterValue(undefined, "tata")).toEqual(["tata"]);
    expect(toggleFilterValue(["tata"], "mahindra")).toEqual([
      "tata",
      "mahindra",
    ]);
    expect(toggleFilterValue(["tata", "mahindra"], "tata")).toEqual([
      "mahindra",
    ]);
    expect(toggleFilterValue(["tata"], "tata")).toBeUndefined();
  });
});
