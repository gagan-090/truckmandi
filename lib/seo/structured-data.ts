import { siteConfig } from "@/config/site";
import type { Dealer } from "@/types/dealer";
import type { Vehicle } from "@/types/vehicle";
import { absoluteUrl } from "./metadata";

/**
 * JSON-LD builders. Everything is emitted through `JsonLd`, which escapes
 * the closing-script sequence so listing text can never break out of the
 * script tag.
 */

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue | undefined };

export type StructuredData = { [key: string]: JsonValue | undefined };

export function organizationSchema(): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/images/brand/logo-512.png"),
    description: siteConfig.description,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address,
      addressCountry: "IN",
    },
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.facebook,
      siteConfig.social.youtube,
      siteConfig.social.instagram,
    ],
  };
}

export function websiteSchema(): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/vehicles?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export interface BreadcrumbEntry {
  name: string;
  href: string;
}

export function breadcrumbSchema(items: BreadcrumbEntry[]): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

/**
 * A used commercial vehicle is a `Vehicle` (a `Product` subtype), so search
 * engines get both the offer and the mechanical detail.
 */
export function vehicleSchema(vehicle: Vehicle): StructuredData {
  const availability =
    vehicle.status === "available"
      ? "https://schema.org/InStock"
      : vehicle.status === "reserved"
        ? "https://schema.org/LimitedAvailability"
        : "https://schema.org/SoldOut";

  return {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: vehicle.title,
    description: vehicle.description,
    url: absoluteUrl(`/vehicles/${vehicle.slug}`),
    image: vehicle.images.map((image) => absoluteUrl(image.url)),
    sku: vehicle.id,
    brand: { "@type": "Brand", name: vehicle.brand.name },
    model: vehicle.model,
    vehicleConfiguration: vehicle.variant,
    vehicleModelDate: String(vehicle.manufacturingYear),
    productionDate: String(vehicle.manufacturingYear),
    fuelType: vehicle.fuelType,
    vehicleTransmission: vehicle.transmission,
    numberOfPreviousOwners: vehicle.ownershipCount,
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: vehicle.kilometers,
      unitCode: "KMT",
    },
    weightTotal: vehicle.specifications.gvwKg
      ? {
          "@type": "QuantitativeValue",
          value: vehicle.specifications.gvwKg,
          unitCode: "KGM",
        }
      : undefined,
    payload: vehicle.specifications.payloadKg
      ? {
          "@type": "QuantitativeValue",
          value: vehicle.specifications.payloadKg,
          unitCode: "KGM",
        }
      : undefined,
    vehicleEngine: vehicle.specifications.engineCapacityCc
      ? {
          "@type": "EngineSpecification",
          engineDisplacement: {
            "@type": "QuantitativeValue",
            value: vehicle.specifications.engineCapacityCc,
            unitCode: "CMQ",
          },
          enginePower: vehicle.specifications.maxPowerBhp
            ? {
                "@type": "QuantitativeValue",
                value: vehicle.specifications.maxPowerBhp,
                unitCode: "BHP",
              }
            : undefined,
        }
      : undefined,
    itemCondition: "https://schema.org/UsedCondition",
    offers: {
      "@type": "Offer",
      price: vehicle.price,
      priceCurrency: "INR",
      availability,
      url: absoluteUrl(`/vehicles/${vehicle.slug}`),
      itemCondition: "https://schema.org/UsedCondition",
      seller: {
        "@type":
          vehicle.seller.type === "individual" ? "Person" : "Organization",
        name: vehicle.seller.name,
      },
      areaServed: {
        "@type": "City",
        name: vehicle.location.city,
      },
    },
  };
}

export function dealerSchema(
  dealer: Dealer,
  listingCount: number,
): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: dealer.name,
    url: absoluteUrl(`/dealers/${dealer.slug}`),
    description: dealer.about,
    telephone: dealer.phone,
    foundingDate: String(dealer.establishedYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: dealer.address,
      addressLocality: dealer.location.city,
      addressRegion: dealer.location.state,
      addressCountry: "IN",
    },
    openingHours: dealer.workingHours,
    aggregateRating:
      dealer.rating && dealer.reviewCount
        ? {
            "@type": "AggregateRating",
            ratingValue: dealer.rating,
            reviewCount: dealer.reviewCount,
            bestRating: 5,
          }
        : undefined,
    makesOffer: {
      "@type": "OfferCatalog",
      name: `Used commercial vehicles at ${dealer.name}`,
      numberOfItems: listingCount,
    },
  };
}

export function itemListSchema(
  items: Array<{ name: string; href: string }>,
  name: string,
): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.href),
    })),
  };
}

export function faqSchema(
  entries: Array<{ question: string; answer: string }>,
): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}
