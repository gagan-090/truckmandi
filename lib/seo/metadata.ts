import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

export interface PageMetadataInput {
  title: string;
  description: string;
  /** Path only, e.g. "/vehicles/category/trucks". */
  path: string;
  image?: { url: string; width?: number; height?: number; alt?: string };
  /** Thin or duplicative pages should stay out of the index. */
  noIndex?: boolean;
  type?: "website" | "article";
}

/**
 * Single builder for page metadata so canonical, Open Graph and Twitter
 * tags can never drift apart.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
  type = "website",
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image
    ? {
        url: absoluteUrl(image.url),
        width: image.width ?? 1200,
        height: image.height ?? 630,
        alt: image.alt ?? title,
      }
    : {
        url: absoluteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: title,
      };

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true, "max-image-preview": "large" },
    openGraph: {
      type,
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: siteConfig.social.twitter,
      images: [ogImage.url],
    },
  };
}
