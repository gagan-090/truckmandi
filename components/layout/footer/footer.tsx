import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { footerNav, legalNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Logo } from "../logo";

const socialLinks = [
  { label: "LinkedIn", href: siteConfig.social.linkedin },
  { label: "YouTube", href: siteConfig.social.youtube },
  { label: "Instagram", href: siteConfig.social.instagram },
  { label: "Facebook", href: siteConfig.social.facebook },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-steel-800 bg-steel-950 text-steel-300">
      <PageContainer className="py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))] lg:gap-8">
          <div className="max-w-sm">
            <Logo tone="light" />
            <p className="mt-4 text-sm leading-relaxed text-steel-400">
              {siteConfig.tagline}. Verified listings, inspected vehicles and
              transparent pricing for buyers, sellers and dealers across India.
            </p>

            <address className="mt-6 space-y-3 text-sm not-italic">
              <a
                href={siteConfig.contact.phoneHref}
                className="flex items-center gap-2.5 text-steel-300 transition-colors hover:text-white"
              >
                <Phone className="size-4 shrink-0 text-brand-500" />
                {siteConfig.contact.phone}
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-2.5 text-steel-300 transition-colors hover:text-white"
              >
                <Mail className="size-4 shrink-0 text-brand-500" />
                {siteConfig.contact.email}
              </a>
              <p className="flex items-start gap-2.5 text-steel-400">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-500" />
                {siteConfig.contact.address}
              </p>
            </address>
          </div>

          {footerNav.map((section) => (
            <nav key={section.label} aria-label={section.label}>
              <h2 className="font-display text-xs font-bold tracking-[0.12em] text-white uppercase">
                {section.label}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-steel-400 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-steel-800 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-steel-500">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legalNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs text-steel-400 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {socialLinks.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-steel-400 transition-colors hover:text-white"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </PageContainer>
    </footer>
  );
}
