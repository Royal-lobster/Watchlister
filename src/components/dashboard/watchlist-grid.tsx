"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Film } from "lucide-react";
import { NotionContentCard } from "./notion-content-card";
import { Badge } from "@/components/ui/badge";
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

/* ------------------------------------------------------------------ */
/*  Featured Hero Card                                                 */
/* ------------------------------------------------------------------ */

function FeaturedCard({ entry }: { entry: WatchlistEntry }) {
  const isTV =
    entry.mediaType === "TV Show" || entry.mediaType === "tv";

  return (
    <a
      className="relative grid gap-8 p-8 border border-border bg-card rounded-md overflow-hidden cursor-pointer hover:shadow-lg transition-all sm:grid-cols-[180px_1fr] grid-cols-[130px_1fr]"
      href={entry.notionUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Featured: ${entry.title} — open in Notion`}
    >
      {/* Left accent border */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary z-10" aria-hidden="true" />

      {/* Backdrop — uses poster as background */}
      {entry.posterUrl && (
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <Image
            src={entry.posterUrl}
            alt=""
            fill
            sizes="100vw"
            className="object-cover blur-sm saturate-50 brightness-[0.28] scale-105"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/55" />
        </div>
      )}

      {/* Poster */}
      <div className="relative z-[1] w-full aspect-[2/3] rounded-sm overflow-hidden bg-muted shadow-2xl">
        {entry.posterUrl ? (
          <Image
            src={entry.posterUrl}
            alt={`${entry.title} poster`}
            fill
            sizes="180px"
            className="object-cover transition-transform duration-[450ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.04]"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted">
            <Film className="size-10 text-muted-foreground" aria-hidden="true" />
            <span className="text-[10px] font-mono tracking-wider uppercase text-muted-foreground">
              No poster
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-[1] flex flex-col justify-center gap-3 min-w-0">
        <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
          {isTV ? "TV Series" : "Film"}
        </span>

        <h2 className="font-bold tracking-tight leading-tight text-foreground text-2xl sm:text-3xl">
          {entry.title}
        </h2>

        {entry.genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {entry.genres.slice(0, 4).map((genre) => (
              <Badge key={genre} variant="secondary">
                {genre}
              </Badge>
            ))}
            {entry.genres.length > 4 && (
              <Badge variant="secondary">+{entry.genres.length - 4}</Badge>
            )}
          </div>
        )}

        <span className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-0.5">
          View in Notion
        </span>
      </div>
    </a>
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

/* ------------------------------------------------------------------ */
/*  Main Grid                                                          */
/* ------------------------------------------------------------------ */

export function WatchlistGrid({ entries }: WatchlistGridProps) {
  if (entries.length === 0) {
    return <EmptyState />;
  }

  const [featured, ...rest] = entries;

  return (
    <div>
      {/* Featured hero card */}
      <FeaturedCard entry={featured} />

      {/* Section divider + grid */}
      {rest.length > 0 && (
        <>
          <div className="my-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
              Recently Added
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Uniform grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {rest.map((entry) => (
              <div key={entry.pageId}>
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
  );
}
