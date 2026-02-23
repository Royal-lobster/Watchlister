import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <div className="container mx-auto px-4 py-8" aria-label="Loading search results" aria-busy="true">
      <div className="max-w-2xl mx-auto mb-8">
        <Skeleton className="h-11 w-full rounded-md" />
      </div>
      <div className="flex items-baseline gap-3 mb-6">
        <Skeleton className="h-3.5 w-36" />
        <Skeleton className="h-3 w-14" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="rounded-md border border-border bg-card">
            <Skeleton className="w-full aspect-video rounded-t-md rounded-b-none" />
            <div className="px-3 pb-3 pt-2">
              <div className="pl-24 space-y-1.5 min-h-[3.5rem]">
                <Skeleton className="h-2.5 w-full rounded" />
                <Skeleton className="h-2.5 w-3/5 rounded" />
                <Skeleton className="h-2 w-full rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
