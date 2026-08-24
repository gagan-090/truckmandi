import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { TrustStats } from "@/components/home/trust-section/trust-stats";
import { VehicleCategories } from "@/components/home/category-section/vehicle-categories";
import { FeaturedVehicles } from "@/components/home/featured-vehicles/featured-vehicles";
import { SmartVehicleFinder } from "@/components/home/smart-vehicle-finder";
import { PopularBrands } from "@/components/home/brands/popular-brands";
import { NearbyVehicles } from "@/components/home/location-section/nearby-vehicles";
import { SellCta } from "@/components/home/sell-cta";
import { FinanceCta } from "@/components/home/finance-cta";
import { MarketInsights } from "@/components/home/insights/market-insights";
import { dealers } from "@/data/sellers";
import {
  getFeaturedVehicles,
  getMarketStats,
  getRecentVehicles,
} from "@/features/vehicles/api";
import { getListingCounts } from "@/features/vehicles/counts";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} — Buy & Sell Used Commercial Vehicles in India`,
  description: siteConfig.description,
  path: "/",
});

export default async function HomePage() {
  const [featured, recent, stats, counts] = await Promise.all([
    getFeaturedVehicles(),
    getRecentVehicles(8),
    getMarketStats(),
    getListingCounts(),
  ]);

  return (
    <>
      <Hero totalListings={stats.totalListings} cities={stats.cities} />

      <TrustStats
        totalListings={stats.totalListings}
        verifiedListings={stats.verifiedListings}
        cities={stats.cities}
        dealers={dealers.length}
      />

      <VehicleCategories counts={counts.category} />
      <FeaturedVehicles vehicles={featured} />
      <SmartVehicleFinder />
      <PopularBrands counts={counts.brand} />
      <NearbyVehicles vehicles={recent} counts={counts.region} />
      <SellCta />
      <FinanceCta />

      <MarketInsights
        medianPrice={stats.medianPrice}
        inspectedListings={stats.inspectedListings}
        totalListings={stats.totalListings}
      />
    </>
  );
}
