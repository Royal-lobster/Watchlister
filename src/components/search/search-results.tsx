import Link from "next/link";
import Image from "next/image";
import { Film, Tv, Search } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
// NoPosterPlaceholder — shared fallback for missing poster images
// ---------------------------------------------------------------------------

function NoPosterPlaceholder({ size = "sm" }: { size?: "sm" | "lg" }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted">
      <Film
        className={cn(
          "text-muted-foreground/40",
          size === "lg" ? "size-9" : "size-7"
        )}
        strokeWidth={1}
        aria-hidden="true"
      />
      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50">
        No poster
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ResultCard — individual poster card
// ---------------------------------------------------------------------------

function ResultCard({ result }: { result: TmdbSearchResult }) {
  const title = getTitle(result);
  const year = getYear(result);
  const isTV = result.media_type === "tv";
  const href = `/content/${result.media_type}/${result.id}`;
  const posterUrl = getTmdbImageUrl(result.poster_path, "w300");

  return (
    <Link
      href={href}
      aria-label={`${title} (${year}) — ${isTV ? "TV Show" : "Movie"}`}
      className={cn(
        "group relative flex flex-col rounded-md overflow-hidden",
        "border border-border bg-card text-card-foreground",
        "hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "transition-all duration-200 ease-out"
      )}
    >
      {/* Poster */}
      <div className="relative w-full aspect-[2/3] overflow-hidden bg-muted">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={`${title} poster`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            priority={false}
          />
        ) : (
          <NoPosterPlaceholder size="sm" />
        )}

        {/* Gradient overlay — fades poster into card body */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card/90 z-10"
          aria-hidden="true"
        />

        {/* Type badge — frosted glass on poster */}
        <Badge
          variant="outline"
          className={cn(
            "absolute top-2 left-2 z-20",
            "backdrop-blur-md bg-background/80 border-border/60",
            "text-[10px] font-mono font-bold tracking-widest uppercase",
            !isTV && "text-primary border-primary/40"
          )}
          aria-hidden="true"
        >
          {isTV ? <Tv className="size-2" /> : <Film className="size-2" />}
          {isTV ? "TV" : "Film"}
        </Badge>
      </div>

      {/* Body */}
      <div className="px-2.5 py-2.5 flex flex-col gap-1">
        <p
          className={cn(
            "text-[0.8rem] font-semibold font-sans leading-snug text-foreground",
            "line-clamp-2 group-hover:text-white transition-colors duration-150"
          )}
        >
          {title}
        </p>
        <p className="text-[0.7rem] font-mono text-muted-foreground tracking-wide">
          {year}
        </p>
        {result.overview && (
          <p className="text-[0.7rem] leading-relaxed text-muted-foreground line-clamp-2">
            {result.overview}
          </p>
        )}
      </div>

      {/* Hover accent stripe */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        aria-hidden="true"
      />
    </Link>
  );
}

// ---------------------------------------------------------------------------
// FeaturedResult — large horizontal card for first result
// ---------------------------------------------------------------------------

function FeaturedResult({ result }: { result: TmdbSearchResult }) {
  const title = getTitle(result);
  const year = getYear(result);
  const isTV = result.media_type === "tv";
  const href = `/content/${result.media_type}/${result.id}`;
  const posterUrl = getTmdbImageUrl(result.poster_path, "w500");
  const backdropUrl = getTmdbImageUrl(result.backdrop_path, "w780");

  return (
    <Link
      href={href}
      aria-label={`${title} (${year}) — ${isTV ? "TV Show" : "Movie"}`}
      className={cn(
        "group relative grid grid-cols-[130px_1fr] sm:grid-cols-[180px_1fr]",
        "gap-5 sm:gap-8 p-5 sm:p-6 mb-10",
        "rounded-md overflow-hidden border border-border bg-card",
        "hover:border-primary/40 hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "transition-all duration-250 ease-out"
      )}
    >
      {/* Backdrop image — blurred/dimmed behind content */}
      {backdropUrl && (
        <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          <Image
            src={backdropUrl}
            alt=""
            fill
            sizes="100vw"
            className={cn(
              "object-cover object-[center_20%]",
              "opacity-100 saturate-50 brightness-[0.28] blur-sm scale-105",
              "group-hover:scale-110 group-hover:brightness-[0.32]",
              "transition-all duration-500 ease-out"
            )}
            priority={false}
          />
          {/* Left-to-right fade so text stays legible */}
          <div className="absolute inset-0 bg-gradient-to-r from-card/90 via-card/70 to-card/55" />
        </div>
      )}

      {/* Left accent stripe */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-primary to-transparent z-10"
        aria-hidden="true"
      />

      {/* Poster */}
      <div
        className={cn(
          "relative z-10 w-full aspect-[2/3] rounded-sm overflow-hidden",
          "bg-muted shadow-[0_8px_24px_-4px_rgba(0,0,0,0.7)]"
        )}
      >
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={`${title} poster`}
            fill
            sizes="180px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            priority
          />
        ) : (
          <NoPosterPlaceholder size="lg" />
        )}
      </div>

      {/* Metadata */}
      <div className="relative z-10 flex flex-col justify-center gap-2.5 min-w-0">
        {/* Type + year label */}
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-[0.65rem] font-mono font-bold tracking-[0.12em] uppercase",
            !isTV ? "text-primary" : "text-muted-foreground"
          )}
        >
          {isTV ? <Tv className="size-3" /> : <Film className="size-3" />}
          {year}
          <span className="text-muted-foreground/40 font-normal">·</span>
          {isTV ? "TV Series" : "Film"}
        </span>

        {/* Title */}
        <h3
          className={cn(
            "text-2xl font-bold font-sans leading-tight tracking-tight",
            "text-foreground group-hover:text-white",
            "line-clamp-2 transition-colors duration-150"
          )}
        >
          {title}
        </h3>

        {/* Overview */}
        {result.overview && (
          <p className="text-[0.8125rem] leading-relaxed text-muted-foreground line-clamp-4">
            {result.overview}
          </p>
        )}
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
  const btnActive = "hover:border-primary/50 hover:bg-muted hover:text-foreground hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";
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
      {/* Icon ring */}
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
  // Filter to only movie/tv — exclude person or other types
  const filtered = results.filter(
    (r) => r.media_type === "movie" || r.media_type === "tv"
  );

  if (filtered.length === 0) {
    return <EmptyState query={query} />;
  }

  const [featured, ...rest] = filtered;

  return (
    <>
      <ResultsHeader query={query} count={filtered.length} />

      {/* Featured first result */}
      <FeaturedResult result={featured} />

      {/* Grid of remaining results */}
      {rest.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {rest.map((result) => (
            <ResultCard key={`${result.media_type}-${result.id}`} result={result} />
          ))}
        </div>
      )}

      <Pagination
        query={query}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
}
