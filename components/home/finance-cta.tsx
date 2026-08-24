import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer, Section } from "@/components/layout/page-container";
import { FINANCE_DEFAULTS } from "@/config/constants";

const benefits = [
  "Loans up to 90% of truck value",
  "Tenure from 12 to 84 months",
  "Approval in as little as 48 hours",
  "Works for first-time buyers and fleet operators",
];

export function FinanceCta() {
  return (
    <Section className="bg-white">
      <PageContainer>
        <div className="overflow-hidden rounded-xl border border-steel-200 bg-steel-50">
          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center lg:gap-14 lg:p-12">
            <div>
              <p className="text-xs font-bold tracking-[0.12em] text-brand-700 uppercase">
                Commercial truck finance
              </p>
              <h2 className="mt-3 font-display text-2xl leading-tight font-extrabold text-balance text-steel-900 sm:text-3xl">
                Know your EMI before you make an offer
              </h2>
              <p className="mt-3 max-w-lg text-pretty text-steel-600">
                Compare interest rates from banks and NBFCs that lend against
                commercial trucks, and see exactly what a truck costs per
                month before you commit.
              </p>

              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-2 text-sm text-steel-700"
                  >
                    <Check
                      aria-hidden
                      className="mt-0.5 size-4 shrink-0 text-trust-600"
                    />
                    {benefit}
                  </li>
                ))}
              </ul>

              <Button asChild size="lg" className="mt-8">
                <Link href="/finance">
                  Calculate your EMI
                  <ArrowRight />
                </Link>
              </Button>
            </div>

            <div className="rounded-lg border border-steel-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-steel-500">
                Indicative rates today
              </p>
              <p className="tabular mt-2 font-display text-4xl font-extrabold text-steel-900">
                {FINANCE_DEFAULTS.interestRate}%
                <span className="ml-1.5 text-base font-semibold text-steel-500">
                  onwards
                </span>
              </p>
              <dl className="mt-6 space-y-3 border-t border-steel-200 pt-5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-steel-600">Typical down payment</dt>
                  <dd className="tabular font-semibold text-steel-900">
                    {FINANCE_DEFAULTS.downPaymentPercent}%
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-steel-600">Maximum tenure</dt>
                  <dd className="tabular font-semibold text-steel-900">
                    {FINANCE_DEFAULTS.maxTenureMonths / 12} years
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-steel-600">Processing fee</dt>
                  <dd className="font-semibold text-steel-900">From 1%</dd>
                </div>
              </dl>
              <p className="mt-5 text-xs leading-relaxed text-steel-500">
                Rates are indicative and vary by lender, truck age and credit
                profile. Final terms are set by the lender.
              </p>
            </div>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
