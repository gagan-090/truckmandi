import Link from "next/link";
import { PageContainer, Section } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { popularBrands } from "@/data/brands";

export interface PopularBrandsProps {
  counts: Record<string, number>;
}

/**
 * Wordmark tiles rather than logo images — the manufacturers' logos are
 * trademarked, and a clean typographic tile is faster and looks deliberate.
 */
export function PopularBrands({ counts }: PopularBrandsProps) {
  return (
    <Section className="bg-steel-50">
      <PageContainer>
        <SectionHeading
          eyebrow="By manufacturer"
          title="Shop the brands India runs on"
          description="Tata, Mahindra, Ashok Leyland, Eicher and BharatBenz account for the majority of commercial vehicles on Indian roads — and on this marketplace."
        />

        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {popularBrands.map((brand) => {
            const count = counts[brand.slug] ?? 0;

            return (
              <li key={brand.slug}>
                <Link
                  href={`/vehicles/brand/${brand.slug}`}
                  className="group flex h-full flex-col items-center justify-center gap-1.5 rounded-lg border border-steel-200 bg-white px-3 py-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-steel-300 hover:shadow-md"
                >
                  <span className="font-display text-sm font-extrabold tracking-tight text-steel-900 transition-colors duration-200 group-hover:text-brand-700 lg:text-base">
                    {brand.name}
                  </span>
                  <span className="text-xs text-steel-500">
                    {count > 0 ? `${count} listed` : "View listings"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </PageContainer>
    </Section>
  );
}
