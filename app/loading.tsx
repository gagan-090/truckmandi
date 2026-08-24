import { PageContainer } from "@/components/layout/page-container";
import { Skeleton } from "@/components/ui/skeleton";

/** Route-level fallback for pages without their own `loading.tsx`. */
export default function Loading() {
  return (
    <PageContainer className="py-10 lg:py-14">
      <span className="sr-only" role="status">
        Loading
      </span>

      <Skeleton className="h-3 w-40" />
      <Skeleton className="mt-5 h-9 w-80 max-w-full" />
      <Skeleton className="mt-3 h-4 w-full max-w-2xl" />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-64 rounded-lg" />
        ))}
      </div>
    </PageContainer>
  );
}
