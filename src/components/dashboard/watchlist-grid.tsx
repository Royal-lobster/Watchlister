import Link from "next/link";
import { NotionContentCard } from "./notion-content-card";

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
        className="text-base font-semibold tracking-tight mb-2"
        style={{ color: "var(--color-text-primary)" }}
      >
        Your watchlist is empty
      </h3>
      <p
        className="text-sm leading-relaxed mb-6 max-w-[28ch]"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Start building your list by searching for movies and shows.
      </p>

      <Link
        href="/search"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-(--radius-md) text-sm font-medium"
        style={{
          backgroundColor: "var(--color-surface-raised)",
          border: "1px solid var(--color-border)",
          color: "var(--color-text-secondary)",
          transition: "border-color 0.18s ease, color 0.18s ease, background-color 0.18s ease",
        }}
        onMouseOver={(e) => {
          const el = e.currentTarget;
          el.style.borderColor =
            "color-mix(in srgb, var(--color-accent) 40%, var(--color-border))";
          el.style.color = "var(--color-text-primary)";
          el.style.backgroundColor = "var(--color-surface-hover)";
        }}
        onMouseOut={(e) => {
          const el = e.currentTarget;
          el.style.borderColor = "var(--color-border)";
          el.style.color = "var(--color-text-secondary)";
          el.style.backgroundColor = "var(--color-surface-raised)";
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

export function WatchlistGrid({ entries }: WatchlistGridProps) {
  if (entries.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <style>{`
        .wg-grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .wg-grid > *:first-child {
          grid-column: span 2;
          grid-row: span 2;
        }
        @media (min-width: 768px) {
          .wg-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        @media (min-width: 1024px) {
          .wg-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }
        @media (min-width: 1280px) {
          .wg-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
        }
      `}</style>
      <div className="wg-grid">
        {entries.map((entry) => (
          <NotionContentCard
            key={entry.pageId}
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
        ))}
      </div>
    </>
  );
}
