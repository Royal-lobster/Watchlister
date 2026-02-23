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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="rounded-md overflow-hidden border border-border bg-card">
            <Skeleton className="w-full aspect-[2/3]" />
            <div className="p-2.5 space-y-1.5">
              <Skeleton className="h-2.5 w-full rounded" />
              <Skeleton className="h-2.5 w-3/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
