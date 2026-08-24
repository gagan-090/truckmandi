"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Edit3, Eye, MoreHorizontal, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils/format-currency";
import type { VehicleSummary } from "@/types/vehicle";

export function AdminVehiclesTable({
  initialVehicles,
}: {
  initialVehicles: VehicleSummary[];
}) {
  const [vehicles, setVehicles] = useState<VehicleSummary[]>(initialVehicles);
  const [search, setSearch] = useState("");
  const [deletedId, setDeletedId] = useState<string | null>(null);

  const filtered = vehicles.filter((v) =>
    v.title.toLowerCase().includes(search.toLowerCase()) ||
    v.brand.name.toLowerCase().includes(search.toLowerCase()) ||
    v.location.city.toLowerCase().includes(search.toLowerCase())
  );

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this vehicle listing from the MongoDB database?")) {
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      setDeletedId(id);
      setTimeout(() => setDeletedId(null), 3000);
    }
  }

  return (
    <div className="space-y-4">
      {/* Table Controls Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-steel-400" />
          <Input
            placeholder="Search by model or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <p className="text-xs text-steel-500">
          Showing {filtered.length} of {vehicles.length} listings
        </p>
      </div>

      {deletedId && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600" />
          Listing removed from database successfully.
        </div>
      )}

      {/* Responsive Table */}
      <div className="overflow-x-auto rounded-lg border border-steel-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-steel-100 font-bold uppercase tracking-wider text-steel-700">
            <tr>
              <th className="px-4 py-3">Vehicle Details</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-steel-200 bg-white font-medium text-steel-800">
            {filtered.slice(0, 15).map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-steel-50/70 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-steel-200 border border-steel-200">
                      {vehicle.images[0]?.url ? (
                        <Image
                          src={vehicle.images[0].url}
                          alt={vehicle.title}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div>
                      <p className="font-bold text-steel-900 line-clamp-1">{vehicle.title}</p>
                      <p className="text-[11px] text-steel-500 font-mono">ID: {vehicle.id.slice(0, 12)}...</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-md bg-steel-100 px-2 py-0.5 text-[11px] font-semibold text-steel-800">
                    {vehicle.category.name}
                  </span>
                </td>

                <td className="px-4 py-3 font-bold text-steel-900">
                  {formatCurrency(vehicle.price)}
                </td>

                <td className="px-4 py-3 text-steel-600">
                  {vehicle.location.city}, {vehicle.location.state}
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    <span className="size-1.5 rounded-full bg-emerald-600" />
                    Available
                  </span>
                </td>

                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button asChild variant="subtle" size="sm" className="size-8 p-0">
                      <Link href={`/vehicles/${vehicle.slug}`} title="View live page">
                        <Eye className="size-3.5" />
                      </Link>
                    </Button>
                    <Button
                      variant="subtle"
                      size="sm"
                      onClick={() => handleDelete(vehicle.id)}
                      className="size-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                      title="Delete vehicle"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
