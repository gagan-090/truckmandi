import type { Metadata } from "next";
import { PricingStepForm } from "@/components/sell/pricing-form";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Price & Documents",
  description: "Set your asking price and declare available documents.",
  path: "/sell/vehicle/pricing",
  noIndex: true,
});

export default function SellPricingPage() {
  return <PricingStepForm />;
}
