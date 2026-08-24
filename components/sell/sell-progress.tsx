"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import { sellSteps, stepIndexFor } from "@/features/sell/steps";
import { cn } from "@/lib/utils/cn";

/**
 * Wizard progress. Completed steps stay clickable so a seller can go back
 * and correct something; steps ahead are not links, because their data
 * depends on what has not been filled in yet.
 */
export function SellProgress() {
  const pathname = usePathname();
  const currentIndex = stepIndexFor(pathname);
  const percent = (currentIndex / (sellSteps.length - 1)) * 100;

  return (
    <div>
      {/* Mobile: a bar plus the current step name. */}
      <div className="lg:hidden">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-bold text-steel-900">
            {sellSteps[currentIndex].label}
          </p>
          <p className="tabular text-xs text-steel-500">
            Step {currentIndex + 1} of {sellSteps.length}
          </p>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-steel-200">
          <div
            className="h-full rounded-full bg-brand-600 transition-[width] duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{ width: `${Math.max(percent, 6)}%` }}
          />
        </div>
      </div>

      {/* Desktop: full step list. */}
      <ol className="hidden items-center gap-1 lg:flex">
        {sellSteps.map((step, index) => {
          const done = index < currentIndex;
          const current = index === currentIndex;

          const content = (
            <span
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                current && "bg-steel-900 text-white",
                done && "text-steel-700 hover:bg-steel-100",
                !current && !done && "text-steel-400",
              )}
            >
              <span
                className={cn(
                  "tabular grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold",
                  current && "bg-white text-steel-900",
                  done && "bg-trust-600 text-white",
                  !current && !done && "bg-steel-100 text-steel-500",
                )}
              >
                {done ? (
                  <Check className="size-3.5" strokeWidth={3} />
                ) : (
                  index + 1
                )}
              </span>
              {step.shortLabel}
            </span>
          );

          return (
            <li key={step.id} className="flex items-center">
              {done ? (
                <Link href={step.href} aria-label={`Back to ${step.label}`}>
                  {content}
                </Link>
              ) : (
                <span aria-current={current ? "step" : undefined}>
                  {content}
                </span>
              )}
              {index < sellSteps.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    "mx-0.5 h-px w-4 xl:w-6",
                    index < currentIndex ? "bg-trust-500" : "bg-steel-200",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
