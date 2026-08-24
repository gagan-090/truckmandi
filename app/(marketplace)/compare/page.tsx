import type { Metadata } from "next";
import Link from "next/link";
import { Scale } from "lucide-react";
import { Breadcrumbs } from "@/components/marketplace/breadcrumbs";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CompareSync } from "@/components/compare/compare-sync";
import { CompareTableWithActions } from "@/components/compare/compare-actions";
import { VehicleRail } from "@/components/marketplace/vehicle-rail";
import { JsonLd } from "@/components/seo/json-ld";
import { MAX_COMPARE_VEHICLES } from "@/config/constants";
import {
  buildCompareRows,
  toCompareVehicle,
} from "@/features/compare/build-rows";
import { getFeaturedVehicles, getVehiclesByIds } from "@/features/vehicles/api";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/structured-data";

export const metadata: Metadata = buildMetadata({
  title: "Compare Commercial Trucks Side by Side",
  description:
    "Compare up to four used trucks, pickups or tippers on price, EMI, engine, payload, GVW and verification status before you decide.",
  path: "/compare",
  // Comparison sets are personal and effectively infinite; only the empty
  // page is worth having in the index.
  noIndex: true,
});

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Compare", href: "/compare" },
];

/** `?ids=a,b,c` — validated, de-duplicated and capped. */
function parseIds(raw: string | string[] | undefined): string[] {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return [];

  return Array.from(
    new Set(
      value
        .split(",")
        .map((id) => id.trim())
        .filter((id) => /^[a-z0-9-]{1,40}$/i.test(id)),
    ),
  ).slice(0, MAX_COMPARE_VEHICLES);
}

export default async function ComparePage(props: PageProps<"/compare">) {
  const searchParams = await props.searchParams;
  const ids = parseIds(searchParams.ids);
  const vehicles = ids.length > 0 ? await getVehiclesByIds(ids) : [];

  const columns = vehicles.map(toCompareVehicle);
  const rows = buildCompareRows(vehicles);
  const suggestions = vehicles.length === 0 ? await getFeaturedVehicles(8) : [];

  return (
    <PageContainer width="wide" className="py-6 pb-24 lg:py-8 lg:pb-28">
      <Breadcrumbs items={breadcrumbs} />
      <CompareSync urlIds={ids} />

      <div className="mt-4 mb-6 lg:mb-8">
        <h1 className="font-display text-2xl font-extrabold text-steel-900 sm:text-3xl">
          Compare trucks
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-pretty text-steel-600 sm:text-base">
          {vehicles.length > 0
            ? `Comparing ${vehicles.length} of up to ${MAX_COMPARE_VEHICLES} trucks. Rows where every truck matches are dimmed, so the differences stand out.`
            : `Pick up to ${MAX_COMPARE_VEHICLES} trucks from any listing page and compare them on price, EMI, payload, GVW and verification.`}
        </p>
      </div>

      {vehicles.length > 0 ? (
        <CompareTableWithActions vehicles={columns} rows={rows} />
      ) : (
        <>
          <EmptyState
            icon={<Scale />}
            title="Nothing to compare yet"
            description={`Tap the compare icon on any truck card to add it here. You can compare up to ${MAX_COMPARE_VEHICLES} trucks at a time.`}
            action={
              <Button asChild>
                <Link href="/vehicles">Browse trucks</Link>
              </Button>
            }
          />

          {suggestions.length > 0 && (
            <section className="mt-12">
              <h2 className="font-display text-lg font-bold text-steel-900">
                Popular right now
              </h2>
              <div className="mt-5">
                <VehicleRail vehicles={suggestions} />
              </div>
            </section>
          )}
        </>
      )}

      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </PageContainer>
  );
}
