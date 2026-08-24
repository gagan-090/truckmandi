import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Database,
  Filter,
  Layers,
  MapPin,
  MessageSquare,
  Plus,
  PlusCircle,
  Search,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMarketStats, searchVehicles } from "@/features/vehicles/api";
import { formatCurrency } from "@/lib/utils/format-currency";
import { AdminVehiclesTable } from "@/components/admin/admin-vehicles-table";

export default async function AdminDashboardPage() {
  const stats = await getMarketStats();
  const searchRes = await searchVehicles({ page: 1, pageSize: 10, sort: "relevance" });
  const recentVehicles = searchRes.page;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 rounded-xl border border-steel-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between shadow-2xs">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-steel-900">
            System Overview & Control Panel
          </h2>
          <p className="mt-1 text-sm text-steel-600">
            Real-time management for live MongoDB listings, customer leads, dealers, and marketplace transactions.
          </p>
        </div>
        <Button asChild variant="accent">
          <Link href="/admin/vehicles/new" className="gap-2">
            <Plus className="size-4" />
            Add New Truck
          </Link>
        </Button>
      </div>

      {/* 4 Live Metrics Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-steel-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-steel-500">
              Total MongoDB Vehicles
            </span>
            <div className="grid size-9 place-items-center rounded-lg bg-brand-50 text-brand-600">
              <Truck className="size-5" />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-extrabold text-steel-900">
            {stats.totalListings}
          </p>
          <p className="mt-1 text-xs text-steel-500">Live active inventory items</p>
        </div>

        <div className="rounded-xl border border-steel-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-steel-500">
              Verified Vehicles
            </span>
            <div className="grid size-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="size-5" />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-extrabold text-steel-900">
            {stats.verifiedListings}
          </p>
          <p className="mt-1 text-xs text-steel-500">RC & Document Checked</p>
        </div>

        <div className="rounded-xl border border-steel-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-steel-500">
              Cities Covered
            </span>
            <div className="grid size-9 place-items-center rounded-lg bg-blue-50 text-blue-600">
              <MapPin className="size-5" />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-extrabold text-steel-900">
            {stats.cities}
          </p>
          <p className="mt-1 text-xs text-steel-500">Across pan-India regions</p>
        </div>

        <div className="rounded-xl border border-steel-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-steel-500">
              Median Truck Price
            </span>
            <div className="grid size-9 place-items-center rounded-lg bg-purple-50 text-purple-600">
              <BarChart3 className="size-5" />
            </div>
          </div>
          <p className="mt-3 font-display text-2xl font-extrabold text-steel-900">
            {formatCurrency(stats.medianPrice)}
          </p>
          <p className="mt-1 text-xs text-steel-500">Platform valuation benchmark</p>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/vehicles/new"
          className="group rounded-xl border border-steel-200 bg-white p-5 transition-all hover:border-brand-500 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="grid size-10 place-items-center rounded-lg bg-brand-100 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
              <PlusCircle className="size-5" />
            </div>
            <ArrowRight className="size-4 text-steel-400 group-hover:text-brand-600 transition-transform group-hover:translate-x-1" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-steel-900">Add New Truck</h3>
          <p className="mt-1 text-xs text-steel-500">Publish a new commercial vehicle listing to the MongoDB database.</p>
        </Link>

        <Link
          href="/admin/vehicles"
          className="group rounded-xl border border-steel-200 bg-white p-5 transition-all hover:border-brand-500 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="grid size-10 place-items-center rounded-lg bg-steel-100 text-steel-700 group-hover:bg-brand-600 group-hover:text-white transition-colors">
              <Truck className="size-5" />
            </div>
            <ArrowRight className="size-4 text-steel-400 group-hover:text-brand-600 transition-transform group-hover:translate-x-1" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-steel-900">Manage Inventory</h3>
          <p className="mt-1 text-xs text-steel-500">Edit prices, statuses, verification badges, or delete listings.</p>
        </Link>

        <Link
          href="/admin/users"
          className="group rounded-xl border border-steel-200 bg-white p-5 transition-all hover:border-brand-500 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="grid size-10 place-items-center rounded-lg bg-steel-100 text-steel-700 group-hover:bg-brand-600 group-hover:text-white transition-colors">
              <Users className="size-5" />
            </div>
            <ArrowRight className="size-4 text-steel-400 group-hover:text-brand-600 transition-transform group-hover:translate-x-1" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-steel-900">Users & Dealers</h3>
          <p className="mt-1 text-xs text-steel-500">Manage user accounts, roles, and verified seller badges.</p>
        </Link>
      </div>

      {/* Real-time Inventory Data Table */}
      <div className="rounded-xl border border-steel-200 bg-white p-6 shadow-2xs space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-steel-900">
              Live Database Listings ({recentVehicles.total})
            </h3>
            <p className="text-xs text-steel-500">
              Showing active commercial vehicles fetched directly from MongoDB database.
            </p>
          </div>
          <Button asChild variant="subtle" size="sm">
            <Link href="/admin/vehicles">View All {recentVehicles.total} Vehicles &rarr;</Link>
          </Button>
        </div>

        <AdminVehiclesTable initialVehicles={recentVehicles.items} />
      </div>
    </div>
  );
}
