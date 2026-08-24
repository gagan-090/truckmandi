import { CheckCircle2, Database, Key, Server, Settings, ShieldCheck } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="rounded-xl border border-steel-200 bg-white p-6 shadow-2xs">
        <h2 className="font-display text-xl font-bold text-steel-900">
          System & Database Configuration
        </h2>
        <p className="mt-1 text-xs text-steel-500">
          Platform connection parameters and database server diagnostics.
        </p>
      </div>

      <div className="rounded-xl border border-steel-200 bg-white p-6 shadow-2xs space-y-5">
        <h3 className="font-display text-base font-bold text-steel-900 border-b border-steel-100 pb-3 flex items-center gap-2">
          <Database className="size-4 text-emerald-600" />
          MongoDB Instance Diagnostics
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 text-xs">
          <div className="rounded-lg bg-steel-50 p-3.5 border border-steel-200">
            <span className="text-steel-500 font-medium">Host Address</span>
            <p className="mt-1 font-mono font-bold text-steel-900">127.0.0.1:27017</p>
          </div>

          <div className="rounded-lg bg-steel-50 p-3.5 border border-steel-200">
            <span className="text-steel-500 font-medium">Database Name</span>
            <p className="mt-1 font-mono font-bold text-steel-900">cavalo</p>
          </div>

          <div className="rounded-lg bg-steel-50 p-3.5 border border-steel-200">
            <span className="text-steel-500 font-medium">Laravel API Gateway</span>
            <p className="mt-1 font-mono font-bold text-steel-900">http://127.0.0.1:8000/api</p>
          </div>

          <div className="rounded-lg bg-emerald-50 p-3.5 border border-emerald-200">
            <span className="text-emerald-700 font-medium">Connection Status</span>
            <p className="mt-1 font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-600" />
              Connected & Operational
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
