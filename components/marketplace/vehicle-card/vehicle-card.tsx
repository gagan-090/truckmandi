import Image from "next/image";
import Link from "next/link";
import { Fuel, Gauge, MapPin, Users } from "lucide-react";
import {
  formatKilometersShort,
  formatOwnershipShort,
  formatWeight,
} from "@/lib/utils/format-number";
import { formatRelativeTime } from "@/lib/utils/format-distance";
import { fuelTypeLabels, sellerTypeLabels } from "@/data/vehicle-types";
import { cn } from "@/lib/utils/cn";
import type { VehicleSummary } from "@/types/vehicle";
import { CompareButton } from "../compare-button";
import { FavoriteButton } from "../favorite-button";
import { VehicleBadges } from "../vehicle-badges";
import { VehiclePrice } from "../vehicle-price";

export type VehicleCardVariant =
  "default" | "compact" | "featured" | "horizontal";

export interface VehicleCardProps {
  vehicle: VehicleSummary;
  variant?: VehicleCardVariant;
  /** Set on the first row of a grid so the LCP image is not lazy-loaded. */
  priority?: boolean;
  className?: string;
}

/**
 * The one listing card in the product. Variants change layout and density,
 * never the data contract — it is a presentation component and knows
 * nothing about fetching.
 *
 *   default    — marketplace grid
 *   compact    — dense mobile lists and rails
 *   featured   — homepage, larger photo and full spec strip
 *   horizontal — search results at desktop widths
 */
export function VehicleCard({
  vehicle,
  variant = "default",
  priority = false,
  className,
}: VehicleCardProps) {
  const href = `/vehicles/${vehicle.slug}`;
  const image = vehicle.images[0];
  const isHorizontal = variant === "horizontal";
  const isCompact = variant === "compact";
  const isFeatured = variant === "featured";

  const specs = [
    {
      icon: Gauge,
      label: formatKilometersShort(vehicle.kilometers),
      title: "Kilometres driven",
    },
    {
      icon: Fuel,
      label: fuelTypeLabels[vehicle.fuelType],
      title: "Fuel type",
    },
    {
      icon: Users,
      label: formatOwnershipShort(vehicle.ownershipCount),
      title: "Previous owners",
    },
  ];

  return (
    <article
      className={cn(
        "group relative flex overflow-hidden rounded-lg border border-steel-200 bg-white transition-all duration-200",
        "focus-within:border-steel-300 focus-within:shadow-md hover:border-steel-300 hover:shadow-md",
        isHorizontal ? "flex-col sm:flex-row" : "flex-col",
        vehicle.status === "sold" && "opacity-75",
        className,
      )}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden bg-steel-100",
          isHorizontal
            ? "aspect-[4/3] sm:w-64 sm:min-h-[200px] lg:w-72"
            : isFeatured
              ? "aspect-[16/11]"
              : "aspect-[4/3]",
        )}
      >
        {image ? (
          <Image
            src={image.url}
            alt={image.alt}
            fill
            priority={priority}
            loading={priority ? undefined : "lazy"}
            placeholder={image.blurDataURL ? "blur" : "empty"}
            blurDataURL={image.blurDataURL}
            sizes={
              isHorizontal
                ? "(max-width: 640px) 100vw, 288px"
                : isCompact
                  ? "(max-width: 640px) 45vw, 220px"
                  : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1400px) 33vw, 340px"
            }
            className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid h-full place-items-center text-xs text-steel-400">
            Photo coming soon
          </div>
        )}

        <VehicleBadges
          featured={vehicle.featured}
          verification={vehicle.verification}
          status={vehicle.status}
          justListed={vehicle.justListed}
        />

        <div className="absolute top-2.5 right-2.5 z-20 flex flex-col gap-1.5">
          <FavoriteButton vehicleId={vehicle.id} vehicleTitle={vehicle.title} />
          {!isCompact && (
            <CompareButton
              vehicleId={vehicle.id}
              vehicleTitle={vehicle.title}
              variant="overlay"
            />
          )}
        </div>
      </div>

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col",
          isCompact ? "gap-1.5 p-3" : "gap-2.5 p-4",
          isHorizontal && "sm:p-5",
        )}
      >
        <div className="min-w-0">
          <h3
            className={cn(
              "font-display leading-snug font-bold text-steel-900",
              isCompact
                ? "text-sm"
                : isFeatured || isHorizontal
                  ? "text-lg"
                  : "text-base",
            )}
          >
            <Link
              href={href}
              className="line-clamp-2 after:absolute after:inset-0 after:content-['']"
            >
              {vehicle.title}
            </Link>
          </h3>

          {!isCompact && (
            <p className="mt-1 truncate text-xs text-steel-500">
              {vehicle.category.name}
              {vehicle.specifications.gvwKg && (
                <> · GVW {formatWeight(vehicle.specifications.gvwKg)}</>
              )}
            </p>
          )}
        </div>

        <VehiclePrice
          price={vehicle.price}
          previousPrice={vehicle.previousPrice}
          negotiable={!isCompact && vehicle.negotiable}
          size={isCompact ? "sm" : isFeatured || isHorizontal ? "lg" : "md"}
        />

        <ul
          className={cn(
            "flex flex-wrap items-center gap-x-3 gap-y-1.5 text-steel-600",
            isCompact ? "text-[11px]" : "text-xs",
          )}
        >
          <li className="tabular font-semibold text-steel-800">
            {vehicle.manufacturingYear}
          </li>
          {specs.slice(0, isCompact ? 1 : 3).map((spec) => (
            <li
              key={spec.title}
              className="flex items-center gap-1"
              title={spec.title}
            >
              <spec.icon
                aria-hidden
                className="size-3.5 shrink-0 text-steel-400"
              />
              {spec.label}
            </li>
          ))}
        </ul>

        {isHorizontal && (
          <p className="line-clamp-2 text-sm text-steel-600">
            {vehicle.seller.type === "dealer"
              ? `Listed by ${vehicle.seller.name}, a verified dealer in ${vehicle.location.city}.`
              : `Available in ${vehicle.location.city}, ${vehicle.location.state}.`}
          </p>
        )}

        <div
          className={cn(
            "mt-auto flex items-center justify-between gap-2 border-t border-steel-100 pt-2.5",
            isCompact && "pt-2",
          )}
        >
          <p
            className={cn(
              "flex min-w-0 items-center gap-1 text-steel-500",
              isCompact ? "text-[11px]" : "text-xs",
            )}
          >
            <MapPin aria-hidden className="size-3.5 shrink-0" />
            <span className="truncate">{vehicle.location.city}</span>
          </p>

          <p
            className={cn(
              "shrink-0 text-right text-steel-400",
              isCompact ? "text-[10px]" : "text-[11px]",
            )}
          >
            {!isCompact && (
              <span className="font-medium text-steel-500">
                {sellerTypeLabels[vehicle.seller.type]}
              </span>
            )}
            {!isCompact && <span aria-hidden> · </span>}
            {formatRelativeTime(vehicle.createdAt)}
          </p>
        </div>
      </div>
    </article>
  );
}
