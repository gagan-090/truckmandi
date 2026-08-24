"use client";

import Link from "next/link";
import { User as UserIcon } from "lucide-react";
import { useSession } from "@/features/auth/session-context";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Account pill in the header.
 *
 * Reads the session from context rather than parsing `document.cookie`:
 * the session cookie is httpOnly, and the mirrored user cookie is encoded
 * twice by `NextResponse.cookies.set()`, so browser-side parsing silently
 * failed and everyone looked signed out.
 */
export function NavbarUserAccount() {
  const { user, status } = useSession();

  if (status === "loading") {
    // Same footprint as the resolved states, so the header does not jump.
    return <Skeleton className="h-8 w-24 rounded-full" />;
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="flex items-center gap-1.5 rounded-lg border border-steel-200 bg-white px-3 py-1.5 text-xs font-semibold text-steel-700 transition-all hover:border-steel-300 hover:bg-steel-50"
      >
        <UserIcon className="size-4 text-steel-600" />
        <span>Sign In</span>
      </Link>
    );
  }

  const firstName = user.name.trim().split(/\s+/)[0] || "Member";

  return (
    <Link
      href="/account"
      title={`Signed in as ${user.name}`}
      aria-label={`Your account, signed in as ${user.name}`}
      className="flex items-center gap-2 rounded-full border border-steel-200 bg-steel-50 px-3 py-1 text-xs font-bold text-steel-900 transition-all hover:border-steel-300 hover:bg-steel-100 hover:shadow-xs"
    >
      <span
        aria-hidden
        className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-600 text-[11px] font-bold text-white"
      >
        {firstName.charAt(0).toUpperCase()}
      </span>
      <span className="max-w-[120px] truncate font-display text-xs font-bold text-steel-900">
        {user.name}
      </span>
    </Link>
  );
}
