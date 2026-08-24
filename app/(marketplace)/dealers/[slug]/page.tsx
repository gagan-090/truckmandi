import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Building2, Clock, MapPin, Phone, Star, Wrench } from "lucide-react";
import { Breadcrumbs } from "@/components/marketplace/breadcrumbs";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { VerifiedBadge } from "@/components/marketplace/verification-badge";
import { VehicleGrid } from "@/components/marketplace/vehicle-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { getCategoryById } from "@/data/vehicle-categories";
import {
  getDealer,
  getDealerInventory,
  getDealerSlugs,
} from "@/features/dealers/api";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, dealerSchema } from "@/lib/seo/structured-data";
import { formatListingDate } from "@/lib/utils/format-distance";

export async function generateStaticParams() {
  const slugs = await getDealerSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/dealers/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const dealer = await getDealer(slug);

  if (!dealer) {
    return buildMetadata({
      title: "Dealer not found",
      description: "This dealer profile is not available.",
      path: `/dealers/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${dealer.name} — Used Commercial Vehicles in ${dealer.location.city}`,
    description: `${dealer.name} lists ${dealer.liveListings} used commercial vehicles in ${dealer.location.city}. ${dealer.about.slice(0, 110)}…`,
    path: `/dealers/${dealer.slug}`,
  });
}

export default async function DealerProfilePage(
  props: PageProps<"/dealers/[slug]">,
) {
  const { slug } = await props.params;
  const dealer = await getDealer(slug);
  if (!dealer) notFound();

  const inventory = await getDealerInventory(slug);

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Dealers", href: "/dealers" },
    { name: dealer.name, href: `/dealers/${dealer.slug}` },
  ];

  return (
    <PageContainer className="py-6 lg:py-8">
      <Breadcrumbs items={breadcrumbs} />

      <header className="mt-4 rounded-lg border border-steel-200 bg-white p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {dealer.verified && (
                <VerifiedBadge size="md" label="Verified dealer" />
              )}
              <Badge variant="neutral" size="md">
                Established {dealer.establishedYear}
              </Badge>
              {dealer.rating !== undefined && (
                <Badge variant="outline" size="md">
                  <Star aria-hidden className="fill-amber-400 text-amber-400" />
                  {dealer.rating.toFixed(1)} ({dealer.reviewCount})
                </Badge>
              )}
            </div>

            <h1 className="mt-3 font-display text-2xl font-extrabold text-steel-900 sm:text-3xl">
              {dealer.name}
            </h1>

            <p className="mt-3 max-w-2xl leading-relaxed text-pretty text-steel-600">
              {dealer.about}
            </p>
          </div>

          <div className="shrink-0 sm:w-56">
            <Button asChild variant="success" size="lg" block>
              <a href={`tel:${dealer.phone?.replace(/\s/g, "")}`}>
                <Phone />
                Call dealer
              </a>
            </Button>
            <p className="mt-2 text-center text-xs text-steel-500">
              Member since {formatListingDate(dealer.memberSince)}
            </p>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 border-t border-steel-200 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-2.5">
            <MapPin
              aria-hidden
              className="mt-0.5 size-4 shrink-0 text-steel-400"
            />
            <div className="min-w-0">
              <dt className="text-xs text-steel-500">Address</dt>
              <dd className="text-sm text-pretty text-steel-800">
                {dealer.address}
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Clock
              aria-hidden
              className="mt-0.5 size-4 shrink-0 text-steel-400"
            />
            <div className="min-w-0">
              <dt className="text-xs text-steel-500">Working hours</dt>
              <dd className="text-sm text-steel-800">{dealer.workingHours}</dd>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Building2
              aria-hidden
              className="mt-0.5 size-4 shrink-0 text-steel-400"
            />
            <div className="min-w-0">
              <dt className="text-xs text-steel-500">Live inventory</dt>
              <dd className="tabular text-sm font-semibold text-steel-800">
                {dealer.liveListings} vehicles
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Wrench
              aria-hidden
              className="mt-0.5 size-4 shrink-0 text-steel-400"
            />
            <div className="min-w-0">
              <dt className="text-xs text-steel-500">Specialises in</dt>
              <dd className="text-sm text-pretty text-steel-800">
                {dealer.specialities
                  .map((id) => getCategoryById(id)?.name ?? id)
                  .join(", ")}
              </dd>
            </div>
          </div>
        </dl>

        <div className="mt-5 border-t border-steel-200 pt-5">
          <h2 className="text-xs font-bold tracking-[0.1em] text-steel-500 uppercase">
            Services offered
          </h2>
          <ul className="mt-2.5 flex flex-wrap gap-2">
            {dealer.services.map((service) => (
              <li
                key={service}
                className="rounded-full border border-steel-200 bg-steel-50 px-3 py-1.5 text-xs font-medium text-steel-700"
              >
                {service}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <section aria-labelledby="inventory-heading" className="mt-10">
        <h2
          id="inventory-heading"
          className="font-display text-xl font-bold text-steel-900"
        >
          Vehicles from {dealer.name}
        </h2>

        <div className="mt-5">
          {inventory.length > 0 ? (
            <VehicleGrid vehicles={inventory} priorityCount={3} />
          ) : (
            <EmptyState
              title="No live listings"
              description="This dealer has no vehicles listed right now. Call them directly to ask what is arriving."
            />
          )}
        </div>
      </section>

      <JsonLd
        data={[
          dealerSchema(dealer, dealer.liveListings),
          breadcrumbSchema(breadcrumbs),
        ]}
      />
    </PageContainer>
  );
}
