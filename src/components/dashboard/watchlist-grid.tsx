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
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="mb-6 relative" aria-hidden="true">
        <div className="size-20 rounded-full flex items-center justify-center bg-muted border border-border ring-[6px] ring-border/40">
          <Search className="size-9 text-muted-foreground" aria-hidden="true" />
        </div>
      </div>

      <h3 className="text-lg font-semibold tracking-tight text-foreground mb-2">
        Your watchlist is empty
      </h3>
      <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-6 max-w-[32ch]">
        Start curating your collection by searching for movies and shows.
      </p>

      <Button variant="outline" asChild>
        <Link href="/search">
          <Search className="size-4" aria-hidden="true" />
          Browse to add content
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
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
