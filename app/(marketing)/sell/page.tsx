import type { Metadata } from "next";
import Link from "next/link";
import { Camera, FileText, MessageSquare, Search } from "lucide-react";
import { PageContainer, Section } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/ui/section-heading";
import { SellHero } from "@/components/sell/sell-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { getMarketStats } from "@/features/vehicles/api";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/structured-data";
import { formatNumber } from "@/lib/utils/format-number";

export const metadata: Metadata = buildMetadata({
  title: "Sell Your Commercial Vehicle Free",
  description:
    "List your used truck, pickup, tipper, tanker or bus free on TruckMitr Exchange. No commission, verified buyers, and help with RC transfer paperwork.",
  path: "/sell",
});

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Sell", href: "/sell" },
];

const steps = [
  {
    icon: FileText,
    title: "Describe the vehicle",
    body: "Category, model, year, kilometres, ownership and condition. Roughly three minutes of typing.",
  },
  {
    icon: Camera,
    title: "Add photos",
    body: "At least three clear daylight photos. Listings with photos of the odometer and engine bay get far more replies.",
  },
  {
    icon: Search,
    title: "Get reviewed and go live",
    body: "We check the registration details and the documents you declared, then publish — usually within a few hours.",
  },
  {
    icon: MessageSquare,
    title: "Talk to buyers directly",
    body: "Calls, messages and offers come straight to you. No middleman, and no commission on the sale.",
  },
];

const pricingTips = [
  {
    title: "Check what similar vehicles are listed at",
    body: "Search your model, year and kilometre band on the marketplace. Asking prices for comparable vehicles are the most reliable guide you have.",
  },
  {
    title: "Complete your documents first",
    body: "A vehicle with valid fitness, insurance and permit sells for meaningfully more than one where the buyer has to sort the paperwork out.",
  },
  {
    title: "Be honest about what needs work",
    body: "Buyers who inspect and find something you did not mention walk away. Buyers who read it in the listing and come anyway are serious.",
  },
  {
    title: "Mark the price negotiable",
    body: "Negotiable listings receive noticeably more offers, and you keep the right to decline any of them.",
  },
];

const faqs = [
  {
    question: "Is listing really free?",
    answer:
      "Yes. Listing a commercial vehicle on TruckMitr Exchange costs nothing, and we do not take a commission when it sells. We do not sell your contact details as leads either.",
  },
  {
    question: "Who sees my phone number?",
    answer:
      "Your number is hidden by default. A buyer has to give their own name and number before yours is revealed, which cuts out most spam calls.",
  },
  {
    question: "How do I get the verified badge?",
    answer:
      "Declare which documents you have, then share the RC, insurance and fitness certificate with our team when they contact you. Verified listings rank above unverified ones in search results.",
  },
  {
    question: "Can I edit my listing after publishing?",
    answer:
      "Yes. You can update the price, photos and description at any time from My Listings. Price reductions are highlighted to buyers who have saved your vehicle.",
  },
  {
    question: "How long does a listing stay live?",
    answer:
      "Ninety days, and you can renew it. Mark it sold whenever the deal closes so you stop receiving enquiries.",
  },
];

export default async function SellLandingPage() {
  const stats = await getMarketStats();

  return (
    <>
      <SellHero />

      <Section className="bg-white">
        <PageContainer>
          <SectionHeading
            eyebrow="How it works"
            title="Four steps from listing to sale"
            description={`Join the ${formatNumber(stats.totalListings)} vehicles currently listed across ${stats.cities} cities.`}
          />

          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-lg border border-steel-200 bg-white p-5"
              >
                <span className="grid size-10 place-items-center rounded-lg bg-brand-50 text-brand-600">
                  <step.icon aria-hidden className="size-5" />
                </span>
                <h3 className="mt-3.5 font-display text-base font-bold text-steel-900">
                  <span className="tabular mr-1.5 text-steel-400">
                    {index + 1}.
                  </span>
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm text-pretty text-steel-600">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-10 text-center">
            <Button asChild variant="accent" size="lg">
              <Link href="/sell/vehicle">Start your listing</Link>
            </Button>
          </div>
        </PageContainer>
      </Section>

      <Section className="bg-steel-50">
        <PageContainer>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Get a better price"
                title="What actually moves the number"
              />
              <ul className="mt-7 space-y-5">
                {pricingTips.map((tip) => (
                  <li
                    key={tip.title}
                    className="border-l-2 border-brand-500 pl-4"
                  >
                    <h3 className="font-display text-base font-bold text-steel-900">
                      {tip.title}
                    </h3>
                    <p className="mt-1 text-sm text-pretty text-steel-600">
                      {tip.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-2xl font-extrabold text-steel-900">
                Seller questions
              </h2>
              <Accordion
                type="single"
                collapsible
                className="mt-5 rounded-lg border border-steel-200 bg-white px-5"
              >
                {faqs.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`sell-faq-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm leading-relaxed text-pretty text-steel-600">
                        {faq.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </PageContainer>
      </Section>

      <JsonLd data={[breadcrumbSchema(breadcrumbs), faqSchema(faqs)]} />
    </>
  );
}
