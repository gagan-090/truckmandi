import "server-only";
import { mockVehicles } from "@/data/mock-vehicles";
import { getVehiclesByIds } from "@/features/vehicles/api";
import type { CompareTrayItem } from "@/components/compare/compare-tray";

/**
 * Comprehensive id -> {title, thumbnail} index for compare tray lookup.
 */
export async function getCompareIndex(
  selectedIds: string[] = [],
): Promise<Record<string, CompareTrayItem>> {
  const index: Record<string, CompareTrayItem> = {};

  try {
    if (selectedIds.length > 0) {
      const realVehicles = await getVehiclesByIds(selectedIds);
      for (const vehicle of realVehicles) {
        index[vehicle.id] = {
          id: vehicle.id,
          title: vehicle.title,
          imageUrl: vehicle.images[0]?.url,
        };
      }
    }
  } catch (err) {
    console.error("Failed to fetch vehicles for compare index", err);
  }

  for (const vehicle of mockVehicles) {
    if (!index[vehicle.id]) {
      index[vehicle.id] = {
        id: vehicle.id,
        title: vehicle.title,
        imageUrl: vehicle.images[0]?.url,
      };
    }
  }

  return index;
}
