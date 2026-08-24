"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { accountNav } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Account" className="lg:w-56 lg:shrink-0">
      <ul className="scroll-rail flex gap-1 overflow-x-auto border-b border-steel-200 lg:flex-col lg:gap-0.5 lg:border-b-0">
        {accountNav.map((item) => {
          const active = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block min-h-11 border-b-2 px-3 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors",
                  "lg:rounded-md lg:border-b-0 lg:px-3.5",
                  active
                    ? "border-brand-600 text-steel-900 lg:bg-steel-900 lg:text-white"
                    : "border-transparent text-steel-600 hover:text-steel-900 lg:hover:bg-steel-100",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
