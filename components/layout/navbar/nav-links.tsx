"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Sparkles, Truck } from "lucide-react";
import { primaryNav } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

export function NavLinks() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
      {primaryNav.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        if (item.label === "Buy Trucks") {
          return (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                  active
                    ? "text-steel-900"
                    : "text-steel-600 hover:bg-steel-100 hover:text-steel-900",
                )}
              >
                {item.label}
                <ChevronDown
                  className={cn(
                    "size-3.5 text-steel-400 transition-transform duration-200",
                    dropdownOpen && "rotate-180 text-brand-600",
                  )}
                />
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-600"
                  />
                )}
              </Link>

              {/* Buy Trucks Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute top-full left-0 z-50 mt-1 w-64 rounded-xl border border-steel-200 bg-white p-2 shadow-lg ring-1 ring-black/5 backdrop-blur-md">
                  <Link
                    href="/vehicles?condition=used"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-steel-50"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                      <Truck className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-steel-900">Used Trucks</p>
                      <p className="text-xs text-steel-500">Verified pre-owned commercial trucks</p>
                    </div>
                  </Link>

                  <Link
                    href="/vehicles?condition=new"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-steel-50"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                      <Sparkles className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-steel-900">New Trucks</p>
                      <p className="text-xs text-steel-500">Brand new commercial models & series</p>
                    </div>
                  </Link>

                  <div className="my-1 border-t border-steel-100" />

                  <Link
                    href="/vehicles"
                    onClick={() => setDropdownOpen(false)}
                    className="block rounded-lg px-3 py-2 text-center text-xs font-semibold text-brand-700 hover:bg-brand-50"
                  >
                    Browse All Commercial Trucks &rarr;
                  </Link>
                </div>
              )}
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative rounded-md px-3 py-2 text-sm font-semibold transition-colors",
              active
                ? "text-steel-900"
                : "text-steel-600 hover:bg-steel-100 hover:text-steel-900",
            )}
          >
            {item.label}
            {active && (
              <span
                aria-hidden
                className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-600"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
