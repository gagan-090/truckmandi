"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ChevronRight,
  Database,
  Grid,
  Layers,
  LayoutDashboard,
  MessageSquare,
  PlusCircle,
  Settings,
  ShieldAlert,
  Truck,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Logo } from "@/components/layout/logo";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/vehicles", label: "Trucks", icon: Truck },
  { href: "/admin/vehicles/new", label: "Add Truck", icon: PlusCircle },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/inquiries", label: "Enquiries", icon: MessageSquare },
  { href: "/admin/brands", label: "Brands & Categories", icon: Layers },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-steel-200 bg-steel-900 text-white flex flex-col min-h-screen">
      {/* Header Brand */}
      <div className="p-5 border-b border-steel-800 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2">
          <Logo tone="light" />
        </Link>
        <span className="rounded bg-brand-600 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
          ADMIN
        </span>
      </div>

      {/* Database Connection Status */}
      <div className="mx-4 mt-4 p-3 rounded-lg bg-steel-850 border border-steel-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Database className="size-4 text-emerald-400" />
          <div className="text-xs">
            <p className="font-bold text-white">MongoDB Live</p>
            <p className="text-[10px] text-steel-400">127.0.0.1:27017</p>
          </div>
        </div>
        <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      {/* Nav Menu */}
      <nav className="p-3 flex-1 space-y-1 mt-2">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-steel-400">
          Management
        </p>
        {adminNav.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition-all",
                isActive
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-steel-300 hover:bg-steel-800 hover:text-white",
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("size-4", isActive ? "text-white" : "text-steel-400")} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="size-4 opacity-75" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-steel-800 text-xs text-steel-400">
        <p className="font-bold text-steel-200">TruckMitr Admin v2.4</p>
        <p className="text-[11px] mt-0.5">Connected to Laravel & MongoDB</p>
        <Link href="/" className="mt-3 block text-brand-400 hover:underline text-xs font-semibold">
          &larr; Back to Marketplace
        </Link>
      </div>
    </aside>
  );
}
