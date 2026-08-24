import { Eye, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { VerifiedBadge } from "@/components/marketplace/verification-badge";
import { formatListingDate } from "@/lib/utils/format-distance";
import { formatNumber } from "@/lib/utils/format-number";
import type { Vehicle } from "@/types/vehicle";

export function VehicleHeader({ vehicle }: { vehicle: Vehicle }) {
  return (
    <header>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" size="md">
          {vehicle.category.name}
        </Badge>
        {vehicle.verification.isVerified && <VerifiedBadge size="md" />}
        {vehicle.featured && (
          <Badge variant="featured" size="md">
            Featured
          </Badge>
        )}
        {vehicle.status === "sold" && (
          <Badge variant="solid" size="md">
            Sold
          </Badge>
        )}
        {vehicle.status === "reserved" && (
          <Badge variant="warning" size="md">
            Reserved
          </Badge>
        )}
      </div>

      <h1 className="mt-3 font-display text-2xl leading-tight font-extrabold text-balance text-steel-900 sm:text-3xl lg:text-[2rem]">
        {vehicle.title}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-steel-600">
        <span className="flex items-center gap-1.5">
          <MapPin aria-hidden className="size-4 shrink-0 text-steel-400" />
          {vehicle.location.city}, {vehicle.location.state}
        </span>
        <span className="flex items-center gap-1.5">
          <Eye aria-hidden className="size-4 shrink-0 text-steel-400" />
          {formatNumber(vehicle.viewCount)} views
        </span>
        <span className="text-steel-500">
          Listed {formatListingDate(vehicle.createdAt)}
        </span>
      </div>
    </header>
  );
}
