import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer, Section } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatPriceShort } from "@/lib/utils/format-currency";

export interface MarketInsightsProps {
  medianPrice: number;
  inspectedListings: number;
  totalListings: number;
}

const guides = [
  {
    title: "How to check a used truck before you buy",
    summary:
      "The eleven checks that matter most — chassis number, engine blow-by, king pin play, hydraulic drift and the paperwork that catches people out.",
    readTime: "8 min read",
    href: "/vehicles",
  },
  {
    title: "BS IV vs BS VI: what it means for resale",
    summary:
      "Entry restrictions in metro cities are reshaping demand. Here is how emission norms are affecting resale values across weight classes.",
    readTime: "6 min read",
    href: "/vehicles",
  },
  {
    title: "RC transfer, permits and NOC explained",
    summary:
      "A practical walkthrough of transferring ownership, including interstate transfers, hypothecation removal and the documents each RTO asks for.",
    readTime: "10 min read",
    href: "/vehicles",
  },
];

export function MarketInsights({
  medianPrice,
  inspectedListings,
  totalListings,
}: MarketInsightsProps) {
  const inspectedShare = totalListings
    ? Math.round((inspectedListings / totalListings) * 100)
    : 0;

  return (
    <Section className="border-t border-steel-200 bg-steel-50">
      <PageContainer>
        <SectionHeading
          eyebrow="Market insights"
          title="Buy with the numbers in front of you"
          description="What the current inventory looks like, plus guides written for people who buy and run commercial vehicles for a living."
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-12">
          <dl className="grid h-fit gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-lg border border-steel-200 bg-white p-5">
              <dt className="text-sm text-steel-600">Median listing price</dt>
              <dd className="tabular mt-1.5 font-display text-2xl font-extrabold text-steel-900">
                {formatPriceShort(medianPrice)}
              </dd>
              <p className="mt-2 text-xs text-steel-500">
                Across all categories currently listed
              </p>
            </div>

            <div className="rounded-lg border border-steel-200 bg-white p-5">
              <dt className="text-sm text-steel-600">Inspected listings</dt>
              <dd className="tabular mt-1.5 font-display text-2xl font-extrabold text-steel-900">
                {inspectedShare}%
              </dd>
              <div
                className="mt-3 h-1.5 overflow-hidden rounded-full bg-steel-100"
                role="presentation"
              >
                <div
                  className="h-full rounded-full bg-trust-500"
                  style={{ width: `${inspectedShare}%` }}
                />
              </div>
            </div>
          </dl>

          <ul className="divide-y divide-steel-200 border-y border-steel-200">
            {guides.map((guide) => (
              <li key={guide.title}>
                <Link
                  href={guide.href}
                  className="group flex items-start justify-between gap-5 py-5 transition-colors"
                >
                  <div className="min-w-0">
                    <h3 className="font-display text-base font-bold text-steel-900 transition-colors group-hover:text-brand-700 sm:text-lg">
                      {guide.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-pretty text-steel-600">
                      {guide.summary}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-steel-500">
                      {guide.readTime}
                    </p>
                  </div>
                  <ArrowRight
                    aria-hidden
                    className="mt-1 size-5 shrink-0 text-steel-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-brand-600"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </PageContainer>
    </Section>
  );
}
