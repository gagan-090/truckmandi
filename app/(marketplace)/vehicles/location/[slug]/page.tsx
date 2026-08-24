import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/marketplace/breadcrumbs";
import { PageContainer } from "@/components/layout/page-container";
import { LandingCopy, LandingIntro } from "@/components/search/landing-intro";
import { SearchResults } from "@/components/search/search-results";
import { JsonLd } from "@/components/seo/json-ld";
import { getRegionBySlug, regions } from "@/data/locations";
import { searchVehicles } from "@/features/vehicles/api";
import { parseSearchParams } from "@/features/search/utils";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/structured-data";
import { formatNumber } from "@/lib/utils/format-number";

export function generateStaticParams() {
  return regions.map((region) => ({ slug: region.slug }));
}

export async function generateMetadata(
  props: PageProps<"/vehicles/location/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const region = getRegionBySlug(slug);

  if (!region) {
    return buildMetadata({
      title: "Location not found",
      description: "This location does not exist.",
      path: `/vehicles/location/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `Used Commercial Vehicles in ${region.name}`,
    description: `Buy used trucks, pickups, tippers and buses in ${region.name}, ${region.state}. Verified local listings you can inspect in person, with RC transfer support.`,
    path: `/vehicles/location/${region.slug}`,
  });
}

export default async function LocationPage(
  props: PageProps<"/vehicles/location/[slug]">,
) {
  const { slug } = await props.params;
  const region = getRegionBySlug(slug);
  if (!region) notFound();

  const searchParams = await props.searchParams;
  const query = { ...parseSearchParams(searchParams), city: [region.slug] };
  const result = await searchVehicles(query);

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Vehicles", href: "/vehicles" },
    { name: region.name, href: `/vehicles/location/${region.slug}` },
  ];

  return (
    <PageContainer width="wide" className="py-6 lg:py-8">
      <Breadcrumbs items={breadcrumbs} />

      <LandingIntro
        title={`Used commercial vehicles in ${region.name}`}
        subtitle={`${formatNumber(result.page.total)} vehicles for sale in ${region.name} and nearby — ${region.cities.join(", ")}.`}
      />

      <SearchResults query={query} result={result} />

      <LandingCopy
        heading={`Buying a commercial vehicle in ${region.name}`}
        paragraphs={[
          `Buying within ${region.state} keeps the transfer simple. An intra-state ownership transfer needs Forms 29 and 30, the original RC and an insurance transfer — no NOC from the previous RTO, which is what usually delays interstate purchases by several weeks.`,
          `Inspect in person wherever possible. Sellers listed on this page are in ${region.cities.join(", ")}, so a physical inspection is usually a short drive rather than a trip across the country.`,
          "If the vehicle is under hypothecation, ask for the lender's no-objection certificate before you pay. Until it is removed from the RC, the loan remains attached to the vehicle regardless of what the seller tells you.",
        ]}
      />

      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </PageContainer>
  );
}
