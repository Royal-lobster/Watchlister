import Image from "next/image";
import { Film, Tv } from "lucide-react";
import { getTmdbImageUrl } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

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

function PosterPlaceholder() {
  return (
    <div
      className="w-10 h-[60px] shrink-0 bg-muted border border-border rounded-sm flex items-center justify-center text-muted-foreground"
      aria-hidden="true"
    >
      <Film className="size-3" />
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
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 text-left cursor-pointer transition-colors duration-100 ease-out border-l-2",
        isHighlighted
          ? "border-l-primary bg-accent text-accent-foreground"
          : "border-l-transparent bg-transparent text-muted-foreground hover:border-l-primary/50 hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {/* Poster thumbnail */}
      <span className="shrink-0 rounded-sm overflow-hidden">
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

      {/* Text block */}
      <span className="min-w-0 flex-1 flex flex-col gap-1">
        {/* Title */}
        <span className="block text-sm font-medium leading-tight truncate text-foreground">
          {title}
        </span>

        {/* Meta row: year · type badge */}
        <span className="flex items-center gap-2">
          {year && (
            <span className="text-xs text-muted-foreground tabular-nums leading-none">
              {year}
            </span>
          )}

          {year && (
            <span
              className="text-[10px] text-muted-foreground/40 leading-none select-none"
              aria-hidden="true"
            >
              /
            </span>
          )}

          {/* Media type badge */}
          <span
            className={cn(
              "inline-flex items-center gap-1 px-1.5 py-[3px] rounded-sm text-[10px] font-medium tracking-wide uppercase leading-none transition-colors duration-100",
              isHighlighted
                ? "bg-primary/15 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            {mediaType === "movie" ? (
              <Film className="size-2.5" />
            ) : (
              <Tv className="size-2.5" />
            )}
            {mediaType === "movie" ? "Film" : "Series"}
          </span>
        </span>
      </span>

      {/* Arrow hint — only visible on highlight */}
      {isHighlighted && (
        <span className="shrink-0 text-primary" aria-hidden="true">
          ›
        </span>
      )}
    </button>
  );
}
