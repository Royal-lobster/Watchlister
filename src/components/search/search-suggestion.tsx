import Image from "next/image";
import { Film, Tv } from "lucide-react";
import { getTmdbImageUrl } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SearchSuggestionProps {
  id: number;
  title: string;
  mediaType: "movie" | "tv";
  posterPath: string | null;
  year: string;
  isHighlighted?: boolean;
  onClick: () => void;
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
        "w-full flex items-center gap-3 px-3 py-2 text-left cursor-pointer transition-colors",
        isHighlighted ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {/* Poster thumbnail */}
      <span className="shrink-0 rounded-sm overflow-hidden">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt=""
            width={32}
            height={48}
            className="w-8 h-12 object-cover"
            aria-hidden="true"
          />
        ) : (
          <div className="w-8 h-12 bg-muted border border-border rounded-sm flex items-center justify-center" aria-hidden="true">
            <Film className="size-3 text-muted-foreground" />
          </div>
        )}
      </span>

      <span className="min-w-0 flex-1 flex flex-col gap-1">
        <span className="text-sm font-medium leading-tight truncate">
          {title}
        </span>
        <span className="flex items-center gap-2">
          {year && (
            <span className="text-xs text-muted-foreground">{year}</span>
          )}
          <Badge variant="secondary" className="text-xs px-1.5 py-0">
            {mediaType === "movie" ? (
              <><Film className="size-2.5 mr-1" />Movie</>
            ) : (
              <><Tv className="size-2.5 mr-1" />TV</>
            )}
          </Badge>
        </span>
      </span>
    </button>
  );
}
