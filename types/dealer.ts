import type { Seller } from "./seller";
import type { VehicleCategoryId } from "./vehicle";

export interface Dealer extends Seller {
  type: "dealer";
  establishedYear: number;
  about: string;
  /** Categories this dealer actually stocks — drives the profile filters. */
  specialities: VehicleCategoryId[];
  brandsDealt: string[];
  coverImageUrl?: string;
  address: string;
  workingHours: string;
  services: string[];
  activeListings: number;
}
