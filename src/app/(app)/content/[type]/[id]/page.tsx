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
import { Separator } from "@/components/ui/separator";
import type { MediaType } from "@/types";

interface ContentPageProps {
  params: Promise<{ type: string; id: string }>;
  searchParams: Promise<{ country?: string }>;
}

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

  const posterUrl = getTmdbImageUrl(detail.poster_path, "w500");
  const title = detail.title ?? detail.name ?? "Unknown";
  const year = (detail.release_date ?? detail.first_air_date ?? "").split("-")[0];
  const genres = detail.genres.map((g) => g.name);
  const rating = detail.vote_average.toFixed(1);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex gap-8 items-start flex-col sm:flex-row">
        {/* Poster */}
        <div className="shrink-0 w-48">
          {posterUrl ? (
            <div className="relative w-full aspect-[2/3] rounded-md overflow-hidden border border-border">
              <Image
                src={posterUrl}
                alt={`${title} poster`}
                fill
                priority
                sizes="192px"
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-full aspect-[2/3] rounded-md bg-muted border border-border flex items-center justify-center">
              <span className="text-muted-foreground text-sm">No poster</span>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="flex-1 min-w-0">
          <Badge variant="secondary" className="mb-3">
            {mediaType === "movie" ? "Movie" : "TV Series"}
          </Badge>

          <h1 className="text-3xl font-bold text-foreground leading-tight mb-2">
            {title}
          </h1>

          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
            {year && <span>{year}</span>}
            {year && <span>·</span>}
            <span>{rating} / 10</span>
          </div>

          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {genres.map((genre) => (
                <Badge key={genre} variant="outline">{genre}</Badge>
              ))}
            </div>
          )}

          {detail.tagline && (
            <p className="text-sm italic text-muted-foreground mb-3">
              &ldquo;{detail.tagline}&rdquo;
            </p>
          )}

          {detail.overview && (
            <p className="text-sm leading-relaxed text-muted-foreground mb-6">
              {detail.overview}
            </p>
          )}

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

      {providers && (
        <>
          <Separator className="my-8" />
          <WatchProviders providers={providers} />
        </>
      )}
    </div>
  );
}
