import Link from "next/link";
import { PageContainer, Section } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { CategoryIcon } from "@/components/marketplace/category-icon";
import {
  homepageCategorySlugs,
  vehicleCategories,
} from "@/data/vehicle-categories";
import type { VehicleCategoryId } from "@/types/vehicle";

export interface VehicleCategoriesProps {
  /** Live listing count per category, so tiles never promise empty pages. */
  counts: Record<string, number>;
}

export function VehicleCategories({ counts }: VehicleCategoriesProps) {
  const categories = homepageCategorySlugs
    .map((slug) => vehicleCategories.find((c) => c.id === slug))
    .filter((c): c is (typeof vehicleCategories)[number] => Boolean(c));

  return (
    <Section className="bg-white">
      <PageContainer>
        <SectionHeading
          eyebrow="Browse by type"
          title="Every class of commercial truck"
          description="From 500 kg cargo three-wheelers to 49-tonne multi-axle haulage, filtered by the specifications that actually matter."
          action={{ label: "View all categories", href: "/vehicles" }}
        />

        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          {categories.map((category) => {
            const count = counts[category.id as VehicleCategoryId] ?? 0;

            return (
              <li key={category.id}>
                <Link
                  href={`/vehicles/category/${category.slug}`}
                  className="group flex h-full flex-col rounded-lg border border-steel-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-steel-300 hover:shadow-md lg:p-5"
                >
                  <span className="grid size-11 place-items-center rounded-lg bg-steel-100 text-steel-700 transition-colors duration-200 group-hover:bg-brand-600 group-hover:text-white">
                    <CategoryIcon name={category.icon} className="size-5" />
                  </span>

                  <span className="mt-3.5 font-display text-sm font-bold text-steel-900 lg:text-base">
                    {category.name}
                  </span>

                  {category.gvwRange && (
                    <span className="mt-0.5 text-xs text-steel-500">
                      {category.gvwRange}
                    </span>
                  )}

                  <span className="mt-3 text-xs font-semibold text-brand-700">
                    {count > 0 ? `${count} available` : "Browse listings"}
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
