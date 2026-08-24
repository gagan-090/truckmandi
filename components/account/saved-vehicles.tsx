"use client";

import Link from "next/link";
import { HeartOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { VehicleCard } from "@/components/marketplace/vehicle-card";
import { VehicleCardSkeleton } from "@/components/marketplace/vehicle-card/vehicle-card-skeleton";
import { useFavorites } from "@/features/favorites/use-favorites";
import { useVehiclesByIds } from "@/features/vehicles/use-vehicles-by-ids";

/**
 * Saved list.
 *
 * Resolves the saved ids against the whole catalogue via `/api/vehicles/by-ids`.
 * It used to filter a single page of search results, so any vehicle outside
 * that page disappeared from the list even though the heart still counted it.
 */
export function SavedVehicles() {
  const { ids, hydrated, clear } = useFavorites();
  const { vehicles, loading, error } = useVehiclesByIds(hydrated ? ids : []);

  if (!hydrated || (loading && ids.length > 0)) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: Math.min(Math.max(ids.length, 1), 3) }, (_, index) => (
          <VehicleCardSkeleton key={index} variant="horizontal" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Could not load your saved vehicles"
        description="Your shortlist is safe — we just could not reach the catalogue. Please try again."
        action={
          <Button onClick={() => window.location.reload()}>Try again</Button>
        }
      />
    );
  }

  if (ids.length === 0) {
    return (
      <EmptyState
        icon={<HeartOff />}
        title="No saved vehicles yet"
        description="Tap the heart on any listing to keep it here. We will tell you if the price drops."
        action={
          <Button asChild>
            <Link href="/vehicles">Browse vehicles</Link>
          </Button>
        }
      />
    );
  }

  // A saved vehicle can be delisted after it sells; say so rather than
  // quietly showing a shorter list than the counter promised.
  const missing = ids.length - vehicles.length;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-steel-600">
          <span className="tabular font-semibold text-steel-900">
            {vehicles.length}
          </span>{" "}
          {vehicles.length === 1 ? "vehicle" : "vehicles"} saved
        </p>
        <Button variant="link" size="xs" onClick={clear}>
          Clear all
        </Button>
      </div>

      {missing > 0 && (
        <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-900">
          {missing} saved {missing === 1 ? "vehicle is" : "vehicles are"} no
          longer listed. They were most likely sold or withdrawn by the seller.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} variant="horizontal" />
        ))}
      </div>
    </div>
  );
}
