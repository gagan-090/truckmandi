import Link from "next/link";
import { MapPin, Star, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { VerifiedBadge } from "@/components/marketplace/verification-badge";
import { getCategoryById } from "@/data/vehicle-categories";
import type { DealerWithStats } from "@/features/dealers/api";

export function DealerCard({ dealer }: { dealer: DealerWithStats }) {
  return (
    <article className="group relative flex h-full flex-col rounded-lg border border-steel-200 bg-white p-5 transition-all duration-200 hover:border-steel-300 hover:shadow-md">
      <div className="flex items-start gap-3.5">
        <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-steel-100 text-steel-600 transition-colors duration-200 group-hover:bg-brand-600 group-hover:text-white">
          <Store aria-hidden className="size-5" />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base font-bold text-steel-900">
            <Link
              href={`/dealers/${dealer.slug}`}
              className="after:absolute after:inset-0 after:content-['']"
            >
              {dealer.name}
            </Link>
          </h3>

          <p className="mt-1 flex items-center gap-1.5 text-sm text-steel-600">
            <MapPin aria-hidden className="size-3.5 shrink-0 text-steel-400" />
            <span className="truncate">
              {dealer.location.city}, {dealer.location.state}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
        {dealer.verified && <VerifiedBadge />}
        <Badge variant="neutral">Since {dealer.establishedYear}</Badge>
        {dealer.rating !== undefined && (
          <Badge variant="outline">
            <Star aria-hidden className="fill-amber-400 text-amber-400" />
            {dealer.rating.toFixed(1)}
          </Badge>
        )}
      </div>

      <p className="mt-3.5 line-clamp-2 text-sm text-pretty text-steel-600">
        {dealer.about}
      </p>

      {dealer.categories.length > 0 && (
        <ul className="mt-3.5 flex flex-wrap gap-1.5">
          {dealer.categories.slice(0, 3).map((id) => (
            <li
              key={id}
              className="rounded-sm bg-steel-100 px-2 py-1 text-[11px] font-medium text-steel-600"
            >
              {getCategoryById(id)?.name ?? id}
            </li>
          ))}
        </ul>
      )}

      <dl className="mt-auto flex items-center gap-5 border-t border-steel-100 pt-3.5 text-xs text-steel-500">
        <div>
          <dt className="sr-only">Live listings</dt>
          <dd>
            <span className="tabular font-bold text-steel-900">
              {dealer.liveListings}
            </span>{" "}
            vehicles
          </dd>
        </div>
        {dealer.responseRate !== undefined && (
          <div>
            <dt className="sr-only">Response rate</dt>
            <dd>
              <span className="tabular font-bold text-steel-900">
                {dealer.responseRate}%
              </span>{" "}
              response
            </dd>
          </div>
        )}
      </dl>
    </article>
  );
}
