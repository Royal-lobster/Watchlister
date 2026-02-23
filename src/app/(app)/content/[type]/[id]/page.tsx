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
      className="sr-stars"
      aria-label={`Rating: ${score.toFixed(1)} out of 10`}
      role="img"
    >
      {Array.from({ length: full }).map((_, i) => (
        <span key={`f-${i}`} className="sr-star sr-star--full">★</span>
      ))}
      {partial > 0 && (
        <span className="sr-star sr-star--partial" style={{ "--fill": `${partial * 100}%` } as React.CSSProperties}>
          <span className="sr-star-fill">★</span>
          <span className="sr-star-empty">★</span>
        </span>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`e-${i}`} className="sr-star sr-star--empty">★</span>
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
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Styles                                                               */}
      {/* ------------------------------------------------------------------ */}
      <style>{`
        /* ---- Layout shell ---- */
        .cdp-root {
          position: relative;
          min-height: 100vh;
          background-color: var(--color-background);
          overflow-x: hidden;
        }

        /* ---- Hero backdrop ---- */
        .cdp-hero {
          position: relative;
          width: 100%;
          height: 75vh;
          min-height: 480px;
          max-height: 720px;
        }

        .cdp-backdrop {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .cdp-backdrop-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 20%;
          filter: blur(3px) saturate(0.75) brightness(0.45);
          transform: scale(1.05); /* bleed past edges so blur fringing is hidden */
          transition: filter 0.6s ease;
        }

        /* Cinematic gradient — opaque at bottom so content reads cleanly */
        .cdp-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(11, 11, 15, 0.15) 0%,
            rgba(11, 11, 15, 0.35) 40%,
            rgba(11, 11, 15, 0.85) 75%,
            rgba(11, 11, 15, 1)   100%
          );
        }

        /* Subtle vignette on sides */
        .cdp-hero-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse 120% 100% at 50% 0%,
            transparent 40%,
            rgba(11, 11, 15, 0.6) 100%
          );
          pointer-events: none;
        }

        /* ---- Main content card that overlaps the hero ---- */
        .cdp-content {
          position: relative;
          z-index: 10;
          max-width: 64rem;
          margin: 0 auto;
          padding: 0 1.5rem 6rem;
          /* Pull content up so poster overlaps the hero */
          margin-top: -26rem;
        }

        /* ---- Two-column layout: poster + metadata ---- */
        .cdp-inner {
          display: flex;
          gap: 3rem;
          align-items: flex-start;
        }

        /* ---- Poster ---- */
        .cdp-poster-wrap {
          position: relative;
          flex-shrink: 0;
          width: 14rem;
        }

        .cdp-poster-frame {
          position: relative;
          width: 14rem;
          aspect-ratio: 2 / 3;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow:
            0 32px 64px -12px rgba(0, 0, 0, 0.9),
            0 8px 24px -4px rgba(0, 0, 0, 0.7),
            0 0 0 1px rgba(255, 255, 255, 0.06);
        }

        .cdp-poster-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        .cdp-poster-frame:hover .cdp-poster-img {
          transform: scale(1.03);
        }

        /* Subtle accent glow under poster */
        .cdp-poster-glow {
          position: absolute;
          bottom: -1.5rem;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 2rem;
          background: radial-gradient(
            ellipse at 50% 100%,
            color-mix(in srgb, var(--color-accent) 22%, transparent),
            transparent 70%
          );
          filter: blur(8px);
          pointer-events: none;
        }

        /* Fallback no-poster placeholder */
        .cdp-poster-fallback {
          width: 14rem;
          aspect-ratio: 2 / 3;
          border-radius: 0.75rem;
          background: linear-gradient(
            135deg,
            var(--color-surface) 0%,
            var(--color-surface-raised) 100%
          );
          border: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.9);
        }

        .cdp-poster-fallback-icon {
          color: var(--color-text-muted);
          opacity: 0.4;
        }

        /* ---- Right column: metadata ---- */
        .cdp-meta {
          flex: 1;
          min-width: 0;
          padding-top: 3rem;
        }

        /* Media type label */
        .cdp-media-label {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-sans), ui-sans-serif, sans-serif;
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--color-accent);
          margin-bottom: 1rem;
        }

        .cdp-media-label-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: var(--color-accent);
          flex-shrink: 0;
        }

        /* Title */
        .cdp-title {
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(2rem, 5vw, 3.25rem);
          font-weight: 900;
          line-height: 1.1;
          color: var(--color-text-primary);
          letter-spacing: -0.02em;
          margin: 0 0 1rem;
          /* Prevent title from being too wide */
          max-width: 36ch;
        }

        /* Year + rating row */
        .cdp-vitals {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .cdp-year {
          font-family: var(--font-mono);
          font-size: 0.875rem;
          font-weight: 400;
          color: var(--color-text-secondary);
          letter-spacing: 0.04em;
        }

        .cdp-vitals-sep {
          width: 1px;
          height: 1rem;
          background-color: var(--color-border);
          flex-shrink: 0;
        }

        .cdp-rating-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .cdp-rating-score {
          font-family: var(--font-mono);
          font-size: 1rem;
          font-weight: 500;
          color: var(--color-text-primary);
          letter-spacing: 0.02em;
        }

        /* Star rating */
        .sr-stars {
          display: inline-flex;
          align-items: center;
          gap: 1px;
          line-height: 1;
        }

        .sr-star {
          font-size: 0.875rem;
          line-height: 1;
        }

        .sr-star--full {
          color: #f59e0b;
        }

        .sr-star--empty {
          color: var(--color-border);
        }

        .sr-star--partial {
          position: relative;
          display: inline-block;
          color: var(--color-border);
        }

        .sr-star-fill {
          position: absolute;
          top: 0;
          left: 0;
          overflow: hidden;
          width: var(--fill, 50%);
          color: #f59e0b;
          white-space: nowrap;
        }

        .sr-star-empty {
          visibility: visible;
        }

        /* Genres */
        .cdp-genres-section {
          margin-bottom: 1.5rem;
        }
        .cdp-section-label {
          display: block;
          font-family: var(--font-sans), ui-sans-serif, sans-serif;
          font-size: 0.5625rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          margin-bottom: 0.625rem;
        }
        .cdp-genres {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        /* Tagline */
        .cdp-tagline {
          font-family: var(--font-display), Georgia, serif;
          font-style: italic;
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-text-muted);
          margin-bottom: 1rem;
          line-height: 1.4;
          max-width: 52ch;
          padding-left: 0.875rem;
          border-left: 2px solid var(--color-accent);
        }

        /* Overview */
        .cdp-overview {
          font-size: 1rem;
          line-height: 1.85;
          color: var(--color-text-secondary);
          max-width: 56ch;
          margin-bottom: 2.5rem;
        }

        /* Actions row */
        .cdp-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        /* ---- Watch providers section ---- */
        .cdp-providers-section {
          margin-top: 4rem;
          padding-top: 2.5rem;
          border-top: 1px solid var(--color-border);
        }

        /* ---- Responsive ---- */
        @media (max-width: 720px) {
          .cdp-content {
            margin-top: -18rem;
            padding: 0 1rem 4rem;
          }

          .cdp-inner {
            flex-direction: column;
            align-items: center;
            gap: 1.75rem;
          }

          .cdp-poster-wrap {
            width: 11rem;
          }

          .cdp-poster-frame {
            width: 11rem;
          }

          .cdp-poster-fallback {
            width: 11rem;
          }

          .cdp-meta {
            padding-top: 0;
            width: 100%;
          }

          .cdp-title {
            font-size: clamp(1.75rem, 7vw, 2.5rem);
          }
        }

        @media (max-width: 480px) {
          .cdp-hero {
            height: 55vh;
            min-height: 360px;
          }
        }

        /* ---- Entry animation ---- */
        @keyframes cdp-fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .cdp-poster-wrap {
          animation: cdp-fade-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
        }

        .cdp-media-label {
          animation: cdp-fade-up 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
        }

        .cdp-title {
          animation: cdp-fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.25s both;
        }

        .cdp-vitals {
          animation: cdp-fade-up 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.32s both;
        }

        .cdp-genres-section {
          animation: cdp-fade-up 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.38s both;
        }

        .cdp-tagline {
          animation: cdp-fade-up 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.43s both;
        }

        .cdp-overview {
          animation: cdp-fade-up 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.48s both;
        }

        .cdp-actions {
          animation: cdp-fade-up 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.54s both;
        }

        .cdp-providers-section {
          animation: cdp-fade-up 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.62s both;
        }
      `}</style>

      <div className="cdp-root">
        {/* ---------------------------------------------------------------- */}
        {/* Hero backdrop                                                     */}
        {/* ---------------------------------------------------------------- */}
        <div className="cdp-hero" aria-hidden="true">
          <div className="cdp-backdrop">
            {backdropUrl ? (
              <Image
                src={backdropUrl}
                alt=""
                fill
                priority
                sizes="100vw"
                className="cdp-backdrop-img"
                unoptimized
              />
            ) : (
              /* Fallback gradient when no backdrop */
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, #12121A 0%, #0E0E14 50%, #0a0a0a 100%)",
                }}
              />
            )}
          </div>
          <div className="cdp-hero-overlay" />
          <div className="cdp-hero-vignette" />
          {/* Film grain on hero */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 w-full h-full"
            style={{ opacity: 0.04, zIndex: 2 }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <filter id="hero-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#hero-grain)" />
          </svg>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Main content                                                      */}
        {/* ---------------------------------------------------------------- */}
        <div className="cdp-content">
          <div className="cdp-inner">
            {/* ---- Poster ---- */}
            <div className="cdp-poster-wrap">
              {posterUrl ? (
                <div className="cdp-poster-frame">
                  <Image
                    src={posterUrl}
                    alt={`${title} poster`}
                    fill
                    priority
                    sizes="224px"
                    className="cdp-poster-img"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="cdp-poster-fallback" aria-label="No poster available">
                  <svg
                    className="cdp-poster-fallback-icon"
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
              <div className="cdp-poster-glow" aria-hidden="true" />
            </div>

            {/* ---- Metadata ---- */}
            <div className="cdp-meta">
              {/* Media type label */}
              <div className="cdp-media-label" aria-label={`Type: ${mediaType === "movie" ? "Movie" : "TV Series"}`}>
                <span className="cdp-media-label-dot" aria-hidden="true" />
                {mediaType === "movie" ? "Film" : "Series"}
              </div>

              {/* Title */}
              <h1 className="cdp-title">{title}</h1>

              {/* Year + rating */}
              <span className="cdp-section-label">Details</span>
              <div className="cdp-vitals">
                {year && (
                  <span className="cdp-year" aria-label={`Released: ${year}`}>
                    {year}
                  </span>
                )}
                {year && (
                  <span className="cdp-vitals-sep" aria-hidden="true" />
                )}
                <div className="cdp-rating-wrap">
                  <span className="cdp-rating-score" aria-hidden="true">
                    {rating}
                  </span>
                  <StarRating score={detail.vote_average} />
                </div>
              </div>

              {/* Genres */}
              {genres.length > 0 && (
                <div className="cdp-genres-section">
                  <span className="cdp-section-label">Genres</span>
                  <div className="cdp-genres" role="list" aria-label="Genres">
                    {genres.map((genre) => (
                      <span key={genre} role="listitem">
                        <Badge variant="muted">{genre}</Badge>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tagline */}
              {detail.tagline && (
                <p className="cdp-tagline">&ldquo;{detail.tagline}&rdquo;</p>
              )}

              {/* Overview */}
              {detail.overview && (
                <p className="cdp-overview">{detail.overview}</p>
              )}

              {/* CTA */}
              <div className="cdp-actions">
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

          {/* -------------------------------------------------------------- */}
          {/* Watch providers                                                  */}
          {/* -------------------------------------------------------------- */}
          {providers && (
            <div className="cdp-providers-section">
              <WatchProviders providers={providers} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
