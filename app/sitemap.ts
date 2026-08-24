import type { MetadataRoute } from "next";
import { brands } from "@/data/brands";
import { regions } from "@/data/locations";
import { vehicleCategories } from "@/data/vehicle-categories";
import { getAllVehicleSlugs } from "@/features/vehicles/api";
import { getDealerSlugs } from "@/features/dealers/api";
import { siteConfig } from "@/config/site";

const url = (path: string) => `${siteConfig.url}${path}`;

/**
 * Only pages worth indexing appear here.
 *
 * Deliberately excluded: filtered search URLs, comparison sets, the sell
 * wizard, auth and account. Those are either personal, near-infinite in
 * number, or too thin to earn a crawl.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [vehicles, dealerSlugs] = await Promise.all([
    getAllVehicleSlugs(),
    getDealerSlugs(),
  ]);

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: url("/vehicles"),
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: url("/sell"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: url("/dealers"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: url("/finance"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: url("/about"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: url("/contact"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = vehicleCategories.map(
    (category) => ({
      url: url(`/vehicles/category/${category.slug}`),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    }),
  );

  const brandPages: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: url(`/vehicles/brand/${brand.slug}`),
    lastModified: now,
    changeFrequency: "daily",
    priority: brand.popular ? 0.8 : 0.6,
  }));

  const locationPages: MetadataRoute.Sitemap = regions.map((region) => ({
    url: url(`/vehicles/location/${region.slug}`),
    lastModified: now,
    changeFrequency: "daily",
    priority: region.featured ? 0.8 : 0.6,
  }));

  const dealerPages: MetadataRoute.Sitemap = dealerSlugs.map((slug) => ({
    url: url(`/dealers/${slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const vehiclePages: MetadataRoute.Sitemap = vehicles.map((vehicle) => ({
    url: url(`/vehicles/${vehicle.slug}`),
    lastModified: new Date(vehicle.updatedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...brandPages,
    ...locationPages,
    ...dealerPages,
    ...vehiclePages,
  ];
}
