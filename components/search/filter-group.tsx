"use client";

import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * One collapsible block in the filter panel. Uses a real button and
 * `aria-expanded` rather than a details element so the open state can be
 * driven by whether the group has an active selection.
 */
export function FilterGroup({
  title,
  count,
  defaultOpen = true,
  children,
}: {
  title: string;
  /** Number of active selections, shown as a badge. */
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen || Boolean(count));
  const id = `filter-${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="border-b border-steel-200 py-4 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-bold text-steel-900">
          {title}
          {count ? (
            <span className="tabular grid min-w-5 place-items-center rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {count}
            </span>
          ) : null}
        </span>
        <ChevronDown
          aria-hidden
          className={cn(
            "size-4 shrink-0 text-steel-400 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div id={id} className="mt-3.5">
          {children}
        </div>
      )}
    </div>
  );
}

export function FacetCheckbox({
  label,
  count,
  checked,
  onToggle,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label
      className={cn(
        "flex min-h-9 cursor-pointer items-center gap-2.5 rounded-md px-1.5 text-sm transition-colors",
        "hover:bg-steel-50",
        checked ? "font-semibold text-steel-900" : "text-steel-700",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="size-4 shrink-0 rounded-xs border-steel-400 text-brand-600 accent-brand-600"
      />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {count !== undefined && (
        <span className="tabular shrink-0 text-xs text-steel-400">{count}</span>
      )}
    </label>
  );
}
