import { Skeleton } from "@/components/ui/skeleton";

// ---------------------------------------------------------------------------
// ContentPage Loading Skeleton
// Mirrors the cinema-style layout of the detail page
// ---------------------------------------------------------------------------

export default function ContentLoading() {
  return (
    <>
      <style>{`
        /* ---- Reuse layout variables from the page ---- */
        .cdp-sk-root {
          position: relative;
          min-height: 100vh;
          background-color: var(--color-background);
          overflow-x: hidden;
        }

        /* Hero shimmer */
        .cdp-sk-hero {
          position: relative;
          width: 100%;
          height: 72vh;
          min-height: 480px;
          max-height: 640px;
          overflow: hidden;
        }

        .cdp-sk-hero-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            var(--color-surface) 0%,
            var(--color-surface-raised) 50%,
            var(--color-surface) 100%
          );
          background-size: 200% 200%;
          animation: cdp-sk-shimmer 2.2s ease-in-out infinite;
        }

        /* Gradient fade at bottom — same as real page */
        .cdp-sk-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 40%,
            rgba(10, 10, 10, 0.75) 75%,
            rgba(10, 10, 10, 1) 100%
          );
        }

        @keyframes cdp-sk-shimmer {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* ---- Content ---- */
        .cdp-sk-content {
          position: relative;
          z-index: 10;
          max-width: 64rem;
          margin: -26rem auto 0;
          padding: 0 1.5rem 5rem;
        }

        .cdp-sk-inner {
          display: flex;
          gap: 2.5rem;
          align-items: flex-start;
        }

        /* Poster skeleton */
        .cdp-sk-poster {
          flex-shrink: 0;
          width: 14rem;
          aspect-ratio: 2 / 3;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.9);
        }

        /* Right column */
        .cdp-sk-meta {
          flex: 1;
          min-width: 0;
          padding-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* Individual shimmer lines */
        .cdp-sk-label {
          width: 4.5rem;
          height: 0.75rem;
          border-radius: 9999px;
          margin-bottom: 0.875rem;
        }

        .cdp-sk-title-lg {
          width: min(28rem, 80%);
          height: 2.75rem;
          border-radius: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .cdp-sk-title-sm {
          width: min(18rem, 55%);
          height: 2.25rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
        }

        .cdp-sk-vitals {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.125rem;
        }

        .cdp-sk-year {
          width: 3rem;
          height: 0.875rem;
          border-radius: 9999px;
        }

        .cdp-sk-sep {
          width: 1px;
          height: 0.875rem;
          background-color: var(--color-border-subtle);
          flex-shrink: 0;
        }

        .cdp-sk-stars {
          width: 6.5rem;
          height: 0.875rem;
          border-radius: 9999px;
        }

        .cdp-sk-genres {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1.375rem;
        }

        .cdp-sk-genre {
          height: 1.25rem;
          border-radius: 9999px;
        }

        .cdp-sk-tagline {
          width: min(26rem, 70%);
          height: 1rem;
          border-radius: 0.375rem;
          margin-bottom: 0.375rem;
          border-left: 2px solid var(--color-accent-subtle);
          padding-left: 0.875rem;
          box-sizing: content-box;
        }

        .cdp-sk-overview-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .cdp-sk-overview-line {
          height: 0.875rem;
          border-radius: 9999px;
        }

        .cdp-sk-cta {
          width: 10.5rem;
          height: 3rem;
          border-radius: 9999px;
        }

        /* Providers section */
        .cdp-sk-providers {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid var(--color-border-subtle);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cdp-sk-providers-heading {
          width: 7rem;
          height: 0.75rem;
          border-radius: 9999px;
        }

        .cdp-sk-providers-logos {
          display: flex;
          gap: 0.5rem;
        }

        .cdp-sk-provider-logo {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.5rem;
        }

        /* Responsive */
        @media (max-width: 720px) {
          .cdp-sk-content {
            margin-top: -18rem;
            padding: 0 1rem 4rem;
          }

          .cdp-sk-inner {
            flex-direction: column;
            align-items: center;
            gap: 1.75rem;
          }

          .cdp-sk-poster {
            width: 11rem;
          }

          .cdp-sk-meta {
            padding-top: 0;
            width: 100%;
          }

          .cdp-sk-title-lg {
            height: 2.25rem;
          }
        }

        @media (max-width: 480px) {
          .cdp-sk-hero {
            height: 55vh;
            min-height: 360px;
          }
        }
      `}</style>

      <div className="cdp-sk-root" aria-busy="true" aria-label="Loading content details">
        {/* ---- Hero shimmer ---- */}
        <div className="cdp-sk-hero" aria-hidden="true">
          <div className="cdp-sk-hero-bg" />
          <div className="cdp-sk-hero-overlay" />
        </div>

        {/* ---- Content ---- */}
        <div className="cdp-sk-content">
          <div className="cdp-sk-inner">
            {/* Poster */}
            <div className="cdp-sk-poster" aria-hidden="true">
              <Skeleton className="w-full h-full" />
            </div>

            {/* Metadata */}
            <div className="cdp-sk-meta" aria-hidden="true">
              {/* Type label */}
              <Skeleton className="cdp-sk-label" />

              {/* Title — two lines for a realistic feel */}
              <Skeleton className="cdp-sk-title-lg" />
              <Skeleton className="cdp-sk-title-sm" />

              {/* Year + stars */}
              <div className="cdp-sk-vitals">
                <Skeleton className="cdp-sk-year" />
                <div className="cdp-sk-sep" />
                <Skeleton className="cdp-sk-stars" />
              </div>

              {/* Genres */}
              <div className="cdp-sk-genres">
                {[5.5, 4.5, 7, 5].map((w, i) => (
                  <Skeleton
                    key={i}
                    className="cdp-sk-genre"
                    style={{ width: `${w}rem` } as React.CSSProperties}
                  />
                ))}
              </div>

              {/* Tagline */}
              <Skeleton className="cdp-sk-tagline" />

              {/* Overview lines */}
              <div className="cdp-sk-overview-wrap" style={{ marginTop: "1.25rem" }}>
                {[100, 96, 100, 88, 72].map((pct, i) => (
                  <Skeleton
                    key={i}
                    className="cdp-sk-overview-line"
                    style={{ width: `${pct}%` } as React.CSSProperties}
                  />
                ))}
              </div>

              {/* CTA button */}
              <Skeleton className="cdp-sk-cta" />
            </div>
          </div>

          {/* Providers */}
          <div className="cdp-sk-providers" aria-hidden="true">
            <Skeleton className="cdp-sk-providers-heading" />
            <div className="cdp-sk-providers-logos">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="cdp-sk-provider-logo" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
