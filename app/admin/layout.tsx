import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Admin Dashboard",
  description: "TruckMitr Exchange Executive Management Console",
  path: "/admin",
  noIndex: true,
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-steel-50 text-steel-900">
      <AdminSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header Bar */}
        <header className="h-16 border-b border-steel-200 bg-white px-6 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-lg font-bold text-steel-900">
              Admin Control Panel
            </h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
              System Active
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-steel-600">
            <span className="hidden sm:inline">Database: <strong className="text-steel-900">MongoDB cavalo</strong></span>
            <div className="flex items-center gap-2 rounded-full bg-steel-100 px-3 py-1 text-steel-800 font-semibold">
              <span className="size-2 rounded-full bg-brand-600" />
              Super Admin Mode
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
