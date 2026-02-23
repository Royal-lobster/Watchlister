import Image from "next/image";
import { getTmdbImageUrl } from "@/lib/tmdb";

// ---------------------------------------------------------------------------
// SearchSuggestion — compact row for the suggestions dropdown
// ---------------------------------------------------------------------------

interface SearchSuggestionProps {
  id: number;
  title: string;
  mediaType: "movie" | "tv";
  posterPath: string | null;
  year: string;
  isHighlighted?: boolean;
  onClick: () => void;
}

/** Film strip icon for movie type */
function FilmIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="9"
      height="9"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="17" x2="22" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
    </svg>
  );
}

/** TV / monitor icon for tv type */
function TvIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="9"
      height="9"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
      <polyline points="17 2 12 7 7 2" />
    </svg>
  );
}

/** Placeholder poster when no image is available */
function PosterPlaceholder() {
  return (
    <div
      className={[
        "w-10 h-[60px] shrink-0",
        "bg-(--color-surface-raised)",
        "border border-(--color-border)",
        "rounded-[3px]",
        "flex items-center justify-center",
        "text-(--color-text-muted)",
      ].join(" ")}
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    </div>
  );
}

export function SearchSuggestion({
  title,
  mediaType,
  posterPath,
  year,
  isHighlighted = false,
  onClick,
}: SearchSuggestionProps) {
  const posterUrl = getTmdbImageUrl(posterPath, "w92");

  return (
    <button
      type="button"
      onClick={onClick}
      role="option"
      aria-selected={isHighlighted}
      className={[
        // Layout
        "w-full flex items-center gap-3",
        "px-3 py-2",
        // Base appearance
        "text-left",
        "cursor-pointer",
        "transition-colors duration-100 ease-out",
        // Border-left active rail — the key visual differentiator
        "border-l-2",
        isHighlighted
          ? [
              "border-l-(--color-accent)",
              "bg-(--color-surface-hover)",
              "text-(--color-text-primary)",
            ].join(" ")
          : [
              "border-l-transparent",
              "bg-transparent",
              "text-(--color-text-secondary)",
              "hover:border-l-(--color-accent)/50",
              "hover:bg-(--color-surface-raised)",
              "hover:text-(--color-text-primary)",
            ].join(" "),
      ].join(" ")}
    >
      {/* ── Poster thumbnail ── */}
      <span className="shrink-0 rounded-[3px] overflow-hidden">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt=""
            width={40}
            height={60}
            className="w-10 h-[60px] object-cover"
            aria-hidden="true"
          />
        ) : (
          <PosterPlaceholder />
        )}
      </span>

      {/* ── Text block ── */}
      <span className="min-w-0 flex-1 flex flex-col gap-1">
        {/* Title */}
        <span
          className={[
            "block text-sm font-medium leading-tight truncate",
            "transition-colors duration-100",
            isHighlighted
              ? "text-(--color-text-primary)"
              : "text-(--color-text-primary)",
          ].join(" ")}
        >
          {title}
        </span>

        {/* Meta row: year · type badge */}
        <span className="flex items-center gap-2">
          {year && (
            <span className="text-xs text-(--color-text-muted) tabular-nums leading-none">
              {year}
            </span>
          )}

          {/* Slash separator */}
          {year && (
            <span
              className="text-[10px] text-(--color-text-muted)/40 leading-none select-none"
              aria-hidden="true"
            >
              /
            </span>
          )}

          {/* Media type badge */}
          <span
            className={[
              "inline-flex items-center gap-1",
              "px-1.5 py-[3px]",
              "rounded-[3px]",
              "text-[10px] font-medium tracking-wide uppercase leading-none",
              isHighlighted
                ? "bg-(--color-accent)/15 text-(--color-accent)"
                : "bg-(--color-surface-raised) text-(--color-text-muted)",
              "transition-colors duration-100",
            ].join(" ")}
          >
            {mediaType === "movie" ? <FilmIcon /> : <TvIcon />}
            {mediaType === "movie" ? "Film" : "Series"}
          </span>
        </span>
      </span>

      {/* ── Arrow hint (only visible on highlight) ── */}
      <span
        className={[
          "shrink-0 text-(--color-accent) transition-opacity duration-100",
          isHighlighted ? "opacity-100" : "opacity-0",
        ].join(" ")}
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </span>
    </button>
  );
}
