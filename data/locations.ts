import type { VehicleLocation } from "@/types/vehicle";

export interface MarketplaceRegion {
  slug: string;
  name: string;
  state: string;
  /** Cities rolled into this landing page, e.g. Delhi NCR covers Noida. */
  cities: string[];
  /** Shown on the homepage location rail. */
  featured: boolean;
}

export const regions: MarketplaceRegion[] = [
  {
    slug: "delhi-ncr",
    name: "Delhi NCR",
    state: "Delhi",
    cities: ["New Delhi", "Gurugram", "Noida", "Faridabad", "Ghaziabad"],
    featured: true,
  },
  {
    slug: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    cities: ["Mumbai", "Thane", "Navi Mumbai"],
    featured: true,
  },
  {
    slug: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    cities: ["Bengaluru", "Hosur"],
    featured: true,
  },
  {
    slug: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    cities: ["Chennai", "Coimbatore"],
    featured: true,
  },
  {
    slug: "pune",
    name: "Pune",
    state: "Maharashtra",
    cities: ["Pune", "Nashik"],
    featured: true,
  },
  {
    slug: "ahmedabad",
    name: "Ahmedabad",
    state: "Gujarat",
    cities: ["Ahmedabad", "Vadodara", "Surat"],
    featured: true,
  },
  {
    slug: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    cities: ["Hyderabad", "Vijayawada"],
    featured: true,
  },
  {
    slug: "kolkata",
    name: "Kolkata",
    state: "West Bengal",
    cities: ["Kolkata", "Howrah"],
    featured: true,
  },
  {
    slug: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    cities: ["Jaipur", "Jodhpur"],
    featured: false,
  },
  {
    slug: "lucknow",
    name: "Lucknow",
    state: "Uttar Pradesh",
    cities: ["Lucknow", "Kanpur", "Varanasi"],
    featured: false,
  },
  {
    slug: "indore",
    name: "Indore",
    state: "Madhya Pradesh",
    cities: ["Indore", "Bhopal"],
    featured: false,
  },
  {
    slug: "raipur",
    name: "Raipur",
    state: "Chhattisgarh",
    cities: ["Raipur", "Bilaspur"],
    featured: false,
  },
  {
    slug: "ludhiana",
    name: "Ludhiana",
    state: "Punjab",
    cities: ["Ludhiana", "Amritsar"],
    featured: false,
  },
  {
    slug: "nagpur",
    name: "Nagpur",
    state: "Maharashtra",
    cities: ["Nagpur"],
    featured: false,
  },
  {
    slug: "kochi",
    name: "Kochi",
    state: "Kerala",
    cities: ["Kochi", "Thiruvananthapuram"],
    featured: false,
  },
  {
    slug: "bellary",
    name: "Ballari",
    state: "Karnataka",
    cities: ["Ballari"],
    featured: false,
  },
  {
    slug: "dehradun",
    name: "Dehradun",
    state: "Uttarakhand",
    cities: ["Dehradun"],
    featured: false,
  },
];

const regionBySlug = new Map(regions.map((r) => [r.slug, r]));

export function getRegionBySlug(slug: string): MarketplaceRegion | undefined {
  return regionBySlug.get(slug);
}

export const featuredRegions = regions.filter((r) => r.featured);

/** Builds a `VehicleLocation` from a city that belongs to a known region. */
export function locationOf(
  city: string,
  regionSlug: string,
  pincode?: string,
): VehicleLocation {
  const region = regionBySlug.get(regionSlug);
  if (!region) {
    throw new Error(`Unknown region slug: ${regionSlug}`);
  }
  return {
    city,
    citySlug: city.toLowerCase().replace(/\s+/g, "-"),
    state: region.state,
    region: region.name,
    regionSlug: region.slug,
    pincode,
  };
}
