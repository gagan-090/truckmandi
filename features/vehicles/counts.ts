import "server-only";
import { mockVehicles } from "@/data/mock-vehicles";

export interface ListingCounts {
  category: Record<string, number>;
  brand: Record<string, number>;
  region: Record<string, number>;
}

/**
 * Live listing counts per taxonomy, used by the homepage tiles and landing
 * pages so nothing links to an empty result set.
 */
export async function getListingCounts(): Promise<ListingCounts> {
  const counts: ListingCounts = { category: {}, brand: {}, region: {} };

  for (const vehicle of mockVehicles) {
    if (vehicle.status === "draft") continue;
    const { category, brand, location } = vehicle;
    counts.category[category.id] = (counts.category[category.id] ?? 0) + 1;
    counts.brand[brand.slug] = (counts.brand[brand.slug] ?? 0) + 1;
    counts.region[location.regionSlug] =
      (counts.region[location.regionSlug] ?? 0) + 1;
  }

  return counts;
}
