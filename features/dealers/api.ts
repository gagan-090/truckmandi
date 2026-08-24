import "server-only";
import { dealers, getDealerBySlug } from "@/data/sellers";
import { mockVehicles } from "@/data/mock-vehicles";
import { toVehicleSummary } from "@/features/vehicles/utils";
import type { Dealer } from "@/types/dealer";
import type { VehicleCategoryId } from "@/types/vehicle";
import type { VehicleSummary } from "@/types/vehicle";

export interface DealerWithStats extends Dealer {
  /** Recomputed from live inventory rather than trusted from the record. */
  liveListings: number;
  categories: VehicleCategoryId[];
}

function withStats(dealer: Dealer): DealerWithStats {
  const inventory = mockVehicles.filter(
    (vehicle) =>
      vehicle.seller.slug === dealer.slug && vehicle.status !== "draft",
  );

  return {
    ...dealer,
    liveListings: inventory.length,
    categories: Array.from(new Set(inventory.map((v) => v.category.id))),
  };
}

export async function getDealers(): Promise<DealerWithStats[]> {
  return dealers
    .map(withStats)
    .sort(
      (a, b) =>
        Number(b.verified) - Number(a.verified) ||
        b.liveListings - a.liveListings ||
        (b.rating ?? 0) - (a.rating ?? 0),
    );
}

export async function getDealer(slug: string): Promise<DealerWithStats | null> {
  const dealer = getDealerBySlug(slug);
  return dealer ? withStats(dealer) : null;
}

export async function getDealerInventory(
  slug: string,
): Promise<VehicleSummary[]> {
  return mockVehicles
    .filter(
      (vehicle) => vehicle.seller.slug === slug && vehicle.status !== "draft",
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(toVehicleSummary);
}

export async function getDealerSlugs(): Promise<string[]> {
  return dealers.map((dealer) => dealer.slug);
}
