import { Skeleton } from "@/components/ui";

const SKELETON_COUNT = 10;

function SkeletonCard({ index }: { index: number }) {
  const delayMs = index * 55;

  return (
    <>
      <style>{`
        @keyframes srch-skl-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.38; }
        }
        .srch-skl-card {
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          background-color: var(--color-surface);
          overflow: hidden;
          animation: srch-skl-pulse 1.9s ease-in-out infinite;
        }
        .srch-skl-poster {
          width: 100%;
          aspect-ratio: 2 / 3;
          background-color: var(--color-surface-raised);
          position: relative;
          overflow: hidden;
        }
        /* Shimmer sweep across poster */
        .srch-skl-poster::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 30%,
            color-mix(in srgb, var(--color-surface-hover) 60%, transparent) 50%,
            transparent 70%
          );
          animation: srch-skl-sweep 2s ease-in-out infinite;
          animation-delay: inherit;
        }
        @keyframes srch-skl-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .srch-skl-body {
          padding: 0.6rem 0.7rem 0.75rem;
        }
        .srch-skl-line {
          height: 0.6875rem;
          border-radius: 0.25rem;
          background-color: var(--color-surface-raised);
          margin-bottom: 0.3rem;
        }
        .srch-skl-line--short {
          width: 55%;
          margin-bottom: 0.45rem;
        }
        .srch-skl-year {
          height: 0.55rem;
          width: 2.5rem;
          border-radius: 0.25rem;
          background-color: var(--color-surface-raised);
          margin-bottom: 0.45rem;
        }
        .srch-skl-overview-line {
          height: 0.55rem;
          border-radius: 0.25rem;
          background-color: var(--color-surface-raised);
          margin-bottom: 0.25rem;
        }
      `}</style>
      <div
        className="srch-skl-card"
        aria-hidden="true"
        style={{ animationDelay: `${delayMs}ms` }}
      >
        {/* Poster placeholder with shimmer */}
        <div className="srch-skl-poster" style={{ animationDelay: `${delayMs}ms` }} />

        {/* Body placeholder */}
        <div className="srch-skl-body">
          {/* Title lines */}
          <div className="srch-skl-line" style={{ width: "90%" }} />
          <div className="srch-skl-line srch-skl-line--short" />

          {/* Year */}
          <div className="srch-skl-year" />

          {/* Overview — 2 lines */}
          <div className="srch-skl-overview-line" style={{ width: "100%" }} />
          <div className="srch-skl-overview-line" style={{ width: "72%" }} />
        </div>
      </div>
    </>
  );
}

export default function SearchLoading() {
  return (
    <div
      className="container mx-auto px-4 py-8"
      aria-label="Loading search results"
      aria-busy="true"
    >
      {/* Search bar skeleton */}
      <div className="max-w-2xl mx-auto mb-8">
        <Skeleton className="h-11 w-full rounded-(--radius-md)" />
      </div>

      {/* Results header skeleton */}
      <div className="flex items-baseline gap-3 mb-6">
        <Skeleton className="h-3.5 w-36" />
        <Skeleton className="h-3 w-14" />
      </div>

      {/* Grid skeleton — mirrors SearchResults breakpoints exactly */}
      <>
        <style>{`
          .srch-skl-grid {
            display: grid;
            gap: 1rem;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          @media (min-width: 768px) {
            .srch-skl-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          }
          @media (min-width: 1024px) {
            .srch-skl-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          }
          @media (min-width: 1280px) {
            .srch-skl-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
          }
        `}</style>
        <div className="srch-skl-grid">
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <SkeletonCard key={i} index={i} />
          ))}
        </div>
      </>
    </div>
  );
}
