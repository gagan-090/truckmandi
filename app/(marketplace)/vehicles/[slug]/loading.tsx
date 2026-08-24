import { PageContainer } from "@/components/layout/page-container";

export default function VehicleDetailSkeleton() {
  return (
    <div>
      <PageContainer className="py-4 lg:py-6">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2">
          <div aria-hidden className="h-4 w-14 animate-pulse rounded-md bg-steel-200" />
          <div aria-hidden className="h-3 w-3 animate-pulse rounded-md bg-steel-200" />
          <div aria-hidden className="h-4 w-20 animate-pulse rounded-md bg-steel-200" />
          <div aria-hidden className="h-3 w-3 animate-pulse rounded-md bg-steel-200" />
          <div aria-hidden className="h-4 w-32 animate-pulse rounded-md bg-steel-200" />
        </div>
      </PageContainer>

      <PageContainer className="pb-10 lg:pb-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_24rem]">
          {/* Main Left Content */}
          <div className="min-w-0">
            {/* Gallery Skeleton */}
            <div className="aspect-[16/10] w-full animate-pulse rounded-xl bg-steel-200 shadow-xs" />

            {/* Thumbnail Row */}
            <div className="mt-3 flex gap-2 overflow-hidden">
              <div aria-hidden className="aspect-[4/3] h-16 animate-pulse rounded-lg bg-steel-200" />
              <div aria-hidden className="aspect-[4/3] h-16 animate-pulse rounded-lg bg-steel-200" />
              <div aria-hidden className="aspect-[4/3] h-16 animate-pulse rounded-lg bg-steel-200" />
              <div aria-hidden className="aspect-[4/3] h-16 animate-pulse rounded-lg bg-steel-200" />
            </div>

            {/* Header Skeleton */}
            <div className="mt-6 space-y-3">
              <div className="flex gap-2">
                <div aria-hidden className="h-6 w-20 animate-pulse rounded-md bg-steel-200" />
                <div aria-hidden className="h-6 w-24 animate-pulse rounded-md bg-steel-200" />
              </div>
              <div aria-hidden className="h-8 w-3/4 animate-pulse rounded-md bg-steel-200" />
              <div aria-hidden className="h-4 w-1/2 animate-pulse rounded-md bg-steel-200" />
            </div>

            {/* Summary Stats Grid Skeleton */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div aria-hidden className="h-20 animate-pulse rounded-lg bg-steel-100" />
              <div aria-hidden className="h-20 animate-pulse rounded-lg bg-steel-100" />
              <div aria-hidden className="h-20 animate-pulse rounded-lg bg-steel-100" />
              <div aria-hidden className="h-20 animate-pulse rounded-lg bg-steel-100" />
            </div>

            {/* Specs & Highlights Skeleton */}
            <div className="mt-10 space-y-6">
              <div aria-hidden className="h-40 animate-pulse rounded-xl bg-steel-100" />
              <div aria-hidden className="h-48 animate-pulse rounded-xl bg-steel-100" />
            </div>
          </div>

          {/* Right Sticky Sidebar Skeleton */}
          <aside className="hidden lg:block">
            <div className="space-y-4">
              <div className="rounded-xl border border-steel-200 bg-white p-5 shadow-xs">
                <div aria-hidden className="h-9 w-1/2 animate-pulse rounded-md bg-steel-200" />
                <div aria-hidden className="mt-2 h-4 w-1/3 animate-pulse rounded-md bg-steel-150" />
                <div className="mt-5 space-y-2.5">
                  <div aria-hidden className="h-11 w-full animate-pulse rounded-md bg-steel-200" />
                  <div aria-hidden className="h-11 w-full animate-pulse rounded-md bg-steel-200" />
                </div>
              </div>

              {/* EMI Box Skeleton */}
              <div aria-hidden className="h-32 animate-pulse rounded-xl bg-steel-100" />

              {/* Seller Card Skeleton */}
              <div aria-hidden className="h-44 animate-pulse rounded-xl bg-steel-100" />
            </div>
          </aside>
        </div>
      </PageContainer>
    </div>
  );
}
