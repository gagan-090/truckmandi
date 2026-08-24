"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CirclePlus, Heart, Home, Search, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { mobileNav } from "@/config/navigation";
import { useFavorites } from "@/features/favorites/use-favorites";
import { cn } from "@/lib/utils/cn";

const icons: Record<string, LucideIcon> = {
  Home,
  Search,
  CirclePlus,
  Heart,
  User,
};

/**
 * Thumb-reachable bottom bar, mobile only. `app/layout.tsx` reserves the
 * matching bottom padding so it never covers page content, and sticky page
 * bars sit above it rather than under it.
 */
export function MobileBottomNav() {
  const pathname = usePathname();
  const { count, hydrated } = useFavorites();

  return (
    <nav
      aria-label="Primary mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-steel-200 bg-white/97 backdrop-blur-sm lg:hidden"
    >
      <ul className="mx-auto flex max-w-lg items-stretch pb-[env(safe-area-inset-bottom)]">
        {mobileNav.map((item) => {
          const Icon = icons[item.icon] ?? Home;
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const isSell = item.href === "/sell";
          const badge = item.href === "/account/saved" && hydrated && count > 0;

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex min-h-14 flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] font-semibold transition-colors",
                  active
                    ? isSell
                      ? "text-brand-700"
                      : "text-steel-900"
                    : "text-steel-500",
                )}
              >
                <span className="relative">
                  <Icon
                    className={cn("size-5", isSell && "size-6 text-brand-600")}
                    strokeWidth={active ? 2.4 : 2}
                  />
                  {badge && (
                    <span className="tabular absolute -top-1 -right-2 grid min-w-4 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </span>
                {item.label}
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-x-5 top-0 h-0.5 rounded-full bg-brand-600"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
