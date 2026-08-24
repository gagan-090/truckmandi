"use client";

import { useCompare } from "@/features/compare/use-compare";
import { useFavorites } from "@/features/favorites/use-favorites";
import { useInquiries } from "@/features/inquiries/use-inquiries";

/**
 * Reads local selection, so it renders nothing until hydration settles —
 * that keeps the server and client markup identical.
 */
export function AccountCounters() {
  const favorites = useFavorites();
  const compare = useCompare();
  const inquiries = useInquiries();

  if (!favorites.hydrated || !compare.hydrated || !inquiries.hydrated) return null;
  if (favorites.count === 0 && compare.count === 0 && inquiries.count === 0) {
    return null;
  }

  return (
    <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
      <div className="rounded-lg border border-steel-200 bg-white px-4 py-3.5">
        <dt className="text-xs text-steel-500">Saved vehicles</dt>
        <dd className="tabular mt-0.5 font-display text-xl font-extrabold text-steel-900">
          {favorites.count}
        </dd>
      </div>
      <div className="rounded-lg border border-steel-200 bg-white px-4 py-3.5">
        <dt className="text-xs text-steel-500">In comparison</dt>
        <dd className="tabular mt-0.5 font-display text-xl font-extrabold text-steel-900">
          {compare.count}
        </dd>
      </div>
    </dl>
  );
}
