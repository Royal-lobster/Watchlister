"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { NotionContentCard } from "./notion-content-card";
import { Button } from "@/components/ui/button";

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
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Search className="size-8 text-muted-foreground mb-3" aria-hidden="true" />
      <h3 className="text-base font-semibold text-foreground mb-1">
        Your watchlist is empty
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Search for movies and shows to add to your watchlist.
      </p>
      <Button variant="outline" asChild>
        <Link href="/search">
          <Search className="size-4" aria-hidden="true" />
          Browse content
        </Link>
      </Button>
    </div>
  );
}

export function WatchlistGrid({ entries }: WatchlistGridProps) {
  if (entries.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
  );
}
