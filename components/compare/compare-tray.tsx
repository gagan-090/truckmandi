"use client";

import Link from "next/link";
import Image from "next/image";
import { Scale, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/features/compare/use-compare";
import { MAX_COMPARE_VEHICLES } from "@/config/constants";
import { cn } from "@/lib/utils/cn";

export interface CompareTrayItem {
  id: string;
  title: string;
  imageUrl?: string;
}

/**
 * Floating sticky tray that appears at the bottom of the screen once vehicles are selected for comparison.
 */
export function CompareTray({
  index,
}: {
  index: Record<string, CompareTrayItem>;
}) {
  const { ids, remove, clear, hydrated } = useCompare();
  const pathname = usePathname();

  // Hide tray on compare page itself or when no vehicles are selected
  if (!hydrated || ids.length === 0 || pathname === "/compare") return null;

  const items = ids.map((id) => {
    if (index && index[id]) return index[id];
    return {
      id,
      title: "Commercial Vehicle",
      imageUrl: "/images/clean/ashok_leyland_heavy_truck_1787394600402.png",
    };
  });

  return (
    <div
      role="region"
      aria-label="Vehicle comparison tray"
      className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-brand-600 bg-white/98 shadow-[0_-4px_24px_-4px_rgb(0_0_0/0.2)] backdrop-blur-md transition-all duration-300"
    >
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-2.5 sm:px-6 lg:gap-5 lg:px-8 lg:py-3">
        <div className="flex shrink-0 items-center gap-2 text-sm font-extrabold text-steel-900">
          <Scale aria-hidden className="size-5 text-brand-600" />
          <span>Comparing</span>
          <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-700">
            {items.length}/{MAX_COMPARE_VEHICLES}
          </span>
        </div>

        <ul className="scroll-rail flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
          {items.map((item, idx) => (
            <li key={item.id || idx} className="relative shrink-0">
              <div
                className={cn(
                  "flex items-center gap-2 rounded-lg border border-steel-200 bg-steel-50 py-1.5 pr-8 pl-1.5 shadow-2xs transition-all hover:border-steel-300",
                  "lg:gap-2.5",
                )}
              >
                <span className="relative size-9 shrink-0 overflow-hidden rounded-md bg-steel-200 lg:size-10">
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  )}
                </span>
                <span className="max-w-36 truncate text-xs font-bold text-steel-900 sm:max-w-44">
                  {item.title}
                </span>
              </div>

              <button
                type="button"
                onClick={() => remove(item.id)}
                aria-label={`Remove ${item.title} from comparison`}
                className="absolute top-1 right-1 grid size-5 place-items-center rounded-full bg-steel-200 text-steel-700 transition-all hover:bg-red-600 hover:text-white cursor-pointer"
              >
                <X className="size-3" />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="subtle"
            size="sm"
            onClick={clear}
            className="hidden sm:inline-flex text-steel-600 hover:text-steel-900"
          >
            Clear All
          </Button>

          <Button
            asChild
            size="sm"
            variant="accent"
            className="shadow-sm"
          >
            <Link href={`/compare?ids=${ids.join(",")}`}>
              Compare Now
              <span className="tabular font-bold ml-1">({items.length})</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
