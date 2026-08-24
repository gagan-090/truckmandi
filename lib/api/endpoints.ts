/**
 * Every path the TruckMitr Laravel API exposes, in one place. Nothing else
 * in the app builds an API URL by hand.
 */
export const endpoints = {
  brands: {
    list: "/brands",
    limited: "/brands/limited",
    used: "/brands/used",
    detail: (slug: string) => `/brands/${encodeURIComponent(slug)}`,
  },
  categories: {
    list: "/categories",
    limited: "/categories/limited",
    used: "/categories/used",
  },
  newTrucks: {
    list: "/new-trucks",
    limited: "/new-trucks/limited",
    products: "/new-trucks/trucks",
    used: "/new-trucks/used",
    detail: (slug: string, brand?: string) =>
      `/new-trucks/${encodeURIComponent(slug)}${brand ? `?brand=${encodeURIComponent(brand)}` : ""}`,
    filters: {
      categories: "/new-trucks/filter/categories",
      brands: "/new-trucks/filter/brands",
      series: "/new-trucks/filter/series",
      fuelTypes: "/new-trucks/filter/fuel-types",
      carrierTypes: "/new-trucks/filter/carrier-types",
    },
  },
  usedTrucks: {
    list: "/used-trucks",
    limited: "/used-trucks/limited",
    products: "/used-trucks/products",
    detail: (slug: string) => `/used-trucks/${encodeURIComponent(slug)}`,
    filters: {
      categories: "/used-trucks/filter/categories",
      brands: "/used-trucks/filter/brands",
      models: "/used-trucks/filter/models",
      fuelTypes: "/used-trucks/filter/fuel-types",
      states: "/used-trucks/filter/states",
      districts: "/used-trucks/filter/districts",
      priceRange: "/used-trucks/filter/price-range",
    },
  },
  compare: {
    cards: "/compare/cards",
    details: "/compare/details",
  },
  common: {
    vehicleTypes: "/common/vehicle-types",
    carrierTypes: "/carrier-types",
    fuelTypes: "/fuel-types",
    states: "/states",
    districts: "/districts",
    tehsils: "/tehsils",
    testimonials: "/testimonials",
    faqs: (pageId: string) => `/faqs/${encodeURIComponent(pageId)}`,
  },
  inquiries: {
    create: "/enquiry/store",
    lead: "/enquiry/store",
    loan: "/loan-enquiry/store",
    contact: "/contact-us/store",
    dealer: "/dealer-enquiry/store",
    mela: "/mela-enquiry/store",
    vehicleRequirement: "/vehicle-requirement/store",
  },
  listings: {
    create: "/used-trucks/store",
    uploadImage: "/used-trucks/store",
  },
  search: "/search",
} as const;

/** Cache tags, so a Laravel webhook can invalidate precisely. */
export const cacheTags = {
  vehicles: "vehicles",
  vehicle: (slug: string) => `vehicle:${slug}`,
  brands: "brands",
  categories: "categories",
  taxonomy: "taxonomy",
} as const;
