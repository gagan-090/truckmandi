import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/marketplace/breadcrumbs";
import { SellerCard } from "@/components/marketplace/seller-card";
import { VehiclePrice } from "@/components/marketplace/vehicle-price";
import { PageContainer } from "@/components/layout/page-container";
import { JsonLd } from "@/components/seo/json-ld";
import { ImageGallery } from "@/components/vehicle-detail/image-gallery";
import { MobileContactBar } from "@/components/vehicle-detail/mobile-contact-bar";
import { SimilarVehicles } from "@/components/vehicle-detail/similar-vehicles";
import { VehicleActions } from "@/components/vehicle-detail/vehicle-actions";
import { VehicleDescription } from "@/components/vehicle-detail/description";
import { VehicleHeader } from "@/components/vehicle-detail/vehicle-header";
import { VehicleHighlights } from "@/components/vehicle-detail/highlights";
import { VehicleSpecifications } from "@/components/vehicle-detail/specifications";
import { VehicleSummaryStats } from "@/components/vehicle-detail/vehicle-summary";
import { VerificationSection } from "@/components/vehicle-detail/verification-section";
import { EmiSnapshot } from "@/components/finance/emi-snapshot";
import {
  getAllVehicleSlugs,
  getSimilarVehicles,
  getVehicleBySlug,
} from "@/features/vehicles/api";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, vehicleSchema } from "@/lib/seo/structured-data";
import { formatKilometers } from "@/lib/utils/format-number";
import { formatPriceShort } from "@/lib/utils/format-currency";

export async function generateStaticParams() {
  const slugs = await getAllVehicleSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/vehicles/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) {
    return buildMetadata({
      title: "Vehicle not found",
      description: "This listing is no longer available.",
      path: `/vehicles/${slug}`,
      noIndex: true,
    });
  }

  const title = `Used ${vehicle.brand.name} ${vehicle.model}${
    vehicle.variant ? ` ${vehicle.variant}` : ""
  } ${vehicle.manufacturingYear} in ${vehicle.location.city}`;

  return buildMetadata({
    title,
    description: `${vehicle.manufacturingYear} ${vehicle.brand.name} ${vehicle.model} for sale in ${vehicle.location.city} at ${formatPriceShort(vehicle.price)}. ${formatKilometers(vehicle.kilometers)} driven, ${vehicle.ownershipCount} owner${vehicle.ownershipCount > 1 ? "s" : ""}${vehicle.verification.isVerified ? ", verified documents" : ""}. View photos, full specifications and contact the seller.`,
    path: `/vehicles/${vehicle.slug}`,
    image: vehicle.images[0]
      ? {
          url: vehicle.images[0].url,
          width: vehicle.images[0].width,
          height: vehicle.images[0].height,
          alt: vehicle.images[0].alt,
        }
      : undefined,
    // Sold listings stay reachable for anyone holding the link, but they
    // should not compete in search with vehicles you can actually buy.
    noIndex: vehicle.status === "sold",
  });
}

export default async function VehicleDetailPage(
  props: PageProps<"/vehicles/[slug]">,
) {
  const { slug } = await props.params;
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) notFound();

  const similar = await getSimilarVehicles(vehicle);

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Vehicles", href: "/vehicles" },
    {
      name: vehicle.category.name,
      href: `/vehicles/category/${vehicle.category.slug}`,
    },
    { name: vehicle.title, href: `/vehicles/${vehicle.slug}` },
  ];

  return (
    <>
      <PageContainer className="py-4 lg:py-6">
        <Breadcrumbs items={breadcrumbs} />
      </PageContainer>

      <PageContainer className="pb-10 lg:pb-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="min-w-0">
            {/* Rendered once: the gallery handles both layouts internally,
                so mounting it per breakpoint would duplicate the DOM and
                emit two `priority` images competing for the LCP slot. */}
            <div className="mb-5 lg:mb-7">
              <ImageGallery images={vehicle.images} title={vehicle.title} />
            </div>

            <VehicleHeader vehicle={vehicle} />

            {/* Price is above the fold on mobile; on desktop it lives in the panel. */}
            <div className="mt-5 lg:hidden">
              <VehiclePrice
                price={vehicle.price}
                previousPrice={vehicle.previousPrice}
                negotiable={vehicle.negotiable}
                size="lg"
                showExact
              />
            </div>

            <div className="mt-6">
              <VehicleSummaryStats vehicle={vehicle} />
            </div>

            <div className="mt-10 space-y-10">
              <VerificationSection vehicle={vehicle} />
              <VehicleHighlights highlights={vehicle.highlights} />
              <VehicleDescription description={vehicle.description} />
              <VehicleSpecifications vehicle={vehicle} />

              <section aria-labelledby="seller-heading" className="lg:hidden">
                <h2
                  id="seller-heading"
                  className="font-display text-lg font-bold text-steel-900"
                >
                  About the seller
                </h2>
                <SellerCard seller={vehicle.seller} className="mt-4" />
              </section>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-[5.5rem] space-y-4">
              <div className="rounded-lg border border-steel-200 bg-white p-5 shadow-sm">
                <VehiclePrice
                  price={vehicle.price}
                  previousPrice={vehicle.previousPrice}
                  negotiable={vehicle.negotiable}
                  size="lg"
                  showExact
                />
                <div className="mt-5">
                  <VehicleActions vehicle={vehicle} />
                </div>
              </div>

              <EmiSnapshot price={vehicle.price} />

              <SellerCard seller={vehicle.seller} />
            </div>
          </aside>
        </div>

        <div className="mt-14">
          <SimilarVehicles
            vehicles={similar}
            categoryHref={`/vehicles/category/${vehicle.category.slug}`}
          />
        </div>
      </PageContainer>

      {/* Extra space so the sticky bar never covers the last section. */}
      <div aria-hidden className="h-28 lg:hidden" />
      <MobileContactBar vehicle={vehicle} />

      <JsonLd data={[vehicleSchema(vehicle), breadcrumbSchema(breadcrumbs)]} />
    </>
  );
}
