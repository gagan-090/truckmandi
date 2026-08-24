/** Marketplace-wide limits and defaults. Never inline these in components. */

export const SEARCH_PAGE_SIZE = 12;
export const SIMILAR_VEHICLES_COUNT = 6;
export const FEATURED_VEHICLES_COUNT = 8;
export const MAX_COMPARE_VEHICLES = 4;
export const MAX_LISTING_IMAGES = 12;
export const MIN_LISTING_IMAGES = 3;
export const MAX_IMAGE_SIZE_MB = 8;

export const SEARCH_DEBOUNCE_MS = 300;

export const PRICE_BOUNDS = { min: 0, max: 10_000_000 } as const;
export const KM_BOUNDS = { min: 0, max: 1_000_000 } as const;
export const GVW_BOUNDS = { min: 0, max: 60_000 } as const;

export const CURRENT_YEAR = new Date().getFullYear();
export const OLDEST_LISTING_YEAR = 2000;

/** Finance defaults used by the EMI calculator and finance page. */
export const FINANCE_DEFAULTS = {
  downPaymentPercent: 20,
  interestRate: 11.5,
  tenureMonths: 48,
  minInterestRate: 7,
  maxInterestRate: 24,
  minTenureMonths: 12,
  maxTenureMonths: 84,
} as const;

export const LOCAL_STORAGE_KEYS = {
  favorites: "truckmitr:favorites",
  compare: "truckmitr:compare",
  recentSearches: "truckmitr:recent-searches",
  sellDraft: "truckmitr:sell-draft",
  inquiries: "truckmitr:inquiries",
} as const;
