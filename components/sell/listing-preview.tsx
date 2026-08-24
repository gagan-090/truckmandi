"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, TriangleAlert } from "lucide-react";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VehiclePrice } from "@/components/marketplace/vehicle-price";
import { getBrandBySlug } from "@/data/brands";
import { getRegionBySlug } from "@/data/locations";
import { getCategoryById } from "@/data/vehicle-categories";
import {
  bodyTypeLabels,
  conditionLabels,
  fuelTypeLabels,
  sellerTypeLabels,
  transmissionLabels,
} from "@/data/vehicle-types";
import { createListing } from "@/features/sell/api";
import { useSellDraft } from "@/features/sell/store";
import { sellSteps } from "@/features/sell/steps";
import { track } from "@/lib/analytics/analytics";
import {
  formatKilometers,
  formatOwnership,
  formatWeight,
} from "@/lib/utils/format-number";
import { StepShell } from "./step-shell";

/**
 * Final review. Everything here mirrors how the listing will actually look,
 * with a link back to the step that owns each block.
 */
export function ListingPreview() {
  const router = useRouter();
  const { draft, photos, reset, restored } = useSellDraft();
  const [submitting, setSubmitting] = useState(false);

  const category = draft.category ? getCategoryById(draft.category) : undefined;
  const brand = draft.brand ? getBrandBySlug(draft.brand) : undefined;
  const region = draft.city ? getRegionBySlug(draft.city) : undefined;

  const title = [
    draft.manufacturingYear,
    brand?.name,
    draft.model,
    draft.variant,
  ]
    .filter(Boolean)
    .join(" ");

  const highlights = (draft.highlights ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const missing: string[] = [];
  if (!draft.category || !draft.brand || !draft.model)
    missing.push("Vehicle type");
  if (
    !draft.manufacturingYear ||
    !draft.registrationNumber ||
    !draft.description
  ) {
    missing.push("Vehicle details");
  }
  if (photos.length === 0) missing.push("Photos");
  if (!draft.price) missing.push("Price");
  if (!draft.sellerName || !draft.sellerPhone) missing.push("Your details");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (missing.length > 0) return;

    setSubmitting(true);
    const result = await createListing(draft, photos.length);
    track({
      name: "listing_completed",
      category: draft.category ?? "unknown",
      price: Number(draft.price) || 0,
    });
    reset();
    router.push(`/sell/success?ref=${result.id}`);
  }

  if (!restored) return null;

  const specs = [
    {
      label: "Year",
      value: draft.manufacturingYear ? String(draft.manufacturingYear) : "—",
    },
    {
      label: "Kilometres",
      value: draft.kilometers
        ? formatKilometers(Number(draft.kilometers))
        : "—",
    },
    {
      label: "Ownership",
      value: draft.ownershipCount
        ? formatOwnership(Number(draft.ownershipCount))
        : "—",
    },
    {
      label: "Fuel",
      value: draft.fuelType ? fuelTypeLabels[draft.fuelType] : "—",
    },
    {
      label: "Transmission",
      value: draft.transmission ? transmissionLabels[draft.transmission] : "—",
    },
    {
      label: "Condition",
      value: draft.condition ? conditionLabels[draft.condition] : "—",
    },
    {
      label: "GVW",
      value: formatWeight(draft.gvwKg ? Number(draft.gvwKg) : undefined),
    },
    {
      label: "Payload",
      value: formatWeight(
        draft.payloadKg ? Number(draft.payloadKg) : undefined,
      ),
    },
    {
      label: "Body type",
      value: draft.bodyType ? bodyTypeLabels[draft.bodyType] : "—",
    },
  ].filter((spec) => spec.value !== "—");

  return (
    <StepShell
      title="Preview & publish"
      description="This is what buyers will see. Check it over — you can edit anything from here."
      stepIndex={5}
      onSubmit={onSubmit}
      submitting={submitting}
      nextLabel={submitting ? "Publishing…" : "Publish listing"}
    >
      {missing.length > 0 && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4"
        >
          <TriangleAlert
            aria-hidden
            className="mt-0.5 size-5 shrink-0 text-amber-600"
          />
          <div className="min-w-0">
            <p className="text-sm font-bold text-amber-900">
              A few things still need completing
            </p>
            <p className="mt-1 text-sm text-amber-800">
              Finish {missing.join(", ")} before publishing.
            </p>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-steel-200 bg-white">
        <div className="relative aspect-[16/10] bg-steel-100">
          {photos[0] ? (
            <Image
              src={photos[0].url}
              alt={photos[0].name}
              fill
              sizes="(max-width: 1024px) 100vw, 720px"
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center text-sm text-steel-400">
              No photos added
            </div>
          )}

          {photos.length > 1 && (
            <span className="tabular absolute right-3 bottom-3 rounded-full bg-steel-950/75 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {photos.length} photos
            </span>
          )}
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            {category && (
              <Badge variant="outline" size="md">
                {category.name}
              </Badge>
            )}
            <Badge variant="warning" size="md">
              Pending review
            </Badge>
          </div>

          <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
            <h2 className="font-display text-xl font-extrabold text-steel-900 sm:text-2xl">
              {title || "Your listing"}
            </h2>
            <EditLink href={sellSteps[0].href} label="vehicle type" />
          </div>

          {region && (
            <p className="mt-1.5 text-sm text-steel-600">
              {region.name}, {region.state}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            {draft.price ? (
              <VehiclePrice
                price={Number(draft.price)}
                negotiable={draft.negotiable}
                size="lg"
                showExact
              />
            ) : (
              <p className="text-sm text-steel-500">No price set</p>
            )}
            <EditLink href={sellSteps[3].href} label="price" />
          </div>

          {specs.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xs font-bold tracking-[0.1em] text-steel-500 uppercase">
                  Specifications
                </h3>
                <EditLink href={sellSteps[1].href} label="details" />
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-steel-200 bg-steel-200 sm:grid-cols-3">
                {specs.map((spec) => (
                  <div key={spec.label} className="bg-white px-4 py-3">
                    <dt className="text-xs text-steel-500">{spec.label}</dt>
                    <dd className="tabular mt-0.5 text-sm font-bold text-steel-900">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {highlights.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xs font-bold tracking-[0.1em] text-steel-500 uppercase">
                Highlights
              </h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="rounded-md bg-steel-50 px-3.5 py-2.5 text-sm text-pretty text-steel-700"
                  >
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {draft.description && (
            <div className="mt-6">
              <h3 className="text-xs font-bold tracking-[0.1em] text-steel-500 uppercase">
                Description
              </h3>
              <p className="mt-2.5 leading-relaxed text-pretty text-steel-700">
                {draft.description}
              </p>
            </div>
          )}

          <div className="mt-6 border-t border-steel-200 pt-5">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xs font-bold tracking-[0.1em] text-steel-500 uppercase">
                Seller
              </h3>
              <EditLink href={sellSteps[4].href} label="your details" />
            </div>
            <p className="mt-2.5 text-sm text-steel-700">
              {draft.sellerName || "—"}
              {draft.sellerType && (
                <span className="text-steel-500">
                  {" · "}
                  {sellerTypeLabels[draft.sellerType]}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs leading-relaxed text-steel-500">
        Listings are reviewed before going live, usually within a few hours. We
        check the registration details and documents you declared; anything that
        does not match is sent back to you rather than published.
      </p>
    </StepShell>
  );
}

function EditLink({ href, label }: { href: string; label: string }) {
  return (
    <Button asChild variant="ghost" size="xs">
      <Link href={href}>
        <Pencil className="size-3.5" />
        <span className="sr-only">Edit </span>
        {label}
      </Link>
    </Button>
  );
}
