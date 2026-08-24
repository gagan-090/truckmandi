import type { Metadata } from "next";
import { VehicleTypeStepForm } from "@/components/sell/vehicle-type-selector";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "List Your Commercial Vehicle",
  description:
    "Create a free listing for your truck, pickup, tipper or bus on TruckMitr Exchange.",
  path: "/sell/vehicle",
  // Wizard steps are a private flow, not search results.
  noIndex: true,
});

export default function SellVehiclePage() {
  return <VehicleTypeStepForm />;
}
