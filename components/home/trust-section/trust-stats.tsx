import { BadgeCheck, Building2, MapPin, Truck } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { formatNumber } from "@/lib/utils/format-number";

export interface TrustStatsProps {
  totalListings: number;
  verifiedListings: number;
  cities: number;
  dealers: number;
}

/**
 * Sits directly under the hero. Four figures, no decoration — the point is
 * to answer "is there enough stock here for me?" in one glance.
 */
export function TrustStats({
  totalListings,
  verifiedListings,
  cities,
  dealers,
}: TrustStatsProps) {
  const stats = [
    {
      icon: Truck,
      value: formatNumber(totalListings),
      label: "Trucks listed",
    },
    {
      icon: BadgeCheck,
      value: formatNumber(verifiedListings),
      label: "Verified listings",
    },
    { icon: MapPin, value: `${cities}+`, label: "Cities covered" },
    { icon: Building2, value: `${dealers}+`, label: "Partner dealers" },
  ];

  return (
    <section className="border-b border-steel-200 bg-white">
      <PageContainer>
        <dl className="grid grid-cols-2 divide-steel-200 sm:divide-x lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3.5 px-1 py-6 sm:justify-center sm:px-6 lg:py-7"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                <stat.icon aria-hidden className="size-5" />
              </span>
              <div className="min-w-0">
                <dd className="tabular font-display text-xl font-extrabold text-steel-900 sm:text-2xl">
                  {stat.value}
                </dd>
                <dt className="truncate text-xs text-steel-500 sm:text-sm">
                  {stat.label}
                </dt>
              </div>
            </div>
          ))}
        </dl>
      </PageContainer>
    </section>
  );
}
