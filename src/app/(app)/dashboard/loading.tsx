import { Skeleton } from "@/components/ui";

const SKELETON_COUNT = 10;

function SkeletonCard({ index }: { index: number }) {
  // Stagger each card by 60ms to create a cascading wave across the grid
  const delayMs = index * 60;

  return (
    <>
      <style>{`
        @keyframes skl-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .skl-card {
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          background-color: var(--color-surface);
          overflow: hidden;
          animation: skl-pulse 1.8s ease-in-out infinite;
        }
        .skl-poster {
          width: 100%;
          aspect-ratio: 2 / 3;
          background-color: var(--color-surface-raised);
        }
        .skl-body {
          padding: 0.625rem 0.75rem 0.75rem;
        }
        .skl-title-line {
          height: 0.75rem;
          border-radius: 0.25rem;
          background-color: var(--color-surface-raised);
          margin-bottom: 0.35rem;
        }
        .skl-title-line--short {
          width: 60%;
        }
        .skl-genres {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
          margin-top: 0.5rem;
          min-height: 1.25rem;
        }
        .skl-chip {
          height: 1.125rem;
          border-radius: 9999px;
          background-color: var(--color-surface-raised);
        }
      `}</style>
      <div
        className="skl-card"
        aria-hidden="true"
        style={{ animationDelay: `${delayMs}ms` }}
      >
        {/* Poster placeholder */}
        <div className="skl-poster" />

        {/* Body placeholder */}
        <div className="skl-body">
          {/* Title — two lines to match 2-line clamp */}
          <div className="skl-title-line" style={{ width: "88%" }} />
          <div className="skl-title-line skl-title-line--short" />

          {/* Genre chip placeholders */}
          <div className="skl-genres">
            <div className="skl-chip" style={{ width: "3.5rem" }} />
            <div className="skl-chip" style={{ width: "2.75rem" }} />
            <div className="skl-chip" style={{ width: "4rem" }} />
          </div>
        </div>
      </div>
    </>
  );
}

export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8" aria-label="Loading watchlist" aria-busy="true">
      {/* Header skeleton */}
      <div className="mb-8">
        <Skeleton className="h-8 w-44 mb-2" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Grid skeleton — mirrors WatchlistGrid breakpoints exactly */}
      <>
        <style>{`
          .skl-grid {
            display: grid;
            gap: 1rem;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          @media (min-width: 768px) {
            .skl-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          }
          @media (min-width: 1024px) {
            .skl-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          }
          @media (min-width: 1280px) {
            .skl-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
          }
        `}</style>
        <div className="skl-grid">
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <SkeletonCard key={i} index={i} />
          ))}
        </div>
      </>
    </div>
  );
}
