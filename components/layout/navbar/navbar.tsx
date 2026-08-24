"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search/search-bar";
import { useScrolledPast } from "@/hooks/use-scroll-position";
import { cn } from "@/lib/utils/cn";
import { Logo } from "../logo";
import { MobileMenu } from "./mobile-menu";
import { NavLinks } from "./nav-links";
import { NavbarSearchTrigger } from "./navbar-search";
import { NavbarUserAccount } from "./navbar-user-account";
import { SavedLink } from "./saved-link";

/**
 * Sticky header with active logged-in user profile pill.
 */
export function Navbar() {
  const scrolled = useScrolledPast(4);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-white/95 backdrop-blur-sm transition-shadow duration-200",
        scrolled ? "border-steel-200 shadow-sm" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center gap-3 px-4 sm:px-6 lg:h-[4.5rem] lg:gap-6 lg:px-8">
        <Logo />

        <NavLinks />

        <div className="ml-auto hidden min-w-0 flex-1 justify-end xl:flex">
          <SearchBar className="max-w-xs" placeholder="Search trucks" />
        </div>

        <div className="ml-auto flex items-center gap-2 xl:ml-0">
          <NavbarSearchTrigger />
          <SavedLink />

          <NavbarUserAccount />

          <Button
            asChild
            variant="accent"
            size="sm"
            className="ml-1.5 hidden lg:inline-flex"
          >
            <Link href="/sell">Sell your truck</Link>
          </Button>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
