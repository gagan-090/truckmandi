import type { Metadata } from "next";
import { ListingPreview } from "@/components/sell/listing-preview";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Preview Your Listing",
  description: "Review your listing before publishing.",
  path: "/sell/vehicle/preview",
  noIndex: true,
});

export default function SellPreviewPage() {
  return <ListingPreview />;
}
