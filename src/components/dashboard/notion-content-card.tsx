"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useAction } from "next-safe-action/hooks";
import { archiveFromWatchlistAction } from "@/actions/watchlist";
import { Badge } from "@/components/ui";

interface NotionContentCardProps {
  pageId: string;
  title: string;
  genres: string[];
  mediaType: "Movie" | "TV Show";
  posterUrl: string | null;
  notionUrl: string;
  onArchive?: (pageId: string) => void;
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function FilmIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M1 4.75A.75.75 0 011.75 4h.5a.75.75 0 010 1.5h-.5A.75.75 0 011 4.75zm0 4.167a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zm0 4.166a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zM16.25 4a.75.75 0 00-.75.75v10.5a.75.75 0 001.5 0V4.75a.75.75 0 00-.75-.75zm1.25.75a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zm0 4.167a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zm0 4.166a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zM3.25 3A2.25 2.25 0 001 5.25v9.5A2.25 2.25 0 003.25 17h13.5A2.25 2.25 0 0019 14.75v-9.5A2.25 2.25 0 0016.75 3H3.25zm.75 2.5a.75.75 0 000 1.5h12a.75.75 0 000-1.5H4zm0 4a.75.75 0 000 1.5h12a.75.75 0 000-1.5H4zm0 4a.75.75 0 000 1.5h12a.75.75 0 000-1.5H4z"
        clipRule="evenodd"
      />
    </svg>
  );
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
  const [isHovered, setIsHovered] = useState(false);
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
    <>
      {/* Scoped styles — injected once per component tree render */}
      <style>{`
        .ncc-root {
          position: relative;
          cursor: pointer;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--color-border);
          background-color: var(--color-surface);
          transition:
            border-color 0.22s ease,
            box-shadow 0.22s ease,
            transform 0.22s ease;
          outline: none;
        }
        .ncc-root:hover {
          border-color: color-mix(in srgb, var(--color-accent) 40%, var(--color-border));
          box-shadow:
            0 0 0 1px color-mix(in srgb, var(--color-accent) 12%, transparent),
            0 8px 32px -8px color-mix(in srgb, var(--color-accent) 18%, transparent),
            0 2px 8px -2px rgb(0 0 0 / 0.6);
          transform: translateY(-2px);
        }
        .ncc-root:focus-visible {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-accent) 30%, transparent);
        }
        .ncc-poster-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 2 / 3;
          overflow: hidden;
          background-color: var(--color-surface-raised);
        }
        .ncc-poster-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 45%,
            color-mix(in srgb, var(--color-surface) 30%, transparent) 70%,
            var(--color-surface) 100%
          );
          z-index: 1;
        }
        .ncc-archive-btn {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border-radius: var(--radius-md);
          border: 1px solid color-mix(in srgb, var(--color-border) 80%, transparent);
          background-color: color-mix(in srgb, var(--color-background) 85%, transparent);
          color: var(--color-text-muted);
          cursor: pointer;
          transition:
            opacity 0.18s ease,
            background-color 0.18s ease,
            border-color 0.18s ease,
            color 0.18s ease,
            transform 0.18s ease;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        .ncc-archive-btn:hover {
          background-color: color-mix(in srgb, var(--color-accent) 15%, var(--color-background));
          border-color: color-mix(in srgb, var(--color-accent) 50%, var(--color-border));
          color: var(--color-accent);
          transform: scale(1.05);
        }
        .ncc-archive-btn:active {
          transform: scale(0.95);
        }
        .ncc-archive-btn--archiving {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .ncc-type-pill {
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
          z-index: 3;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.2rem 0.5rem 0.2rem 0.375rem;
          border-radius: var(--radius-sm);
          border: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
          background-color: color-mix(in srgb, var(--color-background) 82%, transparent);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          font-size: 0.625rem;
          font-family: var(--font-mono);
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          white-space: nowrap;
          transition: opacity 0.18s ease;
        }
        .ncc-body {
          padding: 0.625rem 0.75rem 0.75rem;
        }
        .ncc-title {
          font-size: 0.8125rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          line-height: 1.35;
          color: var(--color-text-primary);
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          transition: color 0.18s ease;
          margin-bottom: 0.4rem;
        }
        .ncc-root:hover .ncc-title {
          color: #ffffff;
        }
        .ncc-genres {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
          min-height: 1.25rem;
        }
        /* Accent stripe at bottom, revealed on hover */
        .ncc-accent-stripe {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            var(--color-accent) 0%,
            color-mix(in srgb, var(--color-accent) 50%, transparent) 100%
          );
          opacity: 0;
          transition: opacity 0.22s ease;
        }
        .ncc-root:hover .ncc-accent-stripe {
          opacity: 1;
        }
      `}</style>

      <div
        className="ncc-root"
        role="button"
        tabIndex={0}
        aria-label={`Open ${title} in Notion`}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Poster area */}
        <div className="ncc-poster-wrap">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={`${title} poster`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover transition-transform duration-500"
              style={{ transform: isHovered ? "scale(1.04)" : "scale(1)" }}
              priority={false}
            />
          ) : (
            /* Placeholder when no poster */
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-2"
              style={{ backgroundColor: "var(--color-surface-raised)" }}
            >
              <FilmIcon className="size-8" style={{ color: "var(--color-text-muted)" }} />
              <span
                className="text-[10px] font-mono tracking-wider uppercase"
                style={{ color: "var(--color-text-muted)" }}
              >
                No poster
              </span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="ncc-poster-overlay" aria-hidden="true" />

          {/* Type pill — top-left */}
          <span
            className="ncc-type-pill"
            style={{
              color: isTV ? "var(--color-text-secondary)" : "var(--color-accent)",
              borderColor: isTV
                ? "color-mix(in srgb, var(--color-border) 70%, transparent)"
                : "color-mix(in srgb, var(--color-accent) 35%, transparent)",
            }}
          >
            {isTV ? (
              /* TV icon */
              <svg className="size-2.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M2.5 2A1.5 1.5 0 001 3.5v7A1.5 1.5 0 002.5 12h11a1.5 1.5 0 001.5-1.5v-7A1.5 1.5 0 0013.5 2h-11zm0 9.5h11a.5.5 0 00.5-.5v-7a.5.5 0 00-.5-.5h-11a.5.5 0 00-.5.5v7a.5.5 0 00.5.5zM5.5 13a.5.5 0 000 1h5a.5.5 0 000-1h-5z" />
              </svg>
            ) : (
              /* Film icon */
              <svg className="size-2.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M0 1a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H1a1 1 0 01-1-1V1zm0 5.5a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zm13 0a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zM0 9a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H1a1 1 0 01-1-1V9zm0 4.5a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zm13 0a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5z" />
              </svg>
            )}
            {mediaType}
          </span>

          {/* Archive button — top-right, visible on hover */}
          <button
            type="button"
            className={[
              "ncc-archive-btn",
              archiving ? "ncc-archive-btn--archiving" : "",
              isHovered || archiving ? "opacity-100" : "opacity-0",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={handleArchive}
            disabled={archiving}
            aria-label={`Remove ${title} from watchlist`}
            aria-busy={archiving}
          >
            {archiving ? (
              <svg
                className="size-3.5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              <TrashIcon className="size-3.5" />
            )}
          </button>
        </div>

        {/* Body */}
        <div className="ncc-body">
          <p className="ncc-title">{title}</p>
          <div className="ncc-genres">
            {genres.slice(0, 3).map((genre) => (
              <Badge key={genre} variant="muted">
                {genre}
              </Badge>
            ))}
            {genres.length > 3 && (
              <Badge variant="muted">+{genres.length - 3}</Badge>
            )}
          </div>
        </div>

        {/* Hover accent stripe */}
        <div className="ncc-accent-stripe" aria-hidden="true" />
      </div>
    </>
  );
}
