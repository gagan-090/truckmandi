import { SectionHeading } from "@/components/ui/section-heading";
import { VehicleRail } from "@/components/marketplace/vehicle-rail";
import type { VehicleSummary } from "@/types/vehicle";

export function SimilarVehicles({
  vehicles,
  categoryHref,
}: {
  vehicles: VehicleSummary[];
  categoryHref: string;
}) {
  if (vehicles.length === 0) return null;

  return (
    <section
      aria-labelledby="similar-heading"
      className="border-t border-steel-200 pt-10"
    >
      <SectionHeading
        as="h2"
        title={<span id="similar-heading">Similar trucks</span>}
        description="Comparable listings in the same category and price band."
        action={{ label: "See more", href: categoryHref }}
      />
      <div className="mt-6">
        <VehicleRail vehicles={vehicles} />
      </div>
    </section>
  );
}
