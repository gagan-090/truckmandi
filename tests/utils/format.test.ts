import { describe, expect, it } from "vitest";
import {
  formatCurrency,
  formatEmi,
  formatPriceCompact,
  formatPriceShort,
} from "@/lib/utils/format-currency";
import {
  formatKilometers,
  formatKilometersShort,
  formatOwnership,
  formatWeight,
} from "@/lib/utils/format-number";
import { formatRelativeTime } from "@/lib/utils/format-distance";
import {
  buildVehicleSlug,
  extractIdFromSlug,
  slugify,
} from "@/lib/utils/slugify";

describe("formatPriceShort", () => {
  it("uses lakh above one lakh", () => {
    expect(formatPriceShort(1_250_000)).toBe("₹12.5 Lakh");
    expect(formatPriceShort(985_000)).toBe("₹9.85 Lakh");
  });

  it("trims trailing zeros rather than showing 12.00", () => {
    expect(formatPriceShort(1_200_000)).toBe("₹12 Lakh");
  });

  it("uses crore above one crore", () => {
    expect(formatPriceShort(12_500_000)).toBe("₹1.25 Cr");
  });

  it("falls back to full rupees below one lakh", () => {
    expect(formatPriceShort(85_000)).toBe("₹85,000");
  });

  it("treats a missing or zero price as unlisted", () => {
    expect(formatPriceShort(0)).toBe("Price on request");
    expect(formatPriceShort(Number.NaN)).toBe("Price on request");
  });
});

describe("formatCurrency", () => {
  it("groups digits the Indian way", () => {
    expect(formatCurrency(1_250_000)).toBe("₹12,50,000");
  });

  it("rounds to whole rupees", () => {
    expect(formatCurrency(20_557.6)).toBe("₹20,558");
  });
});

describe("formatPriceCompact", () => {
  it("abbreviates for axis and slider labels", () => {
    expect(formatPriceCompact(12_500_000)).toBe("1.3Cr");
    expect(formatPriceCompact(1_250_000)).toBe("12.5L");
    expect(formatPriceCompact(85_000)).toBe("85K");
  });
});

describe("formatEmi", () => {
  it("appends the monthly suffix", () => {
    expect(formatEmi(20_558)).toBe("₹20,558/mo");
  });
});

describe("kilometre formatting", () => {
  it("groups the full reading", () => {
    expect(formatKilometers(125_000)).toBe("1,25,000 km");
  });

  it("abbreviates for cards", () => {
    expect(formatKilometersShort(125_000)).toBe("1.25L km");
    expect(formatKilometersShort(84_500)).toBe("85k km");
    expect(formatKilometersShort(800)).toBe("800 km");
  });

  it("returns a dash for invalid readings", () => {
    expect(formatKilometers(-1)).toBe("—");
  });
});

describe("formatWeight", () => {
  it("switches to tonnes above a tonne", () => {
    expect(formatWeight(7500)).toBe("7.5 T");
    expect(formatWeight(28_000)).toBe("28 T");
    expect(formatWeight(715)).toBe("715 kg");
  });

  it("handles a missing value", () => {
    expect(formatWeight(undefined)).toBe("—");
  });
});

describe("formatOwnership", () => {
  it("uses ordinals", () => {
    expect(formatOwnership(1)).toBe("1st owner");
    expect(formatOwnership(2)).toBe("2nd owner");
    expect(formatOwnership(3)).toBe("3rd owner");
    expect(formatOwnership(4)).toBe("4th owner");
  });
});

describe("formatRelativeTime", () => {
  const now = new Date("2026-08-22T12:00:00.000Z");

  it("describes recent listings", () => {
    expect(formatRelativeTime("2026-08-22T11:58:00.000Z", now)).toBe("2m ago");
    expect(formatRelativeTime("2026-08-22T08:00:00.000Z", now)).toBe("4h ago");
    expect(formatRelativeTime("2026-08-21T12:00:00.000Z", now)).toBe(
      "Yesterday",
    );
    expect(formatRelativeTime("2026-08-12T12:00:00.000Z", now)).toBe("10d ago");
  });

  it("rolls up to months and years", () => {
    expect(formatRelativeTime("2026-05-22T12:00:00.000Z", now)).toBe("3mo ago");
    expect(formatRelativeTime("2024-08-22T12:00:00.000Z", now)).toBe("2y ago");
  });

  it("returns an empty string for an unparseable date", () => {
    expect(formatRelativeTime("not-a-date", now)).toBe("");
  });
});

describe("slugify", () => {
  it("produces URL-safe slugs", () => {
    expect(slugify("Tata 407 Gold SFC")).toBe("tata-407-gold-sfc");
    expect(slugify("  Ashok Leyland — Dost+  ")).toBe("ashok-leyland-dost");
  });

  it("strips diacritics rather than dropping the letter", () => {
    expect(slugify("Ballarí")).toBe("ballari");
  });
});

describe("buildVehicleSlug", () => {
  it("keeps the listing URL readable and id-addressable", () => {
    const slug = buildVehicleSlug({
      brand: "tata",
      model: "407",
      variant: "Gold SFC",
      year: 2019,
      city: "New Delhi",
      id: "tm10241",
    });

    expect(slug).toBe("tata-407-gold-sfc-2019-new-delhi-tm10241");
    expect(extractIdFromSlug(slug)).toBe("tm10241");
  });

  it("omits an absent variant without leaving a double hyphen", () => {
    const slug = buildVehicleSlug({
      brand: "eicher",
      model: "Pro 3015",
      year: 2021,
      city: "Nagpur",
      id: "tm10260",
    });

    expect(slug).toBe("eicher-pro-3015-2021-nagpur-tm10260");
  });
});
