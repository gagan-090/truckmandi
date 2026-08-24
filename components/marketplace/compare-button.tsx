"use client";

import { Check, Scale } from "lucide-react";
import { useState } from "react";
import { useCompare } from "@/features/compare/use-compare";
import { cn } from "@/lib/utils/cn";

export interface CompareButtonProps {
  vehicleId: string;
  vehicleTitle: string;
  variant?: "chip" | "overlay";
  className?: string;
}

export function CompareButton({
  vehicleId,
  vehicleTitle,
  variant = "chip",
  className,
}: CompareButtonProps) {
  const { isSelected, toggle, hydrated, max } = useCompare();
  const [rejected, setRejected] = useState(false);
  const selected = hydrated && isSelected(vehicleId);

  function onClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const result = toggle(vehicleId);
    if (result.rejected) {
      setRejected(true);
      setTimeout(() => setRejected(false), 2600);
    }
  }

  if (variant === "overlay") {
    return (
      <div className="relative inline-flex">
        <button
          type="button"
          onClick={onClick}
          aria-pressed={selected}
          aria-label={
            selected
              ? `Remove ${vehicleTitle} from comparison`
              : `Add ${vehicleTitle} to comparison`
          }
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-full transition-all duration-150 cursor-pointer",
            selected
              ? "bg-brand-600 text-white ring-2 ring-brand-600/30 shadow-md"
              : "bg-white/95 text-steel-700 shadow-sm backdrop-blur-sm hover:bg-white active:scale-95",
            className,
          )}
        >
          {selected ? (
            <Check className="size-[18px] text-white stroke-[2.5]" />
          ) : (
            <Scale className="size-[18px] text-steel-600" />
          )}
        </button>

        {rejected && (
          <span
            role="status"
            className="absolute right-full top-1/2 z-30 mr-2 -translate-y-1/2 w-max rounded-md bg-steel-900 px-2.5 py-1.5 text-[11px] font-medium text-white shadow-md"
          >
            Max {max} vehicles allowed
          </span>
        )}
      </div>
    );
  }

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={onClick}
        aria-pressed={selected}
        className={cn(
          "inline-flex min-h-9 items-center gap-1.5 rounded-md border px-2.5 text-xs font-semibold transition-colors cursor-pointer",
          selected
            ? "border-brand-600 bg-brand-600 text-white"
            : "border-steel-300 bg-white text-steel-700 hover:border-steel-400 hover:bg-steel-50",
          className,
        )}
      >
        {selected ? (
          <Check className="size-3.5" />
        ) : (
          <Scale className="size-3.5" />
        )}
        {selected ? "Added" : "Compare"}
      </button>

      {rejected && (
        <span
          role="status"
          className="absolute bottom-full left-1/2 z-30 mb-2 w-max -translate-x-1/2 rounded-md bg-steel-900 px-2.5 py-1.5 text-[11px] font-medium text-white shadow-md"
        >
          Compare up to {max} vehicles
        </span>
      )}
    </span>
  );
}
