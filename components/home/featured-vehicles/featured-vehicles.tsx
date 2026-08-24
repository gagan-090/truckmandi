import { PageContainer, Section } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { VehicleRail } from "@/components/marketplace/vehicle-rail";
import { VehicleGrid } from "@/components/marketplace/vehicle-grid";
import type { VehicleSummary } from "@/types/vehicle";

export interface FeaturedVehiclesProps {
  vehicles: VehicleSummary[];
}

/**
 * Rail on touch widths, grid from `lg`. Both render the same cards, so
 * there is no duplicated markup to keep in step.
 */
export function FeaturedVehicles({ vehicles }: FeaturedVehiclesProps) {
  if (vehicles.length === 0) return null;

  return (
    <Section className="bg-steel-50">
      <PageContainer>
        <SectionHeading
          eyebrow="Handpicked"
          title="Featured vehicles this week"
          description="Inspected, document-verified listings from sellers with a track record on the platform."
          action={{ label: "Browse all vehicles", href: "/vehicles" }}
        />

        <div className="mt-8 lg:hidden">
          <VehicleRail vehicles={vehicles} priorityCount={1} />
        </div>

        <div className="mt-8 hidden lg:block">
          <VehicleGrid vehicles={vehicles.slice(0, 8)} priorityCount={3} />
        </div>
      </PageContainer>
    </Section>
  );
}
