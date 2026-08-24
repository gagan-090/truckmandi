"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/features/favorites/use-favorites";
import { cn } from "@/lib/utils/cn";

export interface FavoriteButtonProps {
  vehicleId: string;
  vehicleTitle: string;
  variant?: "overlay" | "plain";
  className?: string;
}

/**
 * Client island inside vehicle card for toggling favorites (like).
 */
export function FavoriteButton({
  vehicleId,
  vehicleTitle,
  variant = "overlay",
  className,
}: FavoriteButtonProps) {
  const { isFavorite, toggle, hydrated } = useFavorites();
  const saved = hydrated && isFavorite(vehicleId);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(vehicleId);
      }}
      aria-pressed={saved}
      aria-label={
        saved ? `Remove ${vehicleTitle} from saved` : `Save ${vehicleTitle}`
      }
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full transition-all duration-150 cursor-pointer",
        saved
          ? "bg-red-50 text-red-600 ring-2 ring-red-500/20 shadow-sm"
          : variant === "overlay"
            ? "bg-white/95 text-steel-700 shadow-sm backdrop-blur-sm hover:bg-white active:scale-95"
            : "border border-steel-300 bg-white hover:border-steel-400 hover:bg-steel-50",
        className,
      )}
    >
      <Heart
        className={cn(
          "size-[18px] transition-all duration-200",
          saved ? "fill-red-600 text-red-600 scale-110" : "text-steel-600 hover:text-red-500",
        )}
      />
    </button>
  );
}
