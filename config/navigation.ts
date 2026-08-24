export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Buy Vehicles", href: "/vehicles" },
  { label: "Sell Vehicle", href: "/sell" },
  { label: "Dealers", href: "/dealers" },
  { label: "Finance", href: "/finance" },
  { label: "Compare", href: "/compare" },
];

/** Bottom bar on mobile. Five slots, thumb-reachable, icons from Lucide. */
export const mobileNav: Array<NavItem & { icon: string }> = [
  { label: "Home", href: "/", icon: "Home" },
  { label: "Search", href: "/vehicles", icon: "Search" },
  { label: "Sell", href: "/sell", icon: "CirclePlus" },
  { label: "Saved", href: "/account/saved", icon: "Heart" },
  { label: "Account", href: "/account", icon: "User" },
];

export const accountNav: NavItem[] = [
  { label: "Overview", href: "/account" },
  { label: "Saved vehicles", href: "/account/saved" },
  { label: "My inquiries", href: "/account/inquiries" },
  { label: "My listings", href: "/account/listings" },
  { label: "Profile", href: "/account/profile" },
];

export const footerNav: NavSection[] = [
  {
    label: "Marketplace",
    items: [
      { label: "All vehicles", href: "/vehicles" },
      { label: "Used trucks", href: "/vehicles/category/trucks" },
      { label: "Used pickups", href: "/vehicles/category/pickups" },
      { label: "Tippers", href: "/vehicles/category/tippers" },
      { label: "Buses", href: "/vehicles/category/buses" },
      { label: "Compare vehicles", href: "/compare" },
    ],
  },
  {
    label: "Brands",
    items: [
      { label: "Tata Motors", href: "/vehicles/brand/tata" },
      { label: "Mahindra", href: "/vehicles/brand/mahindra" },
      { label: "Ashok Leyland", href: "/vehicles/brand/ashok-leyland" },
      { label: "Eicher", href: "/vehicles/brand/eicher" },
      { label: "BharatBenz", href: "/vehicles/brand/bharatbenz" },
      { label: "Force Motors", href: "/vehicles/brand/force" },
    ],
  },
  {
    label: "Cities",
    items: [
      { label: "Delhi NCR", href: "/vehicles/location/delhi-ncr" },
      { label: "Mumbai", href: "/vehicles/location/mumbai" },
      { label: "Bengaluru", href: "/vehicles/location/bengaluru" },
      { label: "Chennai", href: "/vehicles/location/chennai" },
      { label: "Pune", href: "/vehicles/location/pune" },
      { label: "Ahmedabad", href: "/vehicles/location/ahmedabad" },
    ],
  },
  {
    label: "Company",
    items: [
      { label: "About us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Sell your vehicle", href: "/sell" },
      { label: "Finance", href: "/finance" },
      { label: "Dealer network", href: "/dealers" },
    ],
  },
];

export const legalNav: NavItem[] = [
  { label: "Terms of use", href: "/terms" },
  { label: "Privacy policy", href: "/privacy" },
  { label: "Sitemap", href: "/sitemap.xml" },
];
