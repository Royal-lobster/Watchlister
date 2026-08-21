"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Film, Tv, Trash2, Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { archiveFromWatchlistAction } from "@/actions/watchlist";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    <Card
      className="cursor-pointer hover:bg-accent/50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
      role="button"
      tabIndex={0}
      aria-label={`Open ${title} in Notion`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
    >
      {/* Poster */}
      <div className="relative w-full aspect-[2/3] overflow-hidden rounded-t-lg border-b border-border">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={`${title} poster`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            className="object-cover"
            aria-hidden="true"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            {isTV ? (
              <Tv className="size-6 text-muted-foreground" aria-hidden="true" />
            ) : (
              <Film className="size-6 text-muted-foreground" aria-hidden="true" />
            )}
          </div>
        )}
      </div>

      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium leading-snug line-clamp-2 text-foreground">
              {title}
            </p>
            <Badge variant="secondary" className="mt-1.5 text-xs">
              {isTV ? "TV Series" : "Movie"}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 size-7 text-muted-foreground hover:text-destructive"
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
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
