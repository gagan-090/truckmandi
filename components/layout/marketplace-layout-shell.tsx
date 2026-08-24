"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { CompareTray, type CompareTrayItem } from "@/components/compare/compare-tray";

export function MarketplaceLayoutShell({
  children,
  compareIndex,
}: {
  children: React.ReactNode;
  compareIndex: Record<string, CompareTrayItem>;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <main id="main" className="flex-1">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main id="main" className="flex-1 pb-14 lg:pb-0">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
      <CompareTray index={compareIndex} />
    </>
  );
}
