import Link from "next/link";
import { Clock, MapPin, Star, Store, User } from "lucide-react";
import { VerifiedBadge } from "./verification-badge";
import { sellerTypeLabels } from "@/data/vehicle-types";
import { formatListingDate } from "@/lib/utils/format-distance";
import { cn } from "@/lib/utils/cn";
import type { Seller } from "@/types/seller";

/**
 * Seller identity block. Reused on the listing page and in the dealer
 * directory, so it takes a `Seller` and nothing listing-specific.
 */
export function SellerCard({
  seller,
  className,
  showLink = true,
}: {
  seller: Seller;
  className?: string;
  showLink?: boolean;
}) {
  const isDealer = seller.type === "dealer";
  const Icon = isDealer ? Store : User;

  return (
    <div
      className={cn(
        "rounded-lg border border-steel-200 bg-white p-4",
        className,
      )}
    >
      <div className="flex items-start gap-3.5">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-steel-100 text-steel-600">
          <Icon aria-hidden className="size-5" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-display text-base font-bold text-steel-900">
              {seller.name}
            </p>
            {seller.verified && <VerifiedBadge />}
          </div>

          <p className="mt-0.5 text-sm text-steel-600">
            {sellerTypeLabels[seller.type]}
            {seller.rating !== undefined && (
              <>
                <span aria-hidden> · </span>
                <span className="inline-flex items-center gap-1">
                  <Star
                    aria-hidden
                    className="size-3.5 fill-amber-400 text-amber-400"
                  />
                  <span className="tabular">{seller.rating.toFixed(1)}</span>
                  <span className="text-steel-500">
                    ({seller.reviewCount} reviews)
                  </span>
                </span>
              </>
            )}
          </p>

          <dl className="mt-3 grid gap-x-4 gap-y-1.5 text-xs text-steel-600 sm:grid-cols-2">
            <div className="flex items-center gap-1.5">
              <MapPin
                aria-hidden
                className="size-3.5 shrink-0 text-steel-400"
              />
              <dt className="sr-only">Location</dt>
              <dd>
                {seller.location.city}, {seller.location.state}
              </dd>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock aria-hidden className="size-3.5 shrink-0 text-steel-400" />
              <dt className="sr-only">Member since</dt>
              <dd>Member since {formatListingDate(seller.memberSince)}</dd>
            </div>

            <div>
              <dt className="sr-only">Active listings</dt>
              <dd>
                <span className="tabular font-semibold text-steel-800">
                  {seller.totalListings}
                </span>{" "}
                vehicles listed
              </dd>
            </div>

            {seller.responseRate !== undefined && (
              <div>
                <dt className="sr-only">Response rate</dt>
                <dd>
                  <span className="tabular font-semibold text-steel-800">
                    {seller.responseRate}%
                  </span>{" "}
                  response rate
                </dd>
              </div>
            )}
          </dl>

          {showLink && isDealer && (
            <Link
              href={`/dealers/${seller.slug}`}
              className="mt-3.5 inline-block text-sm font-semibold text-brand-700 transition-colors hover:text-brand-800"
            >
              View dealer profile & inventory →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
