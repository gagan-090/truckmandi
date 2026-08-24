import type { Metadata } from "next";
import { SavedVehicles } from "@/components/account/saved-vehicles";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Saved Vehicles",
  description: "Vehicles you have shortlisted on TruckMitr Exchange.",
  path: "/account/saved",
  noIndex: true,
});

export default function SavedPage() {
  return (
    <div>
      <h2 className="font-display text-lg font-bold text-steel-900">
        Saved vehicles
      </h2>
      <p className="mt-1.5 mb-6 max-w-2xl text-sm text-pretty text-steel-600">
        Saved in this browser. Sign in to keep your shortlist across devices and
        get an alert when a price drops.
      </p>

      {/* Resolves the saved ids itself — see components/account/saved-vehicles. */}
      <SavedVehicles />
    </div>
  );
}
