"use client";

import { useEffect, useState } from "react";
import type { VehicleSummary } from "@/types/vehicle";

export interface VehiclesByIdsState {
  vehicles: VehicleSummary[];
  loading: boolean;
  error: boolean;
}

interface Resolved {
  /** The id list this result belongs to, so stale responses are ignored. */
  key: string;
  vehicles: VehicleSummary[];
  error: boolean;
}

const EMPTY: VehiclesByIdsState = { vehicles: [], loading: false, error: false };

/**
 * Resolves locally stored vehicle ids (saved, compared) into listings.
 *
 * Returns them in the order the ids were given, so "most recently saved
 * first" survives the round trip. `loading` is derived from whether the
 * settled result matches the ids being asked for, which keeps the effect
 * free of synchronous state updates.
 */
export function useVehiclesByIds(ids: string[]): VehiclesByIdsState {
  const key = ids.join(",");
  const [resolved, setResolved] = useState<Resolved>({
    key: "",
    vehicles: [],
    error: false,
  });

  useEffect(() => {
    if (!key) return;

    let cancelled = false;

    fetch(`/api/vehicles/by-ids?ids=${encodeURIComponent(key)}`, {
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) throw new Error(`by-ids ${response.status}`);
        return response.json() as Promise<{ vehicles: VehicleSummary[] }>;
      })
      .then((data) => {
        if (cancelled) return;
        const byId = new Map(data.vehicles.map((vehicle) => [vehicle.id, vehicle]));
        setResolved({
          key,
          vehicles: key
            .split(",")
            .map((id) => byId.get(id))
            .filter((vehicle): vehicle is VehicleSummary => Boolean(vehicle)),
          error: false,
        });
      })
      .catch(() => {
        if (!cancelled) setResolved({ key, vehicles: [], error: true });
      });

    return () => {
      cancelled = true;
    };
  }, [key]);

  if (!key) return EMPTY;

  const settled = resolved.key === key;
  return {
    vehicles: settled ? resolved.vehicles : [],
    loading: !settled,
    error: settled && resolved.error,
  };
}
