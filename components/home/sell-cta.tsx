import Link from "next/link";
import { ArrowRight, Camera, IndianRupee, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer, Section } from "@/components/layout/page-container";

const steps = [
  {
    icon: Camera,
    title: "Add your vehicle",
    body: "Photos, kilometres, registration details and a price. Takes about five minutes.",
  },
  {
    icon: Users,
    title: "Reach real buyers",
    body: "Your listing goes to buyers, fleet operators and dealers actively searching your category.",
  },
  {
    icon: IndianRupee,
    title: "Close the deal",
    body: "Talk directly, agree a price, and we help with RC transfer paperwork.",
  },
];

export function SellCta() {
  return (
    <Section className="bg-steel-950">
      <PageContainer>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16">
          <div>
            <p className="text-xs font-bold tracking-[0.12em] text-brand-400 uppercase">
              Sell with TruckMitr
            </p>
            <h2 className="mt-3 font-display text-3xl leading-tight font-extrabold text-balance text-white sm:text-4xl">
              List your vehicle free. Pay nothing on the sale.
            </h2>
            <p className="mt-4 max-w-lg text-base text-pretty text-steel-300">
              No commission, no lead-selling and no hidden charges. Verified
              listings get shown first, so completing your documents genuinely
              gets you a faster sale.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="accent" size="lg">
                <Link href="/sell">
                  Start your listing
                  <ArrowRight />
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="border-white/20 bg-white/5 text-white hover:border-white/30 hover:bg-white/10"
              >
                <Link href="/dealers">Sell through a dealer</Link>
              </Button>
            </div>
          </div>

          <ol className="space-y-3">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-5"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-600 text-white">
                  <step.icon aria-hidden className="size-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-base font-bold text-white">
                    <span className="tabular mr-2 text-brand-400">
                      {index + 1}.
                    </span>
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-pretty text-steel-400">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </PageContainer>
    </Section>
  );
}
