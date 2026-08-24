import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageContainer, Section } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildSearchHref } from "@/features/search/utils";

/**
 * Pre-built searches for the intents buyers actually arrive with. Each is a
 * real, shareable results URL rather than a marketing tile.
 */
const shortcuts = [
  {
    title: "Under ₹5 Lakh",
    caption: "Entry-level pickups & mini trucks",
    href: buildSearchHref("/vehicles", {
      maxPrice: 500_000,
      sort: "price-asc",
    }),
  },
  {
    title: "First owner only",
    caption: "Single-owner trucks with clean papers",
    href: buildSearchHref("/vehicles", { maxOwners: 1, verifiedOnly: true }),
  },
  {
    title: "Under 1 Lakh km",
    caption: "Low-running trucks and LCVs",
    href: buildSearchHref("/vehicles", { maxKm: 100_000, sort: "km-asc" }),
  },
  {
    title: "BS VI, 2021 onwards",
    caption: "No entry restrictions in metro cities",
    href: buildSearchHref("/vehicles", { yearFrom: 2021, sort: "year-desc" }),
  },
  {
    title: "Heavy haulage 16T+",
    caption: "Long-distance rigids and tractors",
    href: buildSearchHref("/vehicles", { minGvw: 16_000, sort: "price-asc" }),
  },
  {
    title: "Dealer inventory",
    caption: "Warranty, paperwork and buy-back support",
    href: buildSearchHref("/vehicles", { sellerType: ["dealer"] }),
  },
];

export function SmartVehicleFinder() {
  return (
    <Section className="bg-white">
      <PageContainer>
        <SectionHeading
          eyebrow="Shortcuts"
          title="Find the right truck faster"
          description="Common searches, already filtered. Every shortcut is a normal results page you can refine further."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shortcuts.map((shortcut) => (
            <li key={shortcut.title}>
              <Link
                href={shortcut.href}
                className="group flex h-full items-start justify-between gap-4 rounded-lg border border-steel-200 bg-white p-4 transition-all duration-200 hover:border-brand-300 hover:bg-brand-50/50 hover:shadow-sm lg:p-5"
              >
                <span className="min-w-0">
                  <span className="block font-display text-base font-bold text-steel-900">
                    {shortcut.title}
                  </span>
                  <span className="mt-1 block text-sm text-steel-600">
                    {shortcut.caption}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="size-5 shrink-0 text-steel-300 transition-colors duration-200 group-hover:text-brand-600"
                />
              </Link>
            </li>
          ))}
        </ul>
      </PageContainer>
    </Section>
  );
}
