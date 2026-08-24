import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, MessageSquare, Search } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Listing Submitted",
  description: "Your vehicle listing has been submitted for review.",
  path: "/sell/success",
  noIndex: true,
});

const next = [
  {
    icon: Clock,
    title: "We review it",
    body: "Our team checks the registration details and the documents you declared. This usually takes a few hours.",
  },
  {
    icon: Search,
    title: "It goes live",
    body: "Your listing appears in search results and on the relevant category, brand and city pages.",
  },
  {
    icon: MessageSquare,
    title: "Buyers get in touch",
    body: "Calls, messages and offers arrive directly. Your number is only shown to buyers who identify themselves.",
  },
];

export default async function SellSuccessPage(
  props: PageProps<"/sell/success">,
) {
  const searchParams = await props.searchParams;
  const raw = Array.isArray(searchParams.ref)
    ? searchParams.ref[0]
    : searchParams.ref;
  // Reference ids come from our own API, but this is still URL input.
  const reference = raw && /^[a-z0-9_]{1,32}$/i.test(raw) ? raw : null;

  return (
    <PageContainer width="narrow" className="py-16 lg:py-24">
      <div className="text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-trust-50 text-trust-600">
          <CheckCircle2 className="size-8" />
        </div>

        <h1 className="mt-6 font-display text-2xl font-extrabold text-balance text-steel-900 sm:text-3xl">
          Your listing has been submitted
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-steel-600">
          Thanks — it is now in review. We will send you an SMS the moment it
          goes live.
        </p>

        {reference && (
          <p className="mt-4 inline-block rounded-md border border-steel-200 bg-steel-50 px-3.5 py-2 text-sm text-steel-600">
            Reference{" "}
            <span className="tabular font-semibold text-steel-900">
              {reference}
            </span>
          </p>
        )}
      </div>

      <ol className="mt-10 space-y-3">
        {next.map((item, index) => (
          <li
            key={item.title}
            className="flex gap-4 rounded-lg border border-steel-200 bg-white p-4 sm:p-5"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-steel-100 text-steel-600">
              <item.icon aria-hidden className="size-5" />
            </span>
            <div className="min-w-0">
              <h2 className="font-display text-base font-bold text-steel-900">
                <span className="tabular mr-1.5 text-steel-400">
                  {index + 1}.
                </span>
                {item.title}
              </h2>
              <p className="mt-1 text-sm text-pretty text-steel-600">
                {item.body}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild size="lg">
          <Link href="/account/listings">View my listings</Link>
        </Button>
        <Button asChild variant="secondary" size="lg">
          <Link href="/sell/vehicle">List another vehicle</Link>
        </Button>
      </div>
    </PageContainer>
  );
}
