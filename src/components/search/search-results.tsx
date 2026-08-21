import Link from "next/link";
import Image from "next/image";
import { Film, Tv } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TmdbSearchResult } from "@/types";
import { getTmdbImageUrl } from "@/lib/tmdb";

interface SearchResultsProps {
  results: TmdbSearchResult[];
  query: string;
  currentPage: number;
  totalPages: number;
}

function getYear(result: TmdbSearchResult): string {
  const raw = result.release_date ?? result.first_air_date ?? "";
  return raw ? raw.slice(0, 4) : "—";
}

function getTitle(result: TmdbSearchResult): string {
  return result.title ?? result.name ?? "Untitled";
}

function ResultCard({ result }: { result: TmdbSearchResult }) {
  const title = getTitle(result);
  const year = getYear(result);
  const isTV = result.media_type === "tv";
  const href = `/content/${result.media_type}/${result.id}`;
  const posterUrl = getTmdbImageUrl(result.poster_path, "w500");

  return (
    <Link href={href} aria-label={`${title} (${year}) — ${isTV ? "TV Show" : "Movie"}`}>
      <Card className="hover:bg-accent/50 transition-colors h-full">
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
          <p className="text-sm font-medium leading-snug line-clamp-2 text-foreground">
            {title}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-muted-foreground">{year}</span>
            <Badge variant="secondary" className="text-xs">
              {isTV ? "TV" : "Movie"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function Pagination({
  query,
  currentPage,
  totalPages,
}: {
  query: string;
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const prevHref = `/search?q=${encodeURIComponent(query)}&page=${currentPage - 1}`;
  const nextHref = `/search?q=${encodeURIComponent(query)}&page=${currentPage + 1}`;

  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      <Button variant="outline" size="sm" asChild disabled={!hasPrev}>
        {hasPrev ? (
          <Link href={prevHref}>
            <ChevronLeft className="size-4" />
            Previous
          </Link>
        ) : (
          <span>
            <ChevronLeft className="size-4" />
            Previous
          </span>
        )}
      </Button>

      <span className="text-sm text-muted-foreground">
        {currentPage} / {totalPages}
      </span>

      <Button variant="outline" size="sm" asChild disabled={!hasNext}>
        {hasNext ? (
          <Link href={nextHref}>
            Next
            <ChevronRight className="size-4" />
          </Link>
        ) : (
          <span>
            Next
            <ChevronRight className="size-4" />
          </span>
        )}
      </Button>
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center" role="status" aria-live="polite">
      <p className="text-lg font-semibold text-foreground mb-1">No results for &ldquo;{query}&rdquo;</p>
      <p className="text-sm text-muted-foreground">Try a different title, or check your spelling.</p>
    </div>
  );
}

export function SearchResults({
  results,
  query,
  currentPage,
  totalPages,
}: SearchResultsProps) {
  const filtered = results.filter(
    (r) => r.media_type === "movie" || r.media_type === "tv"
  );

  if (filtered.length === 0) {
    return <EmptyState query={query} />;
  }

  return (
    <>
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((result) => (
          <ResultCard key={`${result.media_type}-${result.id}`} result={result} />
        ))}
      </div>

      <Pagination query={query} currentPage={currentPage} totalPages={totalPages} />
    </>
  );
}
