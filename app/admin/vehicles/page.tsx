import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { searchVehicles } from "@/features/vehicles/api";
import { AdminVehiclesTable } from "@/components/admin/admin-vehicles-table";

export default async function AdminVehiclesPage() {
  const searchRes = await searchVehicles({ page: 1, pageSize: 50, sort: "relevance" });
  const result = searchRes.page;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-steel-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between shadow-2xs">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-steel-900">
            Vehicle Inventory Control ({result.total})
          </h2>
          <p className="mt-1 text-sm text-steel-600">
            View, search, edit, and delete truck listings directly connected to your MongoDB database.
          </p>
        </div>
        <Button asChild variant="accent">
          <Link href="/admin/vehicles/new" className="gap-2">
            <Plus className="size-4" />
            Add New Truck
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-steel-200 bg-white p-6 shadow-2xs">
        <AdminVehiclesTable initialVehicles={result.items} />
      </div>
    </div>
  );
}
