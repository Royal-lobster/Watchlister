import { Skeleton } from "@/components/ui/skeleton";

export default function ContentLoading() {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden" aria-busy="true" aria-label="Loading content details">
      {/* Hero shimmer */}
      <div className="relative w-full h-[72vh] min-h-[480px] max-h-[640px] overflow-hidden" aria-hidden="true">
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/75 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-20 -mt-96">
        <div className="flex gap-10 items-start flex-col sm:flex-row">
          {/* Poster */}
          <div className="shrink-0 w-56" aria-hidden="true">
            <Skeleton className="w-full aspect-[2/3] rounded-xl shadow-2xl" />
          </div>

          {/* Meta */}
          <div className="flex-1 min-w-0 pt-8 flex flex-col gap-0" aria-hidden="true">
            <Skeleton className="h-3 w-18 rounded-full mb-3" />
            <Skeleton className="h-10 w-4/5 rounded-lg mb-2" />
            <Skeleton className="h-8 w-3/5 rounded-lg mb-4" />
            <div className="flex items-center gap-3 mb-5">
              <Skeleton className="h-3.5 w-12 rounded-full" />
              <div className="w-px h-3.5 bg-border" />
              <Skeleton className="h-3.5 w-24 rounded-full" />
            </div>
            <div className="flex gap-2 flex-wrap mb-5">
              {[88, 72, 112, 80].map((w, i) => (
                <Skeleton key={i} className="h-5 rounded-full" style={{ width: w }} />
              ))}
            </div>
            <Skeleton className="h-4 w-2/3 rounded mb-6" />
            <div className="flex flex-col gap-2 mb-8">
              {[100, 96, 100, 88, 72].map((pct, i) => (
                <Skeleton key={i} className="h-3.5 rounded-full" style={{ width: `${pct}%` }} />
              ))}
            </div>
            <Skeleton className="h-12 w-42 rounded-full" />
          </div>
        </div>

        {/* Providers */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col gap-4" aria-hidden="true">
          <Skeleton className="h-3 w-28 rounded-full" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="size-10 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
