"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Film, Tv, Trash2, Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { archiveFromWatchlistAction } from "@/actions/watchlist";
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
      className="relative cursor-pointer rounded-md border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
      role="button"
      tabIndex={0}
      aria-label={`Open ${title} in Notion`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Backdrop — poster as cover image */}
      <div className="relative w-full aspect-video overflow-hidden rounded-t-md">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            className="object-cover brightness-[0.6]"
            aria-hidden="true"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 bg-muted" aria-hidden="true" />
        )}

        {/* Archive button — top-right */}
        <button
          type="button"
          className={cn(
            "absolute top-2 right-2 z-10 size-7 rounded-md bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors",
            isHovered || archiving ? "opacity-100" : "opacity-0"
          )}
          onClick={handleArchive}
          disabled={archiving}
          aria-label={`Remove ${title} from watchlist`}
          aria-busy={archiving}
        >
          {archiving ? (
            <Loader2 className="size-3 animate-spin" aria-hidden="true" />
          ) : (
            <Trash2 className="size-3" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Info section */}
      <div className="relative px-3 pb-3 pt-2">
        {/* Floating poster — overlaps backdrop */}
        <div className="absolute -top-10 left-3 w-20 aspect-[2/3] rounded-sm overflow-hidden shadow-xl border border-border/60 z-10">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={`${title} poster`}
              fill
              sizes="160px"
              quality={90}
              className="object-cover"
              priority={false}
            />
          ) : (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              {isTV ? (
                <Tv className="size-4 text-muted-foreground" aria-hidden="true" />
              ) : (
                <Film className="size-4 text-muted-foreground" aria-hidden="true" />
              )}
            </div>
          )}
        </div>

        {/* Text — shifted right of poster */}
        <div className="pl-24 min-h-20">
          <p className="text-[0.8125rem] font-semibold leading-snug line-clamp-2 text-foreground">
            {title}
          </p>
          <span className="mt-0.5 inline-block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {isTV ? "TV Series" : "Film"}
          </span>
        </div>
      </div>
    </div>
  );
}
