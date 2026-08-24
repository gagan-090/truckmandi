import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface BreadcrumbItem {
  name: string;
  href: string;
}

/**
 * Pair this with `breadcrumbSchema()` on any page that renders it, so the
 * visible trail and the structured data always match.
 */
export function Breadcrumbs({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      <ol className="scroll-rail flex items-center gap-1.5 overflow-x-auto text-xs whitespace-nowrap text-steel-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight
                  aria-hidden
                  className="size-3.5 shrink-0 text-steel-300"
                />
              )}
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-medium text-steel-700"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-steel-900"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
