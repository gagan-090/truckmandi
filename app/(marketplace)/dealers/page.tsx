import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/marketplace/breadcrumbs";
import { PageContainer } from "@/components/layout/page-container";
import { DealerCard } from "@/components/dealer/dealer-card";
import { JsonLd } from "@/components/seo/json-ld";
import { getDealers } from "@/features/dealers/api";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/structured-data";

export const metadata: Metadata = buildMetadata({
  title: "Commercial Vehicle Dealers in India",
  description:
    "Browse verified used commercial vehicle dealers across India. Inspected stock, documentation support and finance assistance from established yards.",
  path: "/dealers",
});

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Dealers", href: "/dealers" },
];

export default async function DealersPage() {
  const dealers = await getDealers();

  return (
    <PageContainer className="py-6 lg:py-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-4 mb-8">
        <h1 className="font-display text-2xl font-extrabold text-steel-900 sm:text-3xl">
          Verified dealer network
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-pretty text-steel-600 sm:text-base">
          Established yards with inspected stock, verified paperwork and
          documentation support. Buying through a dealer usually means faster RC
          transfer and some form of post-sale recourse.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dealers.map((dealer) => (
          <li key={dealer.id}>
            <DealerCard dealer={dealer} />
          </li>
        ))}
      </ul>

      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          itemListSchema(
            dealers.map((dealer) => ({
              name: dealer.name,
              href: `/dealers/${dealer.slug}`,
            })),
            "Commercial vehicle dealers on TruckMitr Exchange",
          ),
        ]}
      />
    </PageContainer>
  );
}
