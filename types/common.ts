/** Shared primitives used across every domain model. */

export interface Money {
  amount: number;
  currency: "INR";
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

/** A named, slugged entity that can back an SEO landing page. */
export interface Taxonomy {
  slug: string;
  name: string;
}

export type SortDirection = "asc" | "desc";
