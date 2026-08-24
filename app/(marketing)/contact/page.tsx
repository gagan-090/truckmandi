import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/marketplace/breadcrumbs";
import { PageContainer } from "@/components/layout/page-container";
import { ContactForm } from "@/components/contact/contact-form";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/structured-data";

export const metadata: Metadata = buildMetadata({
  title: "Contact TruckMitr Exchange",
  description:
    "Get in touch about buying, selling, finance, inspection or a dealer partnership. We reply within one working day.",
  path: "/contact",
});

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Contact", href: "/contact" },
];

export default function ContactPage() {
  const details = [
    {
      icon: Phone,
      label: "Call us",
      value: siteConfig.contact.phone,
      href: siteConfig.contact.phoneHref,
    },
    {
      icon: Mail,
      label: "Email",
      value: siteConfig.contact.email,
      href: `mailto:${siteConfig.contact.email}`,
    },
    {
      icon: MapPin,
      label: "Office",
      value: siteConfig.contact.address,
    },
    {
      icon: Clock,
      label: "Support hours",
      value: "Monday to Saturday, 9:00 AM – 7:00 PM IST",
    },
  ];

  return (
    <PageContainer className="py-6 lg:py-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-4 mb-8 max-w-2xl">
        <h1 className="font-display text-2xl font-extrabold text-steel-900 sm:text-3xl">
          Talk to us
        </h1>
        <p className="mt-2 text-pretty text-steel-600">
          Questions about a listing, help with paperwork, or interested in
          listing your dealership? Send a message and we will get back to you
          within one working day.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-12">
        <ContactForm />

        <div>
          <dl className="space-y-5">
            {details.map((detail) => (
              <div key={detail.label} className="flex items-start gap-3.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-steel-100 text-steel-600">
                  <detail.icon aria-hidden className="size-4" />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs text-steel-500">{detail.label}</dt>
                  <dd className="mt-0.5 text-sm text-pretty text-steel-800">
                    {detail.href ? (
                      <a
                        href={detail.href}
                        className="font-medium transition-colors hover:text-brand-700"
                      >
                        {detail.value}
                      </a>
                    ) : (
                      detail.value
                    )}
                  </dd>
                </div>
              </div>
            ))}
          </dl>

          <div className="mt-8 rounded-lg border border-steel-200 bg-steel-50 p-5">
            <h2 className="font-display text-sm font-bold text-steel-900">
              Reporting a problem with a listing
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-pretty text-steel-600">
              If a listing looks misrepresented or a seller is behaving badly,
              tell us the listing URL and what happened. We investigate every
              report and remove listings that do not hold up.
            </p>
          </div>
        </div>
      </div>

      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </PageContainer>
  );
}
