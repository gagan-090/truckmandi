"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Minus, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VehiclePrice } from "@/components/marketplace/vehicle-price";
import { VerifiedBadge } from "@/components/marketplace/verification-badge";
import { MAX_COMPARE_VEHICLES } from "@/config/constants";
import { cn } from "@/lib/utils/cn";
import type { CompareRow, CompareVehicle } from "@/features/compare/build-rows";

export interface CompareTableProps {
  vehicles: CompareVehicle[];
  rows: CompareRow[];
  onRemove: (vehicleId: string) => void;
}

/**
 * Side-by-side comparison.
 *
 * Below `lg` the table scrolls horizontally with the label column pinned,
 * which is the only layout that stays readable for four columns of specs on
 * a phone. Rows where every vehicle matches are dimmed so differences pop.
 */
export function CompareTable({ vehicles, rows, onRemove }: CompareTableProps) {
  const emptySlots = Math.max(0, MAX_COMPARE_VEHICLES - vehicles.length);

  return (
    <div className="overflow-x-auto rounded-lg border border-steel-200 bg-white">
      <table className="w-full min-w-[44rem] border-collapse text-sm">
        <caption className="sr-only">
          Specification comparison of {vehicles.length} commercial vehicles
        </caption>

        <thead>
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-10 w-36 border-b border-steel-200 bg-white p-4 text-left align-bottom sm:w-48"
            >
              <span className="text-xs font-bold tracking-[0.1em] text-steel-500 uppercase">
                Comparing
              </span>
            </th>

            {vehicles.map((vehicle) => (
              <th
                key={vehicle.id}
                scope="col"
                className="min-w-56 border-b border-l border-steel-200 p-4 text-left align-top"
              >
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => onRemove(vehicle.id)}
                    aria-label={`Remove ${vehicle.title} from comparison`}
                    className="absolute -top-1 -right-1 z-10 grid size-7 place-items-center rounded-full bg-white text-steel-500 shadow-sm transition-colors hover:bg-steel-100 hover:text-steel-900"
                  >
                    <X className="size-3.5" />
                  </button>

                  <Link
                    href={`/vehicles/${vehicle.slug}`}
                    className="group block"
                  >
                    <span className="relative block aspect-[4/3] overflow-hidden rounded-md bg-steel-100">
                      {vehicle.imageUrl && (
                        <Image
                          src={vehicle.imageUrl}
                          alt=""
                          fill
                          sizes="240px"
                          placeholder={vehicle.blurDataURL ? "blur" : "empty"}
                          blurDataURL={vehicle.blurDataURL}
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                    </span>

                    <span className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      <Badge variant="outline">{vehicle.categoryName}</Badge>
                      {vehicle.verified && <VerifiedBadge />}
                    </span>

                    <span className="mt-1.5 block font-display text-sm leading-snug font-bold text-steel-900 transition-colors group-hover:text-brand-700">
                      {vehicle.title}
                    </span>
                  </Link>

                  <div className="mt-2">
                    <VehiclePrice
                      price={vehicle.price}
                      previousPrice={vehicle.previousPrice}
                      size="md"
                    />
                  </div>

                  <Button asChild size="sm" block className="mt-3">
                    <Link href={`/vehicles/${vehicle.slug}`}>View listing</Link>
                  </Button>
                </div>
              </th>
            ))}

            {Array.from({ length: emptySlots }, (_, index) => (
              <th
                key={`empty-${index}`}
                scope="col"
                className="min-w-56 border-b border-l border-steel-200 p-4 align-top"
              >
                <Link
                  href="/vehicles"
                  className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-steel-300 text-steel-500 transition-colors hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-700"
                >
                  <Plus className="size-5" />
                  <span className="text-xs font-semibold">Add a vehicle</span>
                </Link>
              </th>
            ))}
          </tr>
        </thead>

        {rows.length > 0 && (
          <tbody>
            {rows.map((row) => {
              const values = vehicles.map((v) => row.values[v.id] ?? "—");
              const allSame = values.every((value) => value === values[0]);

              return (
                <tr
                  key={row.label}
                  className={cn(
                    "border-b border-steel-100 last:border-b-0",
                    row.isGroupStart && "border-t-2 border-t-steel-200",
                  )}
                >
                  <th
                    scope="row"
                    className={cn(
                      "sticky left-0 z-10 bg-white p-4 text-left align-middle font-medium",
                      allSame ? "text-steel-500" : "text-steel-800",
                    )}
                  >
                    {row.isGroupStart && (
                      <span className="mb-1.5 block text-[10px] font-bold tracking-[0.1em] text-steel-400 uppercase">
                        {row.group}
                      </span>
                    )}
                    {row.label}
                  </th>

                  {vehicles.map((vehicle) => {
                    const value = row.values[vehicle.id] ?? "—";

                    return (
                      <td
                        key={vehicle.id}
                        className={cn(
                          "tabular border-l border-steel-200 p-4 align-middle",
                          allSame
                            ? "text-steel-500"
                            : "font-semibold text-steel-900",
                        )}
                      >
                        {value === "yes" ? (
                          <span className="inline-flex items-center gap-1.5 font-semibold text-trust-700">
                            <Check aria-hidden className="size-4" />
                            Yes
                          </span>
                        ) : value === "no" ? (
                          <span className="inline-flex items-center gap-1.5 text-steel-400">
                            <Minus aria-hidden className="size-4" />
                            No
                          </span>
                        ) : (
                          value
                        )}
                      </td>
                    );
                  })}

                  {Array.from({ length: emptySlots }, (_, index) => (
                    <td
                      key={`empty-${index}`}
                      className="border-l border-steel-200 p-4"
                    />
                  ))}
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
    </div>
  );
}
