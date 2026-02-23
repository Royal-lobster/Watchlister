"use client";

import Link from "next/link";
import Image from "next/image";
import { NotionContentCard } from "./notion-content-card";
import { Badge } from "@/components/ui";

interface WatchlistEntry {
  pageId: string;
  title: string;
  genres: string[];
  mediaType: string;
  posterUrl: string | null;
  notionUrl: string;
}

interface WatchlistGridProps {
  entries: WatchlistEntry[];
}

/* ------------------------------------------------------------------ */
/*  Featured Hero Card                                                 */
/* ------------------------------------------------------------------ */

function FeaturedCard({ entry }: { entry: WatchlistEntry }) {
  const isTV =
    entry.mediaType === "TV Show" || entry.mediaType === "tv";

  return (
    <>
      <style>{`
        .wg-featured {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 2rem;
          padding: 2rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background-color: var(--color-surface);
          cursor: pointer;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .wg-featured::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(to bottom, var(--color-accent), transparent);
        }
        .wg-featured:hover {
          border-color: color-mix(in srgb, var(--color-accent) 40%, var(--color-border));
          box-shadow: 0 8px 32px -8px rgba(0,0,0,0.6);
        }
        .wg-featured-poster {
          position: relative;
          width: 100%;
          aspect-ratio: 2 / 3;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background-color: var(--color-surface-raised);
          flex-shrink: 0;
        }
        .wg-featured-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0.75rem;
          min-width: 0;
        }
        .wg-featured-title {
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(1.5rem, 3vw, 1.875rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.2;
          color: var(--color-text-primary);
          transition: color 0.2s ease;
        }
        .wg-featured:hover .wg-featured-title {
          color: #ffffff;
        }
        .wg-featured-genres {
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
        }
        .wg-featured-link {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          margin-top: 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          color: var(--color-text-muted);
          transition: color 0.2s ease;
        }
        .wg-featured:hover .wg-featured-link {
          color: var(--color-accent);
        }
        @media (max-width: 640px) {
          .wg-featured {
            grid-template-columns: 140px 1fr;
            gap: 1.25rem;
            padding: 1.25rem;
          }
        }
      `}</style>

      <a
        className="wg-featured"
        href={entry.notionUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Featured: ${entry.title} — open in Notion`}
      >
        {/* Poster */}
        <div className="wg-featured-poster">
          {entry.posterUrl ? (
            <Image
              src={entry.posterUrl}
              alt={`${entry.title} poster`}
              fill
              sizes="200px"
              className="object-cover"
              priority
            />
          ) : (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-2"
              style={{ backgroundColor: "var(--color-surface-raised)" }}
            >
              <svg
                className="size-10"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                style={{ color: "var(--color-text-muted)" }}
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M1 4.75A.75.75 0 011.75 4h.5a.75.75 0 010 1.5h-.5A.75.75 0 011 4.75zm0 4.167a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zm0 4.166a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zM16.25 4a.75.75 0 00-.75.75v10.5a.75.75 0 001.5 0V4.75a.75.75 0 00-.75-.75zm1.25.75a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zm0 4.167a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zm0 4.166a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zM3.25 3A2.25 2.25 0 001 5.25v9.5A2.25 2.25 0 003.25 17h13.5A2.25 2.25 0 0019 14.75v-9.5A2.25 2.25 0 0016.75 3H3.25zm.75 2.5a.75.75 0 000 1.5h12a.75.75 0 000-1.5H4zm0 4a.75.75 0 000 1.5h12a.75.75 0 000-1.5H4zm0 4a.75.75 0 000 1.5h12a.75.75 0 000-1.5H4z"
                  clipRule="evenodd"
                />
              </svg>
              <span
                className="text-[10px] font-mono tracking-wider uppercase"
                style={{ color: "var(--color-text-muted)" }}
              >
                No poster
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="wg-featured-content">
          <span
            className="editorial-label"
            style={{
              color: isTV ? "var(--color-text-muted)" : "var(--color-accent)",
            }}
          >
            {isTV ? "TV Series" : "Film"}
          </span>

          <h2 className="wg-featured-title">{entry.title}</h2>

          {entry.genres.length > 0 && (
            <div className="wg-featured-genres">
              {entry.genres.slice(0, 4).map((genre) => (
                <Badge key={genre} variant="muted">
                  {genre}
                </Badge>
              ))}
              {entry.genres.length > 4 && (
                <Badge variant="muted">+{entry.genres.length - 4}</Badge>
              )}
            </div>
          )}

          <span className="wg-featured-link">
            View in Notion
            <svg
              className="size-3"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
      </a>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty State                                                        */
/* ------------------------------------------------------------------ */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      {/* Decorative icon container */}
      <div className="mb-6 relative" aria-hidden="true">
        <div
          className="size-20 rounded-full flex items-center justify-center"
          style={{
            background:
              "radial-gradient(circle, var(--color-surface-raised) 0%, var(--color-surface) 100%)",
            border: "1px solid var(--color-border)",
            boxShadow:
              "0 0 0 6px color-mix(in srgb, var(--color-border) 40%, transparent)",
          }}
        >
          <svg
            className="size-9"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            style={{ color: "var(--color-text-muted)" }}
          >
            <rect x="2" y="2" width="20" height="5" rx="1" strokeLinejoin="round" />
            <line x1="6" y1="2" x2="6" y2="7" />
            <line x1="10" y1="2" x2="10" y2="7" />
            <line x1="14" y1="2" x2="14" y2="7" />
            <line x1="18" y1="2" x2="18" y2="7" />
            <rect x="2" y="7" width="20" height="15" rx="1" strokeLinejoin="round" />
            <line x1="2" y1="13" x2="22" y2="13" />
            <line x1="12" y1="7" x2="12" y2="22" />
          </svg>
        </div>
        <span
          className="absolute -top-0.5 -right-0.5 size-3 rounded-full"
          style={{
            backgroundColor: "var(--color-accent-subtle)",
            border: "2px solid var(--color-background)",
          }}
        />
      </div>

      <h3
        className="text-lg font-semibold tracking-tight mb-2"
        style={{
          fontFamily: "var(--font-display), Georgia, serif",
          color: "var(--color-text-primary)",
        }}
      >
        Your watchlist is empty
      </h3>
      <p
        className="editorial-label mb-6 max-w-[32ch]"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Start curating your collection by searching for movies and shows.
      </p>

      <Link
        href="/search"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-(--radius-md) text-sm font-medium transition-all duration-200"
        style={{
          backgroundColor: "var(--color-surface-raised)",
          border: "1px solid var(--color-border)",
          color: "var(--color-accent)",
        }}
      >
        <svg
          className="size-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
        Browse to add content
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Grid                                                          */
/* ------------------------------------------------------------------ */

export function WatchlistGrid({ entries }: WatchlistGridProps) {
  if (entries.length === 0) {
    return <EmptyState />;
  }

  const [featured, ...rest] = entries;

  return (
    <>
      <style>{`
        .wg-grid {
          display: grid;
          gap: 1.25rem;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .wg-wide {
          grid-column: span 2;
        }
        @media (min-width: 768px) {
          .wg-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .wg-wide { grid-column: span 2; }
        }
        @media (min-width: 1024px) {
          .wg-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .wg-wide { grid-column: span 2; }
        }
        @media (min-width: 1280px) {
          .wg-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
          .wg-wide { grid-column: span 2; }
        }
      `}</style>

      <div>
        {/* Featured hero card */}
        <FeaturedCard entry={featured} />

        {/* Section divider */}
        {rest.length > 0 && (
          <>
            <div className="my-10 flex items-center gap-4">
              <div className="h-px flex-1 bg-(--color-border)" />
              <span className="text-[0.625rem] font-semibold tracking-[0.18em] uppercase text-(--color-text-muted)">
                Recently Added
              </span>
              <div className="h-px flex-1 bg-(--color-border)" />
            </div>

            {/* Asymmetric grid */}
            <div className="wg-grid">
              {rest.map((entry, index) => (
                <div
                  key={entry.pageId}
                  className={index % 5 === 0 ? "wg-wide" : ""}
                >
                  <NotionContentCard
                    pageId={entry.pageId}
                    title={entry.title}
                    genres={entry.genres}
                    mediaType={
                      entry.mediaType === "TV Show" || entry.mediaType === "tv"
                        ? "TV Show"
                        : "Movie"
                    }
                    posterUrl={entry.posterUrl}
                    notionUrl={entry.notionUrl}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
