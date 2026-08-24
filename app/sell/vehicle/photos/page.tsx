import type { Metadata } from "next";
import { ImageUploaderStepForm } from "@/components/sell/image-uploader";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Add Photos",
  description: "Upload photos of your commercial vehicle.",
  path: "/sell/vehicle/photos",
  noIndex: true,
});

export default function SellPhotosPage() {
  return <ImageUploaderStepForm />;
}
