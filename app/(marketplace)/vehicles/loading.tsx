import { PageContainer } from "@/components/layout/page-container";
import { VehicleGridSkeleton } from "@/components/marketplace/vehicle-grid";
import { Skeleton } from "@/components/ui/skeleton";

export default function VehiclesLoading() {
  return (
    <PageContainer width="wide" className="py-6 lg:py-8">
      <Skeleton className="h-3 w-40" />

      <div className="mt-4 mb-6 space-y-2.5 lg:mb-8">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>

      <div className="flex items-start gap-6 xl:gap-8">
        <div className="hidden w-72 shrink-0 lg:block xl:w-80">
          <div className="space-y-4 rounded-lg border border-steel-200 bg-white p-4">
            <Skeleton className="h-5 w-20" />
            {Array.from({ length: 5 }, (_, group) => (
              <div
                key={group}
                className="space-y-2.5 border-t border-steel-100 pt-4"
              >
                <Skeleton className="h-4 w-24" />
                {Array.from({ length: 4 }, (_, row) => (
                  <Skeleton key={row} className="h-4 w-full" />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-5 flex items-center justify-between gap-3">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-10 w-52" />
          </div>
          <VehicleGridSkeleton count={9} />
        </div>
      </div>
    </PageContainer>
  );
}
