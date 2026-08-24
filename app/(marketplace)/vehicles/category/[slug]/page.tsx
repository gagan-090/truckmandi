import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/marketplace/breadcrumbs";
import { PageContainer } from "@/components/layout/page-container";
import { LandingCopy, LandingIntro } from "@/components/search/landing-intro";
import { SearchResults } from "@/components/search/search-results";
import { JsonLd } from "@/components/seo/json-ld";
import {
  vehicleCategories,
  getCategoryBySlug,
} from "@/data/vehicle-categories";
import { searchVehicles } from "@/features/vehicles/api";
import { parseSearchParams } from "@/features/search/utils";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/structured-data";
import { formatNumber } from "@/lib/utils/format-number";

export function generateStaticParams() {
  return vehicleCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata(
  props: PageProps<"/vehicles/category/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return buildMetadata({
      title: "Category not found",
      description: "This category does not exist.",
      path: `/vehicles/category/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `Used ${category.name} for Sale in India`,
    description: `Buy verified used ${category.name.toLowerCase()} across India. ${category.description} Compare prices, kilometres, GVW and ownership history, then contact the seller directly.`,
    path: `/vehicles/category/${category.slug}`,
  });
}

export default async function CategoryPage(
  props: PageProps<"/vehicles/category/[slug]">,
) {
  const { slug } = await props.params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const searchParams = await props.searchParams;
  // The category is fixed by the route; query params refine within it.
  const query = { ...parseSearchParams(searchParams), category: [category.id] };
  const result = await searchVehicles(query);

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Vehicles", href: "/vehicles" },
    { name: category.name, href: `/vehicles/category/${category.slug}` },
  ];

  return (
    <PageContainer width="wide" className="py-6 lg:py-8">
      <Breadcrumbs items={breadcrumbs} />

      <LandingIntro
        title={`Used ${category.name.toLowerCase()} for sale`}
        subtitle={`${formatNumber(result.page.total)} verified ${category.name.toLowerCase()} listed across India. ${category.description}`}
      />

      <SearchResults query={query} result={result} />

      <LandingCopy
        heading={`Buying a used ${category.name.toLowerCase().replace(/s$/, "")}`}
        paragraphs={[
          `${category.gvwRange ? `Vehicles in this class typically sit in the ${category.gvwRange} band. ` : ""}Match the specification to the work first: gross vehicle weight and payload decide what you can legally carry, and overloading is the fastest route to fitness and insurance problems.`,
          "Check the odometer against the service record rather than trusting the reading alone. On commercial vehicles, engine hours, tyre condition and chassis straightness tell you more about remaining life than kilometres do.",
          "Confirm that the RC, insurance, fitness certificate and permit are all current and in the seller's name before paying any advance. Listings marked verified on TruckMitr Exchange have had these documents checked, and inspected listings come with an engineer's report.",
        ]}
      />

      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </PageContainer>
  );
}
