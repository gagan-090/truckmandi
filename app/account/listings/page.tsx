import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInPrompt } from "@/components/account/sign-in-prompt";
import { getCurrentUser } from "@/lib/auth/auth";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "My Listings",
  description: "Manage the vehicles you are selling on TruckMitr Exchange.",
  path: "/account/listings",
  noIndex: true,
});

export default async function ListingsPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-steel-900">
            My listings
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm text-pretty text-steel-600">
            Track views, enquiries and offers on the vehicles you are selling.
          </p>
        </div>
        <Button asChild variant="accent">
          <Link href="/sell/vehicle">List a vehicle</Link>
        </Button>
      </div>

      {user ? null : (
        <SignInPrompt description="Sign in to see the vehicles you have listed, how many people viewed them, and any offers waiting for a reply." />
      )}
    </div>
  );
}
