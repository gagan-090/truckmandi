import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/marketplace/breadcrumbs";
import { PageContainer } from "@/components/layout/page-container";
import { SearchResults } from "@/components/search/search-results";
import { JsonLd } from "@/components/seo/json-ld";
import { searchVehicles } from "@/features/vehicles/api";
import { parseSearchParams } from "@/features/search/utils";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/structured-data";
import { formatNumber } from "@/lib/utils/format-number";

export const metadata: Metadata = buildMetadata({
  title: "Used Commercial Trucks for Sale in India",
  description:
    "Browse verified used trucks, pickups, tippers, tankers, buses and construction trucks across India. Filter by brand, budget, year, kilometres, GVW and location.",
  path: "/vehicles",
});

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Trucks", href: "/vehicles" },
];

export default async function VehiclesPage(props: PageProps<"/vehicles">) {
  const searchParams = await props.searchParams;
  const query = parseSearchParams(searchParams);
  const result = await searchVehicles(query);

  return (
    <PageContainer width="wide" className="py-6 lg:py-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-4 mb-6 lg:mb-8">
        <h1 className="font-display text-2xl font-extrabold text-steel-900 sm:text-3xl">
          Used commercial trucks
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-pretty text-steel-600 sm:text-base">
          {formatNumber(result.page.total)} trucks matching your search, from
          individual owners, fleet operators and verified dealers across India.
        </p>
      </div>

      <SearchResults query={query} result={result} />

      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </PageContainer>
  );
}
