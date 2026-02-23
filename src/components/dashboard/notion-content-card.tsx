"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Film, Tv, Trash2, Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { archiveFromWatchlistAction } from "@/actions/watchlist";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NotionContentCardProps {
  pageId: string;
  title: string;
  genres: string[];
  mediaType: "Movie" | "TV Show";
  posterUrl: string | null;
  notionUrl: string;
  onArchive?: (pageId: string) => void;
}

export function NotionContentCard({
  pageId,
  title,
  genres,
  mediaType,
  posterUrl,
  notionUrl,
  onArchive,
}: NotionContentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [archiving, setArchiving] = useState(false);

  const { execute } = useAction(archiveFromWatchlistAction, {
    onSuccess: () => {
      onArchive?.(pageId);
    },
    onError: () => {
      setArchiving(false);
    },
  });

  const handleArchive = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (archiving) return;
      setArchiving(true);
      execute({ pageId });
    },
    [archiving, execute, pageId]
  );

  const handleCardClick = useCallback(() => {
    window.open(notionUrl, "_blank", "noopener,noreferrer");
  }, [notionUrl]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleCardClick();
      }
    },
    [handleCardClick]
  );

  const isTV = mediaType === "TV Show";

  return (
    <div
      className="relative cursor-pointer rounded-md overflow-hidden border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
      role="button"
      tabIndex={0}
      aria-label={`Open ${title} in Notion`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Poster area */}
      <div className="relative w-full aspect-[2/3] overflow-hidden bg-muted">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={`${title} poster`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-500"
            style={{ transform: isHovered ? "scale(1.04)" : "scale(1)" }}
            priority={false}
          />
        ) : (
          /* Placeholder when no poster */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted">
            <Film className="size-8 text-muted-foreground" aria-hidden="true" />
            <span className="text-[10px] font-mono tracking-wider uppercase text-muted-foreground">
              No poster
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card/80 z-[1]"
          aria-hidden="true"
        />

        {/* Type pill — top-left */}
        <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-background/80 backdrop-blur-sm text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {isTV ? (
            <Tv className="size-2.5" aria-hidden="true" />
          ) : (
            <Film className="size-2.5" aria-hidden="true" />
          )}
          {mediaType}
        </span>

        {/* Archive button — top-right, visible on hover */}
        <button
          type="button"
          className={cn(
            "absolute top-2 right-2 z-10 size-8 rounded-md bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors",
            isHovered || archiving ? "opacity-100" : "opacity-0",
            archiving && "cursor-not-allowed opacity-50"
          )}
          onClick={handleArchive}
          disabled={archiving}
          aria-label={`Remove ${title} from watchlist`}
          aria-busy={archiving}
        >
          {archiving ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Trash2 className="size-3.5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Body */}
      <div className="p-2.5">
        <p className="text-[0.8125rem] font-semibold leading-snug line-clamp-2 text-foreground mb-1">
          {title}
        </p>
        <div className="flex flex-wrap gap-1">
          {genres.slice(0, 3).map((genre) => (
            <Badge key={genre} variant="secondary" className="text-[10px]">
              {genre}
            </Badge>
          ))}
          {genres.length > 3 && (
            <Badge variant="secondary" className="text-[10px]">
              +{genres.length - 3}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
