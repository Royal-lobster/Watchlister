import Link from "next/link";
import Image from "next/image";
import { Film, Tv, Search } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TmdbSearchResult } from "@/types";
import { getTmdbImageUrl } from "@/lib/tmdb";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SearchResultsProps {
  results: TmdbSearchResult[];
  query: string;
  currentPage: number;
  totalPages: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getYear(result: TmdbSearchResult): string {
  const raw = result.release_date ?? result.first_air_date ?? "";
  return raw ? raw.slice(0, 4) : "\u2014";
}

function getTitle(result: TmdbSearchResult): string {
  return result.title ?? result.name ?? "Untitled";
}

// ---------------------------------------------------------------------------
// ResultCard
// ---------------------------------------------------------------------------

function ResultCard({ result }: { result: TmdbSearchResult }) {
  const title = getTitle(result);
  const year = getYear(result);
  const isTV = result.media_type === "tv";
  const href = `/content/${result.media_type}/${result.id}`;
  const posterUrl = getTmdbImageUrl(result.poster_path, "original");
  const backdropUrl = getTmdbImageUrl(result.backdrop_path, "w780");

  return (
    <Link
      href={href}
      aria-label={`${title} (${year}) — ${isTV ? "TV Show" : "Movie"}`}
      className={cn(
        "group relative flex flex-col rounded-md",
        "border border-border bg-card text-card-foreground",
        "hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "transition-all duration-200 ease-out"
      )}
    >
      {/* Cover image — backdrop or blurred poster fallback */}
      <div className="relative w-full aspect-video overflow-hidden rounded-t-md">
        {backdropUrl ? (
          <Image
            src={backdropUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            aria-hidden="true"
            priority={false}
          />
        ) : posterUrl ? (
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
      </div>

      {/* Info section */}
      <div className="relative px-3 pb-3 pt-2">
        {/* Floating poster — overlaps cover image */}
        <div className="absolute -top-10 left-3 w-20 aspect-[2/3] rounded-sm overflow-hidden shadow-xl border border-border/60 z-10">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={`${title} poster`}
              fill
              sizes="160px"
              quality={90}
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
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
          <p
            className={cn(
              "text-[0.8125rem] font-semibold leading-snug line-clamp-2 text-foreground",
              "group-hover:text-white transition-colors duration-150"
            )}
          >
            {title}
          </p>
          <p className="mt-0.5 text-[10px] font-mono text-muted-foreground tracking-wide">
            {year} · {isTV ? "TV" : "Film"}
          </p>
          {result.overview && (
            <p className="mt-1 text-[0.7rem] leading-relaxed text-muted-foreground line-clamp-2">
              {result.overview}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

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

  const btnBase = cn(
    "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium",
    "border border-border bg-transparent text-muted-foreground",
    "transition-all duration-150 ease-out"
  );
  const btnActive =
    "hover:border-primary/50 hover:bg-muted hover:text-foreground hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";
  const btnDisabled = "opacity-30 pointer-events-none cursor-not-allowed";

  return (
    <>
      <hr className="mt-12 border-t border-border" />

      <nav
        className="flex items-center justify-center gap-3 pt-6"
        aria-label="Search results pagination"
      >
        {hasPrev ? (
          <Link
            href={prevHref}
            className={cn(btnBase, btnActive)}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-3.5" aria-hidden="true" />
            Prev
          </Link>
        ) : (
          <span className={cn(btnBase, btnDisabled)} aria-disabled="true">
            <ChevronLeft className="size-3.5" aria-hidden="true" />
            Prev
          </span>
        )}

        <span
          className="text-xs font-mono text-muted-foreground tracking-[0.05em] select-none"
          aria-label={`Page ${currentPage} of ${totalPages}`}
        >
          <span className="text-sm font-bold font-sans text-primary">
            {currentPage}
          </span>
          {" / "}
          {totalPages}
        </span>

        {hasNext ? (
          <Link
            href={nextHref}
            className={cn(btnBase, btnActive)}
            aria-label="Next page"
          >
            Next
            <ChevronRight className="size-3.5" aria-hidden="true" />
          </Link>
        ) : (
          <span className={cn(btnBase, btnDisabled)} aria-disabled="true">
            Next
            <ChevronRight className="size-3.5" aria-hidden="true" />
          </span>
        )}
      </nav>
    </>
  );
}

// ---------------------------------------------------------------------------
// EmptyState
// ---------------------------------------------------------------------------

function EmptyState({ query }: { query: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-24 px-6 text-center"
      role="status"
      aria-live="polite"
    >
      <div
        className={cn(
          "size-20 rounded-full flex items-center justify-center mb-6",
          "bg-muted border border-border",
          "shadow-[0_0_0_6px_hsl(var(--border)/0.35)]"
        )}
        aria-hidden="true"
      >
        <Search
          className="size-9 text-muted-foreground"
          strokeWidth={1}
          aria-hidden="true"
        />
      </div>

      <h3 className="text-lg font-bold font-sans tracking-tight text-foreground mb-2">
        No results for{" "}
        <span className="text-primary italic">&ldquo;{query}&rdquo;</span>
      </h3>
      <p className="text-sm text-muted-foreground max-w-[26ch] leading-relaxed">
        Try a different title, or check your spelling.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ResultsHeader
// ---------------------------------------------------------------------------

function ResultsHeader({ query, count }: { query: string; count: number }) {
  return (
    <div className="flex items-baseline gap-3 mb-8 pb-4 border-b border-border">
      <p className="text-xl font-bold font-sans tracking-tight text-foreground">
        Results for{" "}
        <span className="text-foreground font-bold">&ldquo;{query}&rdquo;</span>
      </p>
      <span
        className="text-xs font-mono text-muted-foreground tracking-[0.04em]"
        aria-label={`${count} results`}
      >
        {count} result{count !== 1 ? "s" : ""}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SearchResults — main export
// ---------------------------------------------------------------------------

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
      <ResultsHeader query={query} count={filtered.length} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map((result) => (
          <ResultCard key={`${result.media_type}-${result.id}`} result={result} />
        ))}
      </div>

      <Pagination
        query={query}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
}
