import type { VehicleLocation } from "./vehicle";

export const SELLER_TYPES = ["individual", "dealer", "fleet-owner"] as const;
export type SellerType = (typeof SELLER_TYPES)[number];

export interface Seller {
  id: string;
  slug: string;
  name: string;
  type: SellerType;
  verified: boolean;
  /** Masked until the buyer reveals it; never rendered raw from the API. */
  phone?: string;
  location: VehicleLocation;
  memberSince: string;
  totalListings: number;
  responseRate?: number;
  /** Median first-response time in minutes. */
  responseTimeMinutes?: number;
  rating?: number;
  reviewCount?: number;
  avatarUrl?: string;
}
