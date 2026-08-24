"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import { accountNav, primaryNav } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // A tap on a link should navigate and dismiss, not leave the panel open.
  // Adjusted during render so the sheet closes in the same commit as the
  // navigation rather than one frame later.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="lg:hidden"
      >
        <Menu className="size-5" />
      </Button>

      <SheetContent side="right" className="lg:hidden">
        <SheetHeader>
          <SheetTitle className="font-display text-lg font-extrabold text-steel-900">
            Menu
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="px-0">
          <nav aria-label="Mobile primary" className="px-2">
            {primaryNav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              if (item.label === "Buy Trucks") {
                return (
                  <div key={item.href} className="space-y-1">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-12 items-center rounded-md px-3 text-base font-semibold transition-colors",
                        active
                          ? "bg-brand-50 text-brand-700"
                          : "text-steel-800 hover:bg-steel-100",
                      )}
                    >
                      {item.label}
                    </Link>
                    <div className="ml-4 space-y-1 border-l-2 border-brand-100 pl-3">
                      <Link
                        href="/vehicles?condition=used"
                        className="flex min-h-9 items-center text-sm font-medium text-steel-700 hover:text-brand-600"
                      >
                        • Used Trucks
                      </Link>
                      <Link
                        href="/vehicles?condition=new"
                        className="flex min-h-9 items-center text-sm font-medium text-steel-700 hover:text-brand-600"
                      >
                        • New Trucks
                      </Link>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 items-center rounded-md px-3 text-base font-semibold transition-colors",
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-steel-800 hover:bg-steel-100",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 border-t border-steel-200 px-2 pt-4">
            <p className="px-3 pb-1 text-xs font-bold tracking-[0.12em] text-steel-500 uppercase">
              Your account
            </p>
            {accountNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-steel-700 transition-colors hover:bg-steel-100"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </SheetBody>

        <SheetFooter className="space-y-3">
          <Button asChild variant="accent" size="lg" block>
            <Link href="/sell">Sell your truck</Link>
          </Button>
          <a
            href={siteConfig.contact.phoneHref}
            className="flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-steel-700"
          >
            <Phone className="size-4" />
            {siteConfig.contact.phone}
          </a>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
