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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <div key={i} className="rounded-md border border-border bg-card" aria-hidden="true">
            <Skeleton className="w-full aspect-video rounded-t-md rounded-b-none" />
            <div className="px-3 pb-3 pt-2">
              <div className="pl-24 space-y-1.5 min-h-[3.5rem]">
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-2.5 w-2/5 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
