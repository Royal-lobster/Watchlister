import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_COUNT = 10;

export default function DashboardLoading() {
  return (
    <div
      className="container mx-auto px-4 py-8"
      aria-label="Loading watchlist"
      aria-busy="true"
    >
      {/* Header skeleton */}
      <div className="mb-8">
        <Skeleton className="h-8 w-44 mb-2" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <div key={i} aria-hidden="true">
            <Skeleton className="aspect-[2/3] rounded-md" />
            <div className="p-2.5 space-y-1.5">
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-3/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
