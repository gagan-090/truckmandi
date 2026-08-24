import { formatCurrency, formatPriceShort } from "@/lib/utils/format-currency";
import { cn } from "@/lib/utils/cn";
import { priceDropPercent } from "@/features/vehicles/utils";

export interface VehiclePriceProps {
  price: number;
  previousPrice?: number;
  negotiable?: boolean;
  size?: "sm" | "md" | "lg";
  /** Adds the full rupee figure under the short form. */
  showExact?: boolean;
  className?: string;
}

const sizes = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-3xl sm:text-[2rem]",
} as const;

export function VehiclePrice({
  price,
  previousPrice,
  negotiable,
  size = "md",
  showExact = false,
  className,
}: VehiclePriceProps) {
  const drop = priceDropPercent({ price, previousPrice });

  return (
    <div className={cn("min-w-0", className)}>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span
          className={cn(
            "tabular font-display font-extrabold tracking-tight text-steel-900",
            sizes[size],
          )}
        >
          {formatPriceShort(price)}
        </span>

        {drop !== undefined && (
          <>
            <span className="tabular text-sm text-steel-400 line-through">
              {formatPriceShort(previousPrice ?? 0)}
            </span>
            <span className="rounded-sm bg-trust-50 px-1.5 py-0.5 text-[11px] font-bold text-trust-700">
              {drop}% off
            </span>
          </>
        )}
      </div>

      {(showExact || negotiable) && (
        <p className="mt-1 text-xs text-steel-500">
          {showExact && (
            <span className="tabular">{formatCurrency(price)}</span>
          )}
          {showExact && negotiable && <span aria-hidden> · </span>}
          {negotiable && "Negotiable"}
        </p>
      )}
    </div>
  );
}
