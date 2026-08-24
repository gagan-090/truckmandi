import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, HandCoins, ScanSearch, Users } from "lucide-react";
import { Breadcrumbs } from "@/components/marketplace/breadcrumbs";
import { PageContainer, Section } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { JsonLd } from "@/components/seo/json-ld";
import { getMarketStats } from "@/features/vehicles/api";
import { dealers } from "@/data/sellers";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/structured-data";
import { formatNumber } from "@/lib/utils/format-number";

export const metadata: Metadata = buildMetadata({
  title: "About TruckMitr Exchange",
  description:
    "Why we built a commercial vehicle marketplace around verified documents, physical inspection and transparent pricing.",
  path: "/about",
});

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
];

const principles = [
  {
    icon: ScanSearch,
    title: "Inspection before listing",
    body: "Our engineers physically inspect vehicles and publish the score. A 68 is published exactly as readily as a 95 — buyers deserve the real number.",
  },
  {
    icon: BadgeCheck,
    title: "Documents, verified",
    body: "RC, insurance, fitness and permit are checked against the vehicle before a listing earns the verified badge. Unverified listings say so plainly.",
  },
  {
    icon: HandCoins,
    title: "No commission, no lead selling",
    body: "Sellers list free and keep the whole sale price. We never resell your contact details, and buyers talk to the seller directly.",
  },
  {
    icon: Users,
    title: "Built for operators",
    body: "Filters for GVW, payload, axle configuration and emission norm, because that is how people who move freight for a living actually choose a vehicle.",
  },
];

export default async function AboutPage() {
  const stats = await getMarketStats();

  return (
    <>
      <PageContainer className="py-6 lg:py-8">
        <Breadcrumbs items={breadcrumbs} />
      </PageContainer>

      <Section className="bg-white pt-0 lg:pt-0">
        <PageContainer>
          <div className="max-w-3xl">
            <p className="text-xs font-bold tracking-[0.12em] text-brand-700 uppercase">
              About us
            </p>
            <h1 className="mt-3 font-display text-3xl leading-tight font-extrabold text-balance text-steel-900 sm:text-4xl">
              Buying a used commercial vehicle should not be a gamble
            </h1>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-pretty text-steel-600">
              <p>
                A truck is usually the largest single purchase a small transport
                business makes, and until recently the market ran on word of
                mouth, brokers and trust you had no way to verify. A wrong
                decision does not just cost money — it takes a vehicle off the
                road and a business off its contracts.
              </p>
              <p>
                {siteConfig.name} exists to put the information a buyer needs in
                front of them before they travel to see a vehicle: real
                photographs, honest kilometres, documented ownership history and
                an inspection carried out by someone with no stake in the sale.
              </p>
            </div>
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              {
                value: formatNumber(stats.totalListings),
                label: "Vehicles listed",
              },
              {
                value: formatNumber(stats.verifiedListings),
                label: "Verified listings",
              },
              { value: `${stats.cities}+`, label: "Cities covered" },
              { value: `${dealers.length}+`, label: "Partner dealers" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-steel-200 bg-steel-50 p-5"
              >
                <dd className="tabular font-display text-2xl font-extrabold text-steel-900 sm:text-3xl">
                  {stat.value}
                </dd>
                <dt className="mt-1 text-sm text-steel-600">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </PageContainer>
      </Section>

      <Section className="bg-steel-50">
        <PageContainer>
          <SectionHeading
            eyebrow="How we work"
            title="Four commitments we do not trade away"
          />

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {principles.map((principle) => (
              <li
                key={principle.title}
                className="rounded-lg border border-steel-200 bg-white p-5 sm:p-6"
              >
                <span className="grid size-11 place-items-center rounded-lg bg-brand-50 text-brand-600">
                  <principle.icon aria-hidden className="size-5" />
                </span>
                <h2 className="mt-4 font-display text-lg font-bold text-steel-900">
                  {principle.title}
                </h2>
                <p className="mt-2 leading-relaxed text-pretty text-steel-600">
                  {principle.body}
                </p>
              </li>
            ))}
          </ul>
        </PageContainer>
      </Section>

      <Section className="bg-white">
        <PageContainer>
          <div className="rounded-xl border border-steel-200 bg-steel-950 p-8 text-center sm:p-12">
            <h2 className="font-display text-2xl font-extrabold text-balance text-white sm:text-3xl">
              Ready to buy or sell?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-pretty text-steel-300">
              Browse verified commercial vehicles across India, or list yours
              free and reach buyers who are searching your category today.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button asChild variant="accent" size="lg">
                <Link href="/vehicles">Browse vehicles</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="border-white/20 bg-white/5 text-white hover:border-white/30 hover:bg-white/10"
              >
                <Link href="/sell">Sell your vehicle</Link>
              </Button>
            </div>
          </div>
        </PageContainer>
      </Section>

      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}
