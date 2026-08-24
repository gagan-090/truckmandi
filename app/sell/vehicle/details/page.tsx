import type { Metadata } from "next";
import { VehicleDetailsStepForm } from "@/components/sell/vehicle-details-form";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Vehicle Details",
  description: "Add the specifications and condition of your vehicle.",
  path: "/sell/vehicle/details",
  noIndex: true,
});

export default function SellDetailsPage() {
  return <VehicleDetailsStepForm />;
}
