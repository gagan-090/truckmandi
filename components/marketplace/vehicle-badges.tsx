import { Flame, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { VerifiedBadge } from "./verification-badge";
import type { VehicleStatus, VehicleVerification } from "@/types/vehicle";

export interface VehicleBadgesProps {
  featured?: boolean;
  verification: VehicleVerification;
  status: VehicleStatus;
  /** Computed server-side; see `toVehicleSummary`. */
  justListed?: boolean;
}

/**
 * Overlay badges on a listing photo. Kept to two at a time — more than that
 * and the photo stops selling the vehicle.
 */
export function VehicleBadges({
  featured,
  verification,
  status,
  justListed = false,
}: VehicleBadgesProps) {
  return (
    <div className="pointer-events-none absolute inset-x-2.5 top-2.5 flex flex-wrap items-start gap-1.5">
      {status === "sold" && (
        <Badge variant="solid" size="md">
          Sold
        </Badge>
      )}
      {status === "reserved" && (
        <Badge variant="warning" size="md">
          Reserved
        </Badge>
      )}
      {featured && status === "available" && (
        <Badge variant="featured" size="md">
          <Flame aria-hidden />
          Featured
        </Badge>
      )}
      {!featured && justListed && status === "available" && (
        <Badge variant="solid" size="md">
          <Sparkles aria-hidden />
          Just listed
        </Badge>
      )}
      {verification.isVerified && (
        <VerifiedBadge size="md" className="bg-white/95 backdrop-blur-sm" />
      )}
    </div>
  );
}
