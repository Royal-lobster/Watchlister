import { notFound } from "next/navigation";
import Image from "next/image";
import {
  getTmdbDetail,
  getTmdbImageUrl,
  getWatchProviders,
} from "@/lib/tmdb";
import { AddToWatchlistButton } from "@/components/content/add-to-watchlist-button";
import { WatchProviders } from "@/components/content/watch-providers";
import { Badge } from "@/components/ui/badge";
import type { MediaType } from "@/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ContentPageProps {
  params: Promise<{ type: string; id: string }>;
  searchParams: Promise<{ country?: string }>;
}

// ---------------------------------------------------------------------------
// Star rating visual
// ---------------------------------------------------------------------------

function StarRating({ score }: { score: number }) {
  // Convert 0-10 to 0-5
  const stars = score / 2;
  const full = Math.floor(stars);
  const partial = stars - full;
  const empty = 5 - Math.ceil(stars);

  return (
    <span
      className="inline-flex items-center gap-px leading-none"
      aria-label={`Rating: ${score.toFixed(1)} out of 10`}
      role="img"
    >
      {Array.from({ length: full }).map((_, i) => (
        <span key={`f-${i}`} className="text-sm text-amber-400">★</span>
      ))}
      {partial > 0 && (
        <span
          className="relative inline-block text-sm text-border"
          style={{ "--fill": `${partial * 100}%` } as React.CSSProperties}
        >
          <span
            className="absolute top-0 left-0 overflow-hidden text-amber-400 whitespace-nowrap"
            style={{ width: "var(--fill, 50%)" }}
          >
            ★
          </span>
          <span>★</span>
        </span>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`e-${i}`} className="text-sm text-border">★</span>
      ))}
    </span>
  );
}

// ---------------------------------------------------------------------------
// ContentPage
// ---------------------------------------------------------------------------

export default async function ContentPage({
  params,
  searchParams,
}: ContentPageProps) {
  const { type, id } = await params;
  const { country = "US" } = await searchParams;

  if (!["movie", "tv"].includes(type)) notFound();

  const mediaType = type as MediaType;
  const tmdbId = Number(id);
  if (isNaN(tmdbId)) notFound();

  const [detail, providers] = await Promise.all([
    getTmdbDetail(mediaType, tmdbId),
    getWatchProviders(mediaType, tmdbId, country),
  ]);

  const backdropUrl = getTmdbImageUrl(detail.backdrop_path, "w780");
  const posterUrl = getTmdbImageUrl(detail.poster_path, "w500");
  const title = detail.title ?? detail.name ?? "Unknown";
  const year = (detail.release_date ?? detail.first_air_date ?? "").split("-")[0];
  const genres = detail.genres.map((g) => g.name);
  const rating = detail.vote_average.toFixed(1);

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      {/* ------------------------------------------------------------------ */}
      {/* Hero backdrop                                                        */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="relative w-full h-[75vh] min-h-[480px] max-h-[720px]"
        aria-hidden="true"
      >
        <div className="absolute inset-0 overflow-hidden">
          {backdropUrl ? (
            <Image
              src={backdropUrl}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover blur-sm saturate-75 brightness-[0.45] scale-105"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-card" />
          )}
        </div>
        {/* Gradient fade to background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/15 via-background/35 to-background" />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Main content                                                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-24 -mt-96">
        <div className="flex gap-12 items-start flex-col sm:flex-row">
          {/* ---- Poster ---- */}
          <div className="shrink-0 w-56">
            {posterUrl ? (
              <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={posterUrl}
                  alt={`${title} poster`}
                  fill
                  priority
                  sizes="224px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div
                className="w-full aspect-[2/3] rounded-xl bg-card border border-border flex items-center justify-center"
                aria-label="No poster available"
              >
                <svg
                  className="text-muted-foreground opacity-40"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                  <line x1="7" y1="2" x2="7" y2="22" />
                  <line x1="17" y1="2" x2="17" y2="22" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <line x1="2" y1="7" x2="7" y2="7" />
                  <line x1="2" y1="17" x2="7" y2="17" />
                  <line x1="17" y1="17" x2="22" y2="17" />
                  <line x1="17" y1="7" x2="22" y2="7" />
                </svg>
              </div>
            )}
          </div>

          {/* ---- Metadata ---- */}
          <div className="flex-1 min-w-0 pt-12">
            {/* Media type label */}
            <div
              className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-primary mb-3"
              aria-label={`Type: ${mediaType === "movie" ? "Movie" : "TV Series"}`}
            >
              <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
              {mediaType === "movie" ? "Film" : "Series"}
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-tight mb-3">
              {title}
            </h1>

            {/* Year + rating */}
            <span className="block text-[0.5625rem] font-bold tracking-[0.22em] uppercase text-muted-foreground mb-2">
              Details
            </span>
            <div className="flex items-center gap-5 mb-6 flex-wrap">
              {year && (
                <span
                  className="font-mono text-sm text-muted-foreground"
                  aria-label={`Released: ${year}`}
                >
                  {year}
                </span>
              )}
              {year && (
                <span className="w-px h-4 bg-border shrink-0" aria-hidden="true" />
              )}
              <div className="flex items-center gap-2">
                <span className="font-mono text-base text-foreground" aria-hidden="true">
                  {rating}
                </span>
                <StarRating score={detail.vote_average} />
              </div>
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="mb-6">
                <span className="block text-[0.5625rem] font-bold tracking-[0.22em] uppercase text-muted-foreground mb-2">
                  Genres
                </span>
                <div className="flex flex-wrap gap-2" role="list" aria-label="Genres">
                  {genres.map((genre) => (
                    <span key={genre} role="listitem">
                      <Badge variant="secondary">{genre}</Badge>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tagline */}
            {detail.tagline && (
              <p className="italic font-semibold text-muted-foreground border-l-2 border-primary pl-3 mb-3">
                &ldquo;{detail.tagline}&rdquo;
              </p>
            )}

            {/* Overview */}
            {detail.overview && (
              <p className="text-base leading-relaxed text-muted-foreground max-w-[56ch] mb-8">
                {detail.overview}
              </p>
            )}

            {/* CTA */}
            <div className="flex items-center gap-4 flex-wrap">
              <AddToWatchlistButton
                tmdbId={tmdbId}
                mediaType={mediaType}
                title={title}
                genres={genres}
                posterPath={detail.poster_path}
                overview={detail.overview}
                releaseYear={year || undefined}
              />
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Watch providers                                                   */}
        {/* ---------------------------------------------------------------- */}
        {providers && (
          <div className="mt-16 pt-8 border-t border-border">
            <WatchProviders providers={providers} />
          </div>
        )}
      </div>
    </div>
  );
}
