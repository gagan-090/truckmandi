"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SearchBar } from "@/components/search/search-bar";

/**
 * Below `lg` the header has no room for an inline field, so search opens
 * as a top sheet with the keyboard focused.
 */
export function NavbarSearchTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Search vehicles"
        onClick={() => setOpen(true)}
        className="lg:hidden"
      >
        <Search className="size-5" />
      </Button>

      <SheetContent side="top" className="lg:hidden">
        <SheetHeader>
          <SheetTitle className="font-display text-base font-bold text-steel-900">
            Search vehicles
          </SheetTitle>
        </SheetHeader>
        <SheetBody>
          <SearchBar autoFocus onSubmitted={() => setOpen(false)} />
          <p className="mt-3 text-xs text-steel-500">
            Try &ldquo;Tata 407&rdquo;, &ldquo;tipper&rdquo; or &ldquo;pickup
            Mumbai&rdquo;.
          </p>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
