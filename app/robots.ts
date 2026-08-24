import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/account/",
          "/auth/",
          "/sell/vehicle",
          "/sell/success",
          "/compare",
          // Filtered result URLs are near-infinite and duplicate the
          // landing pages; the canonical tag points crawlers at those.
          "/vehicles?",
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
