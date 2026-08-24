export const siteConfig = {
  name: "TruckMitr Exchange",
  shortName: "TruckMitr",
  tagline: "The modern Indian marketplace for commercial vehicles",
  description:
    "Buy and sell used trucks, pickups, tippers, tankers, buses and construction vehicles across India. Verified listings, inspected vehicles, transparent pricing and finance in one place.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  locale: "en_IN",
  contact: {
    phone: "+91 98100 45500",
    phoneHref: "tel:+919810045500",
    email: "support@truckmitr.com",
    whatsapp: "+919810045500",
    address: "4th Floor, Emerald Plaza, Sector 65, Gurugram, Haryana 122018",
  },
  social: {
    twitter: "@truckmitr",
    facebook: "https://facebook.com/truckmitr",
    linkedin: "https://linkedin.com/company/truckmitr",
    youtube: "https://youtube.com/@truckmitr",
    instagram: "https://instagram.com/truckmitr",
  },
} as const;

export type SiteConfig = typeof siteConfig;
