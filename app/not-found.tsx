import Link from "next/link";
import { Compass, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { vehicleCategories } from "@/data/vehicle-categories";

export default function NotFound() {
  return (
    <PageContainer width="narrow" className="py-20 lg:py-28">
      <div className="text-center">
        <p className="tabular font-display text-6xl font-extrabold text-steel-200">
          404
        </p>
        <h1 className="mt-4 font-display text-2xl font-extrabold text-balance text-steel-900 sm:text-3xl">
          We could not find that page
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-steel-600">
          The listing may have been sold and removed, or the link might be
          incomplete. Try searching for what you need instead.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/vehicles">
              <Search />
              Browse all vehicles
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/">
              <Compass />
              Go to homepage
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-14 border-t border-steel-200 pt-8">
        <h2 className="text-center text-sm font-bold text-steel-900">
          Popular categories
        </h2>
        <ul className="mt-4 flex flex-wrap justify-center gap-2">
          {vehicleCategories.slice(0, 8).map((category) => (
            <li key={category.slug}>
              <Link
                href={`/vehicles/category/${category.slug}`}
                className="inline-flex min-h-9 items-center rounded-full border border-steel-200 bg-white px-3.5 text-sm font-medium text-steel-700 transition-colors hover:border-steel-300 hover:bg-steel-50 hover:text-steel-900"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </PageContainer>
  );
}
