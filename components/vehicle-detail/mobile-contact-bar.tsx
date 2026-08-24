"use client";

import { VehiclePrice } from "@/components/marketplace/vehicle-price";
import type { Vehicle } from "@/types/vehicle";
import { VehicleActions } from "./vehicle-actions";

/**
 * Sticky conversion bar on mobile. It sits directly above the bottom nav
 * (`bottom-14`) rather than over it, so neither is ever unreachable.
 */
export function MobileContactBar({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="fixed inset-x-0 bottom-14 z-30 border-t border-steel-200 bg-white/97 px-4 pt-2.5 pb-2.5 shadow-[0_-4px_16px_-8px_rgb(14_20_27/0.15)] backdrop-blur-sm lg:hidden">
      <div className="mx-auto flex max-w-lg flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <VehiclePrice
            price={vehicle.price}
            previousPrice={vehicle.previousPrice}
            size="sm"
          />
          {vehicle.negotiable && (
            <span className="shrink-0 text-xs font-medium text-steel-500">
              Negotiable
            </span>
          )}
        </div>
        <VehicleActions vehicle={vehicle} layout="bar" />
      </div>
    </div>
  );
}
