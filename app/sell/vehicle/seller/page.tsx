import type { Metadata } from "next";
import { SellerStepForm } from "@/components/sell/seller-form";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Your Details",
  description: "Tell buyers how to reach you.",
  path: "/sell/vehicle/seller",
  noIndex: true,
});

export default function SellSellerPage() {
  return <SellerStepForm />;
}
