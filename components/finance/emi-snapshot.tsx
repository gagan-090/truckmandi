import Link from "next/link";
import { Calculator } from "lucide-react";
import { FINANCE_DEFAULTS } from "@/config/constants";
import { defaultEmiFor } from "@/features/finance/emi";
import { formatCurrency } from "@/lib/utils/format-currency";

/**
 * Static EMI estimate on a listing. Server rendered — the interactive
 * calculator lives on /finance and is not worth the JavaScript here.
 */
export function EmiSnapshot({ price }: { price: number }) {
  const { monthlyEmi } = defaultEmiFor(price);

  if (monthlyEmi <= 0) return null;

  return (
    <div className="rounded-lg border border-steel-200 bg-steel-50 p-4">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-white text-brand-600 shadow-xs">
          <Calculator aria-hidden className="size-4" />
        </span>

        <div className="min-w-0">
          <p className="text-sm text-steel-600">EMI starts at</p>
          <p className="tabular font-display text-xl font-extrabold text-steel-900">
            {formatCurrency(monthlyEmi)}
            <span className="ml-1 text-sm font-semibold text-steel-500">
              /month
            </span>
          </p>
          <p className="mt-1 text-xs text-steel-500">
            {FINANCE_DEFAULTS.downPaymentPercent}% down ·{" "}
            {FINANCE_DEFAULTS.tenureMonths / 12} years ·{" "}
            {FINANCE_DEFAULTS.interestRate}% p.a.
          </p>
          <Link
            href={`/finance?price=${price}`}
            className="mt-2.5 inline-block text-sm font-semibold text-brand-700 transition-colors hover:text-brand-800"
          >
            Customise your EMI →
          </Link>
        </div>
      </div>
    </div>
  );
}
