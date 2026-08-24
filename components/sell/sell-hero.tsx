import Link from "next/link";
import { ArrowRight, IndianRupee, ShieldCheck, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";

const proofPoints = [
  { icon: IndianRupee, label: "No listing fee, no commission" },
  { icon: Timer, label: "Live in a few hours after review" },
  {
    icon: ShieldCheck,
    label: "Your number stays private until you are contacted",
  },
];

export function SellHero() {
  return (
    <section className="border-b border-steel-200 bg-steel-950">
      <PageContainer className="py-14 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-[0.12em] text-brand-400 uppercase">
            Sell on TruckMitr Exchange
          </p>
          <h1 className="mt-3 font-display text-3xl leading-tight font-extrabold text-balance text-white sm:text-4xl lg:text-5xl">
            Sell your commercial vehicle to buyers who are actually looking
          </h1>
          <p className="mt-5 max-w-xl text-base text-pretty text-steel-300 sm:text-lg">
            List a truck, pickup, tipper, tanker or bus in about five minutes.
            We put it in front of buyers, fleet operators and dealers searching
            your category and city.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="accent" size="lg">
              <Link href="/sell/vehicle">
                Start your free listing
                <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="border-white/20 bg-white/5 text-white hover:border-white/30 hover:bg-white/10"
            >
              <Link href="/vehicles">See what similar vehicles sell for</Link>
            </Button>
          </div>

          <ul className="mt-8 space-y-2.5">
            {proofPoints.map((point) => (
              <li
                key={point.label}
                className="flex items-center gap-2.5 text-sm text-steel-300"
              >
                <point.icon
                  aria-hidden
                  className="size-4 shrink-0 text-trust-400"
                />
                {point.label}
              </li>
            ))}
          </ul>
        </div>
      </PageContainer>
    </section>
  );
}
