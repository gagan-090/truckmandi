import Link from "next/link";
import { MapPin } from "lucide-react";
import { PageContainer, Section } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { VehicleRail } from "@/components/marketplace/vehicle-rail";
import { featuredRegions } from "@/data/locations";
import type { VehicleSummary } from "@/types/vehicle";

export interface NearbyVehiclesProps {
  vehicles: VehicleSummary[];
  counts: Record<string, number>;
}

export function NearbyVehicles({ vehicles, counts }: NearbyVehiclesProps) {
  return (
    <Section className="bg-white">
      <PageContainer>
        <SectionHeading
          eyebrow="Near you"
          title="Recently listed across India"
          description="Buying locally means you can inspect before you pay and transfer the RC without an interstate NOC."
          action={{ label: "See all listings", href: "/vehicles" }}
        />

        <div className="mt-8">
          <VehicleRail vehicles={vehicles} />
        </div>

        <div className="mt-8 border-t border-steel-200 pt-7">
          <h3 className="text-sm font-bold text-steel-900">Popular cities</h3>
          <ul className="mt-3.5 flex flex-wrap gap-2">
            {featuredRegions.map((region) => {
              const count = counts[region.slug] ?? 0;

              return (
                <li key={region.slug}>
                  <Link
                    href={`/vehicles/location/${region.slug}`}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-steel-200 bg-white px-3.5 text-sm font-medium text-steel-700 transition-colors hover:border-steel-300 hover:bg-steel-50 hover:text-steel-900"
                  >
                    <MapPin aria-hidden className="size-3.5 text-steel-400" />
                    {region.name}
                    {count > 0 && (
                      <span className="tabular text-xs text-steel-400">
                        {count}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </PageContainer>
    </Section>
  );
}
