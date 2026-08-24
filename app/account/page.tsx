import type { Metadata } from "next";
import Link from "next/link";
import { Heart, MessageSquare, Scale, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/auth";
import { buildMetadata } from "@/lib/seo/metadata";
import { AccountCounters } from "@/components/account/account-counters";

export const metadata: Metadata = buildMetadata({
  title: "Your Account",
  description: "Manage your saved vehicles, enquiries and listings.",
  path: "/account",
  noIndex: true,
});

const shortcuts = [
  {
    href: "/account/saved",
    icon: Heart,
    title: "Saved vehicles",
    body: "Vehicles you have shortlisted, with price-drop alerts.",
  },
  {
    href: "/compare",
    icon: Scale,
    title: "Comparisons",
    body: "Vehicles you are weighing up side by side.",
  },
  {
    href: "/account/inquiries",
    icon: MessageSquare,
    title: "My enquiries",
    body: "Messages, callbacks and offers you have sent to sellers.",
  },
  {
    href: "/account/listings",
    icon: Truck,
    title: "My listings",
    body: "Vehicles you are selling, and how they are performing.",
  },
];

export default async function AccountPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <div className="rounded-lg border border-steel-200 bg-white p-5 sm:p-6">
        <h2 className="font-display text-lg font-bold text-steel-900">
          {user ? `Welcome back, ${user.name}` : "You are browsing as a guest"}
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm text-pretty text-steel-600">
          {user
            ? "Everything you have saved, sent and listed lives here."
            : "Saved vehicles and comparisons are kept in this browser. Sign in to sync them across your devices and to see your enquiries."}
        </p>

        {!user && (
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/auth/register">Create an account</Link>
            </Button>
          </div>
        )}
      </div>

      <AccountCounters />

      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {shortcuts.map((shortcut) => (
          <li key={shortcut.href}>
            <Link
              href={shortcut.href}
              className="group flex h-full gap-3.5 rounded-lg border border-steel-200 bg-white p-4 transition-all duration-200 hover:border-steel-300 hover:shadow-sm"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-steel-100 text-steel-600 transition-colors duration-200 group-hover:bg-brand-600 group-hover:text-white">
                <shortcut.icon aria-hidden className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-base font-bold text-steel-900">
                  {shortcut.title}
                </span>
                <span className="mt-0.5 block text-sm text-pretty text-steel-600">
                  {shortcut.body}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
