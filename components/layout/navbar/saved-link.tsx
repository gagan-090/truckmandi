"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavorites } from "@/features/favorites/use-favorites";

/**
 * Count comes from localStorage, so it is rendered only after hydration
 * to keep the server and client markup identical.
 */
export function SavedLink() {
  const { count, hydrated } = useFavorites();

  return (
    <Link
      href="/account/saved"
      className="relative grid size-11 place-items-center rounded-md text-steel-600 transition-colors hover:bg-steel-100 hover:text-steel-900"
      aria-label={
        hydrated && count > 0
          ? `Saved vehicles, ${count} saved`
          : "Saved vehicles"
      }
    >
      <Heart className="size-5" />
      {hydrated && count > 0 && (
        <span className="tabular absolute top-1.5 right-1.5 grid min-w-4 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
