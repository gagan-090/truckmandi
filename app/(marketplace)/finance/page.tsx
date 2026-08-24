import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  Building2,
  Clock3,
  FileText,
  Percent,
  ShieldCheck,
} from "lucide-react";
import { Breadcrumbs } from "@/components/marketplace/breadcrumbs";
import { PageContainer, Section } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/ui/section-heading";
import { EmiCalculator } from "@/components/finance/emi-calculator";
import { JsonLd } from "@/components/seo/json-ld";
import { FINANCE_DEFAULTS, PRICE_BOUNDS } from "@/config/constants";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/structured-data";

export const metadata: Metadata = buildMetadata({
  title: "Commercial Vehicle Finance & EMI Calculator",
  description:
    "Work out the EMI on any used truck, pickup or tipper. Compare down payment, interest rate and tenure, and see the total interest before you commit.",
  path: "/finance",
});

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Finance", href: "/finance" },
];

const steps = [
  {
    icon: FileText,
    title: "Share your details",
    body: "Vehicle, price and basic KYC. No documents needed to get an indicative offer.",
  },
  {
    icon: Building2,
    title: "Compare lenders",
    body: "Banks and NBFCs that lend against commercial vehicles respond with their terms.",
  },
  {
    icon: BadgeCheck,
    title: "Get sanctioned",
    body: "Submit documents to the lender you pick. Sanction typically lands in 48 to 72 hours.",
  },
  {
    icon: ShieldCheck,
    title: "Complete the purchase",
    body: "The lender pays the seller directly and hypothecation is recorded on the RC.",
  },
];

const eligibility = [
  {
    icon: Percent,
    label: "Loan to value",
    value: "Up to 90% of vehicle value",
  },
  {
    icon: Clock3,
    label: "Vehicle age limit",
    value: "Usually under 10 years at maturity",
  },
  {
    icon: FileText,
    label: "Documents",
    value: "KYC, bank statements, ITR or GST returns",
  },
  {
    icon: Building2,
    label: "Experience",
    value: "First-time buyers accepted with a guarantor",
  },
];

const faqs = [
  {
    question: "Can I get finance on a used commercial vehicle?",
    answer:
      "Yes. Most banks and NBFCs lend against used commercial vehicles, typically up to 80–90% of the assessed value. The vehicle usually needs to be under ten years old at the end of the loan tenure, and the lender will value it independently rather than accepting the asking price.",
  },
  {
    question: "What interest rate should I expect?",
    answer: `Rates for used commercial vehicles generally start around ${FINANCE_DEFAULTS.interestRate}% per annum and rise with vehicle age and credit risk. First-time buyers without an established transport business usually pay two to four percentage points more than fleet operators with a repayment record.`,
  },
  {
    question: "How much down payment do I need?",
    answer: `Plan for ${FINANCE_DEFAULTS.downPaymentPercent}% as a working assumption. Lenders often ask for more on older vehicles or from first-time borrowers. A larger down payment lowers both your EMI and the total interest you pay.`,
  },
  {
    question: "What is hypothecation and when is it removed?",
    answer:
      "Hypothecation records the lender's claim on the vehicle in the RC. It stays until the loan is fully repaid, after which the lender issues a no-objection certificate and the RTO removes the endorsement. Never buy a vehicle with an active hypothecation unless the seller produces the lender's NOC.",
  },
  {
    question: "Does TruckMitr Exchange lend money?",
    answer:
      "No. We connect you with lending partners and give you the tools to compare offers. The loan agreement is between you and the lender, and they set the final terms.",
  },
];

export default async function FinancePage(props: PageProps<"/finance">) {
  const searchParams = await props.searchParams;
  const raw = Array.isArray(searchParams.price)
    ? searchParams.price[0]
    : searchParams.price;
  const parsed = Number(raw);
  const initialPrice =
    Number.isFinite(parsed) && parsed > 0
      ? Math.min(PRICE_BOUNDS.max, Math.round(parsed))
      : undefined;

  return (
    <>
      <PageContainer className="py-6 lg:py-8">
        <Breadcrumbs items={breadcrumbs} />

        <div className="mt-4 mb-8">
          <h1 className="font-display text-2xl font-extrabold text-steel-900 sm:text-3xl">
            Commercial vehicle finance
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-pretty text-steel-600 sm:text-base">
            Work out what a vehicle actually costs per month before you make an
            offer. Adjust the down payment, rate and tenure to see how the EMI
            and total interest move.
          </p>
        </div>

        <EmiCalculator initialPrice={initialPrice} />
      </PageContainer>

      <Section className="bg-steel-50">
        <PageContainer>
          <SectionHeading
            eyebrow="How it works"
            title="From estimate to sanction in four steps"
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
        </PageContainer>
      </Section>

      <Section className="bg-white">
        <PageContainer>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Eligibility"
                title="What lenders look for"
                description="Requirements vary between lenders, but these are the levers that decide your rate."
              />

              <dl className="mt-7 space-y-4">
                {eligibility.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-3.5 border-b border-steel-100 pb-4 last:border-b-0"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-md bg-steel-100 text-steel-600">
                      <item.icon aria-hidden className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-sm font-semibold text-steel-900">
                        {item.label}
                      </dt>
                      <dd className="mt-0.5 text-sm text-pretty text-steel-600">
                        {item.value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>

              <Button asChild size="lg" className="mt-7">
                <Link href="/vehicles">Find a vehicle to finance</Link>
              </Button>
            </div>

            <div>
              <h2 className="font-display text-2xl font-extrabold text-steel-900">
                Common questions
              </h2>
              <Accordion
                type="single"
                collapsible
                className="mt-5 rounded-lg border border-steel-200 bg-white px-5"
              >
                {faqs.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`faq-${index}`}>
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
