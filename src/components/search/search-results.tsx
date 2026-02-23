import Link from "next/link";
import Image from "next/image";
import type { TmdbSearchResult } from "@/types";
import { getTmdbImageUrl } from "@/lib/tmdb";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SearchResultsProps {
  results: TmdbSearchResult[];
  query: string;
  currentPage: number;
  totalPages: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getYear(result: TmdbSearchResult): string {
  const raw = result.release_date ?? result.first_air_date ?? "";
  return raw ? raw.slice(0, 4) : "—";
}

function getTitle(result: TmdbSearchResult): string {
  return result.title ?? result.name ?? "Untitled";
}

// ---------------------------------------------------------------------------
// ResultCard — individual poster card
// ---------------------------------------------------------------------------

function ResultCard({ result }: { result: TmdbSearchResult }) {
  const title = getTitle(result);
  const year = getYear(result);
  const isTV = result.media_type === "tv";
  const href = `/content/${result.media_type}/${result.id}`;
  const posterUrl = getTmdbImageUrl(result.poster_path, "w300");

  return (
    <>
      <style>{`
        .src-card {
          position: relative;
          display: block;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--color-border);
          background-color: var(--color-surface);
          text-decoration: none;
          transition:
            border-color 0.22s ease,
            box-shadow 0.22s ease,
            transform 0.22s ease;
          outline: none;
        }
        .src-card:hover {
          border-color: color-mix(in srgb, var(--color-accent) 45%, var(--color-border));
          box-shadow:
            0 0 0 1px color-mix(in srgb, var(--color-accent) 12%, transparent),
            0 12px 36px -8px color-mix(in srgb, var(--color-accent) 20%, transparent),
            0 2px 8px -2px rgb(0 0 0 / 0.65);
          transform: translateY(-3px);
        }
        .src-card:focus-visible {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-accent) 35%, transparent);
        }

        /* Poster wrapper */
        .src-poster-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 2 / 3;
          overflow: hidden;
          background-color: var(--color-surface-raised);
        }

        /* Poster scale on hover */
        .src-card:hover .src-poster-img {
          transform: scale(1.05);
        }
        .src-poster-img {
          transition: transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* Gradient overlay — fades poster into card body */
        .src-poster-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 40%,
            color-mix(in srgb, var(--color-surface) 25%, transparent) 65%,
            var(--color-surface) 100%
          );
          z-index: 1;
        }

        /* Type badge — frosted glass on poster */
        .src-type-badge {
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
          z-index: 3;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.2rem 0.45rem 0.2rem 0.35rem;
          border-radius: var(--radius-sm);
          border: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
          background-color: color-mix(in srgb, var(--color-background) 80%, transparent);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          font-size: 0.6rem;
          font-family: var(--font-mono);
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          white-space: nowrap;
          color: var(--color-text-secondary);
        }
        .src-type-badge--movie {
          color: var(--color-accent);
          border-color: color-mix(in srgb, var(--color-accent) 35%, transparent);
        }

        /* Card body */
        .src-body {
          padding: 0.6rem 0.7rem 0.75rem;
        }

        /* Title */
        .src-title {
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          line-height: 1.35;
          color: var(--color-text-primary);
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          margin-bottom: 0.25rem;
          transition: color 0.18s ease;
        }
        .src-card:hover .src-title {
          color: #ffffff;
        }

        /* Year */
        .src-year {
          font-size: 0.7rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
          letter-spacing: 0.04em;
          margin-bottom: 0.4rem;
        }

        /* Overview */
        .src-overview {
          font-size: 0.7rem;
          line-height: 1.5;
          color: var(--color-text-muted);
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }

        /* Accent stripe — sweeps in on hover */
        .src-accent-stripe {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            var(--color-accent) 0%,
            color-mix(in srgb, var(--color-accent) 40%, transparent) 100%
          );
          opacity: 0;
          transition: opacity 0.22s ease;
        }
        .src-card:hover .src-accent-stripe {
          opacity: 1;
        }

        /* No-poster placeholder */
        .src-no-poster {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background-color: var(--color-surface-raised);
        }
        .src-no-poster-label {
          font-size: 0.6rem;
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--color-text-muted);
        }
      `}</style>

      <Link href={href} className="src-card" aria-label={`${title} (${year}) — ${isTV ? "TV Show" : "Movie"}`}>
        {/* Poster */}
        <div className="src-poster-wrap">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={`${title} poster`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover src-poster-img"
              priority={false}
            />
          ) : (
            <div className="src-no-poster" aria-hidden="true">
              {/* Film strip icon */}
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "var(--color-text-muted)", opacity: 0.5 }}
                aria-hidden="true"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M7 4v16M17 4v16M2 12h20M2 8h5M17 8h5M2 16h5M17 16h5" />
              </svg>
              <span className="src-no-poster-label">No poster</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="src-poster-overlay" aria-hidden="true" />

          {/* Type badge */}
          <span
            className={`src-type-badge${isTV ? "" : " src-type-badge--movie"}`}
            aria-hidden="true"
          >
            {isTV ? (
              /* TV icon */
              <svg width="8" height="8" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M2.5 2A1.5 1.5 0 001 3.5v7A1.5 1.5 0 002.5 12h11a1.5 1.5 0 001.5-1.5v-7A1.5 1.5 0 0013.5 2h-11zm0 9.5h11a.5.5 0 00.5-.5v-7a.5.5 0 00-.5-.5h-11a.5.5 0 00-.5.5v7a.5.5 0 00.5.5zM5.5 13a.5.5 0 000 1h5a.5.5 0 000-1h-5z" />
              </svg>
            ) : (
              /* Film icon */
              <svg width="8" height="8" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M0 1a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H1a1 1 0 01-1-1V1zm0 5.5a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zm13 0a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zM0 9a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H1a1 1 0 01-1-1V9zm0 4.5a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zm13 0a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5z" />
              </svg>
            )}
            {isTV ? "TV" : "Film"}
          </span>
        </div>

        {/* Body */}
        <div className="src-body">
          <p className="src-title">{title}</p>
          <p className="src-year">{year}</p>
          {result.overview && (
            <p className="src-overview">{result.overview}</p>
          )}
        </div>

        {/* Hover accent stripe */}
        <div className="src-accent-stripe" aria-hidden="true" />
      </Link>
    </>
  );
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

function Pagination({
  query,
  currentPage,
  totalPages,
}: {
  query: string;
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const prevHref = `/search?q=${encodeURIComponent(query)}&page=${currentPage - 1}`;
  const nextHref = `/search?q=${encodeURIComponent(query)}&page=${currentPage + 1}`;

  return (
    <>
      <style>{`
        .src-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 3rem;
        }

        .src-pg-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background-color: var(--color-surface);
          color: var(--color-text-secondary);
          font-size: 0.8125rem;
          font-weight: 500;
          text-decoration: none;
          transition:
            border-color 0.18s ease,
            background-color 0.18s ease,
            color 0.18s ease,
            transform 0.14s ease;
          cursor: pointer;
        }
        .src-pg-btn:hover {
          border-color: color-mix(in srgb, var(--color-accent) 50%, var(--color-border));
          background-color: var(--color-surface-raised);
          color: var(--color-text-primary);
          transform: translateY(-1px);
        }
        .src-pg-btn--disabled {
          opacity: 0.3;
          pointer-events: none;
          cursor: not-allowed;
        }
        .src-pg-btn:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 2px;
        }

        .src-pg-info {
          font-size: 0.75rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
          letter-spacing: 0.05em;
          user-select: none;
        }
        .src-pg-info-current {
          color: var(--color-accent);
          font-weight: 600;
        }
      `}</style>

      <nav
        className="src-pagination"
        aria-label="Search results pagination"
      >
        {hasPrev ? (
          <Link href={prevHref} className="src-pg-btn" aria-label="Previous page">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Prev
          </Link>
        ) : (
          <span className="src-pg-btn src-pg-btn--disabled" aria-disabled="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Prev
          </span>
        )}

        <span className="src-pg-info" aria-label={`Page ${currentPage} of ${totalPages}`}>
          <span className="src-pg-info-current">{currentPage}</span>
          {" / "}
          {totalPages}
        </span>

        {hasNext ? (
          <Link href={nextHref} className="src-pg-btn" aria-label="Next page">
            Next
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        ) : (
          <span className="src-pg-btn src-pg-btn--disabled" aria-disabled="true">
            Next
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        )}
      </nav>
    </>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyState({ query }: { query: string }) {
  return (
    <>
      <style>{`
        .src-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 6rem 1.5rem;
          text-align: center;
        }
        .src-empty-icon-ring {
          width: 5rem;
          height: 5rem;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          background: radial-gradient(circle, var(--color-surface-raised) 0%, var(--color-surface) 100%);
          border: 1px solid var(--color-border);
          box-shadow: 0 0 0 6px color-mix(in srgb, var(--color-border) 35%, transparent);
        }
        .src-empty-heading {
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: var(--color-text-primary);
          margin-bottom: 0.5rem;
        }
        .src-empty-sub {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          max-width: 26ch;
          line-height: 1.55;
        }
        .src-empty-query {
          color: var(--color-accent);
          font-style: italic;
        }
      `}</style>

      <div className="src-empty" role="status" aria-live="polite">
        <div className="src-empty-icon-ring" aria-hidden="true">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--color-text-muted)" }}
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </div>
        <h3 className="src-empty-heading">
          No results for{" "}
          <span className="src-empty-query">&ldquo;{query}&rdquo;</span>
        </h3>
        <p className="src-empty-sub">
          Try a different title, or check your spelling.
        </p>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Results header
// ---------------------------------------------------------------------------

function ResultsHeader({ query, count }: { query: string; count: number }) {
  return (
    <>
      <style>{`
        .src-header {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .src-header-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text-secondary);
        }
        .src-header-query {
          color: var(--color-text-primary);
          font-weight: 600;
        }
        .src-header-count {
          font-size: 0.75rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
          letter-spacing: 0.04em;
        }
      `}</style>
      <div className="src-header">
        <p className="src-header-title">
          Results for{" "}
          <span className="src-header-query">&ldquo;{query}&rdquo;</span>
        </p>
        <span className="src-header-count" aria-label={`${count} results`}>
          {count} result{count !== 1 ? "s" : ""}
        </span>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// SearchResults — main export
// ---------------------------------------------------------------------------

export function SearchResults({
  results,
  query,
  currentPage,
  totalPages,
}: SearchResultsProps) {
  // Filter to only movie/tv — exclude person or other types
  const filtered = results.filter(
    (r) => r.media_type === "movie" || r.media_type === "tv"
  );

  if (filtered.length === 0) {
    return <EmptyState query={query} />;
  }

  return (
    <>
      <style>{`
        .src-grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        @media (min-width: 768px) {
          .src-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        @media (min-width: 1024px) {
          .src-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }
        @media (min-width: 1280px) {
          .src-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
        }
      `}</style>

      <ResultsHeader query={query} count={filtered.length} />

      <div className="src-grid">
        {filtered.map((result) => (
          <ResultCard key={`${result.media_type}-${result.id}`} result={result} />
        ))}
      </div>

      <Pagination
        query={query}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
}
