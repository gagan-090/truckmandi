import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/marketplace/breadcrumbs";
import { PageContainer } from "@/components/layout/page-container";
import { LandingCopy, LandingIntro } from "@/components/search/landing-intro";
import { SearchResults } from "@/components/search/search-results";
import { JsonLd } from "@/components/seo/json-ld";
import { brands, getBrandBySlug } from "@/data/brands";
import { searchVehicles } from "@/features/vehicles/api";
import { parseSearchParams } from "@/features/search/utils";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/structured-data";
import { formatNumber } from "@/lib/utils/format-number";

export function generateStaticParams() {
  return brands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata(
  props: PageProps<"/vehicles/brand/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const brand = getBrandBySlug(slug);

  if (!brand) {
    return buildMetadata({
      title: "Brand not found",
      description: "This brand does not exist.",
      path: `/vehicles/brand/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `Used ${brand.name} Commercial Vehicles for Sale`,
    description: `Buy used ${brand.name} trucks, pickups and commercial vehicles across India. Verified documents, inspection reports and transparent pricing. Compare listings and contact sellers directly.`,
    path: `/vehicles/brand/${brand.slug}`,
  });
}

export default async function BrandPage(
  props: PageProps<"/vehicles/brand/[slug]">,
) {
  const { slug } = await props.params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const searchParams = await props.searchParams;
  const query = { ...parseSearchParams(searchParams), brand: [brand.slug] };
  const result = await searchVehicles(query);

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Vehicles", href: "/vehicles" },
    { name: brand.name, href: `/vehicles/brand/${brand.slug}` },
  ];

  return (
    <PageContainer width="wide" className="py-6 lg:py-8">
      <Breadcrumbs items={breadcrumbs} />

      <LandingIntro
        title={`Used ${brand.name} commercial vehicles`}
        subtitle={`${formatNumber(result.page.total)} ${brand.name} vehicles listed by owners, fleet operators and dealers across India.`}
      />

      <SearchResults query={query} result={result} />

      <LandingCopy
        heading={`Why buyers choose ${brand.name}`}
        paragraphs={[
          `${brand.name} (${brand.origin}) vehicles hold their value largely on the strength of their service network. Before committing, check that an authorised workshop and a reliable parts supply exist on the route you plan to run.`,
          "Ask the seller for the full service history and match it against the odometer. A well-documented vehicle with higher kilometres is usually a better buy than an undocumented one with a low reading.",
          `Prices on this page reflect current asking prices from sellers on TruckMitr Exchange. Use the filters to narrow by budget, manufacturing year, kilometres driven and gross vehicle weight, then compare up to four ${brand.name} vehicles side by side.`,
        ]}
      />

      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </PageContainer>
  );
}
