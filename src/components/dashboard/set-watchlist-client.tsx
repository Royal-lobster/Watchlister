"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { setWatchlistDbAction } from "@/actions/settings";

interface Database {
  id: string;
  title: string;
  icon: string | null;
}

interface SetWatchlistClientProps {
  databases: Database[];
}

function Spinner() {
  return (
    <svg
      className="animate-spin size-4 flex-shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function DatabaseIcon({ icon, title }: { icon: string | null; title: string }) {
  const isUrl =
    icon !== null && (icon.startsWith("http://") || icon.startsWith("https://"));
  const isEmoji = icon !== null && !isUrl;

  if (isUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={icon}
        alt=""
        aria-hidden="true"
        className="size-7 rounded-sm object-cover flex-shrink-0"
        style={{ opacity: 0.85 }}
      />
    );
  }

  if (isEmoji) {
    return (
      <span
        className="size-7 flex items-center justify-center text-xl leading-none flex-shrink-0 select-none"
        aria-hidden="true"
      >
        {icon}
      </span>
    );
  }

  // Default: subtle initial monogram
  const initial = title.trim().charAt(0).toUpperCase() || "N";
  return (
    <span
      className="size-7 flex items-center justify-center flex-shrink-0 rounded-sm text-xs font-mono font-semibold tracking-wider"
      style={{
        backgroundColor: "var(--color-surface-raised)",
        color: "var(--color-text-muted)",
        border: "1px solid var(--color-border)",
      }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

export function SetWatchlistClient({ databases }: SetWatchlistClientProps) {
  const [pendingId, setPendingId] = useState<string | null>(null);

  const { execute, isPending } = useAction(setWatchlistDbAction, {
    onError: () => setPendingId(null),
  });

  function handleSelect(id: string) {
    if (isPending) return;
    setPendingId(id);
    execute({ databaseId: id });
  }

  return (
    <div
      className="set-watchlist-root relative min-h-screen flex flex-col items-center justify-center px-4 py-16 overflow-hidden"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      {/* Scoped styles */}
      <style>{`
        .set-watchlist-root .db-row {
          position: relative;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1.25rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background-color: var(--color-surface);
          cursor: pointer;
          transition: border-color 0.18s ease, background-color 0.18s ease, transform 0.18s ease;
          overflow: hidden;
          width: 100%;
          text-align: left;
        }
        .set-watchlist-root .db-row::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background-color: var(--color-accent);
          opacity: 0;
          transition: opacity 0.18s ease;
          border-radius: var(--radius-md) 0 0 var(--radius-md);
        }
        .set-watchlist-root .db-row:hover:not(:disabled) {
          border-color: color-mix(in srgb, var(--color-accent) 35%, var(--color-border));
          background-color: var(--color-surface-hover);
          transform: translateX(2px);
        }
        .set-watchlist-root .db-row:hover:not(:disabled)::before {
          opacity: 1;
        }
        .set-watchlist-root .db-row:focus-visible {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-accent) 25%, transparent);
        }
        .set-watchlist-root .db-row:active:not(:disabled) {
          transform: translateX(1px) scale(0.995);
        }
        .set-watchlist-root .db-row:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
        .set-watchlist-root .db-row--loading {
          border-color: color-mix(in srgb, var(--color-accent) 50%, var(--color-border)) !important;
          background-color: var(--color-accent-subtle) !important;
        }
        .set-watchlist-root .db-row--loading::before {
          opacity: 1 !important;
        }
      `}</style>

      {/* Atmospheric radial backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 40%, #111111 0%, #0a0a0a 60%, #050505 100%)",
        }}
      />

      {/* Top accent hairline */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--color-accent) 50%, transparent 100%)",
          opacity: 0.35,
        }}
      />

      {/* Grain texture */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full"
        style={{ opacity: 0.03 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="swc-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#swc-grain)" />
      </svg>

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg">

        {/* Header */}
        <div className="mb-10 text-center">
          <span
            className="block mb-5 text-[10px] font-mono tracking-[0.28em] uppercase"
            style={{ color: "var(--color-text-muted)" }}
          >
            Step 02 of 03
          </span>
          <h1
            className="text-3xl font-bold tracking-tight leading-none"
            style={{ color: "var(--color-text-primary)" }}
          >
            Choose your watchlist
          </h1>
          <p
            className="mt-3 text-sm leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Select the Notion database where you track your watchlist
          </p>

          {/* Divider */}
          <div
            aria-hidden="true"
            className="mx-auto mt-8 w-12 h-px"
            style={{ backgroundColor: "var(--color-border)" }}
          />
        </div>

        {/* Database list */}
        {databases.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-(--radius-lg) border"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-surface)",
            }}
          >
            <div
              className="mb-4 size-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--color-surface-raised)" }}
              aria-hidden="true"
            >
              <svg
                className="size-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                style={{ color: "var(--color-text-muted)" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                />
              </svg>
            </div>
            <p
              className="text-sm leading-relaxed max-w-[30ch]"
              style={{ color: "var(--color-text-muted)" }}
            >
              No databases found. Make sure you&apos;ve shared at least one
              database with this integration.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2" role="list">
            {databases.map((db, index) => {
              const isLoading = pendingId === db.id && isPending;
              const isDisabled = isPending;

              return (
                <li key={db.id}>
                  <button
                    type="button"
                    className={[
                      "db-row",
                      isLoading ? "db-row--loading" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    disabled={isDisabled}
                    onClick={() => handleSelect(db.id)}
                    aria-label={`Select ${db.title}`}
                    aria-busy={isLoading}
                  >
                    {/* Row number */}
                    <span
                      className="font-mono text-[10px] tabular-nums w-5 flex-shrink-0 text-right"
                      style={{
                        color: isLoading
                          ? "var(--color-accent)"
                          : "var(--color-text-muted)",
                        opacity: isLoading ? 1 : 0.5,
                        transition: "color 0.18s ease, opacity 0.18s ease",
                      }}
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Icon */}
                    <DatabaseIcon icon={db.icon} title={db.title} />

                    {/* Title */}
                    <span
                      className="flex-1 text-sm font-medium truncate"
                      style={{
                        color: isLoading
                          ? "var(--color-text-primary)"
                          : "var(--color-text-secondary)",
                        transition: "color 0.18s ease",
                      }}
                    >
                      {db.title}
                    </span>

                    {/* Right side: spinner or chevron */}
                    <span
                      className="flex-shrink-0 flex items-center justify-center"
                      style={{
                        color: isLoading
                          ? "var(--color-accent)"
                          : "var(--color-text-muted)",
                        opacity: isLoading ? 1 : 0.4,
                        transition: "color 0.18s ease, opacity 0.18s ease",
                      }}
                    >
                      {isLoading ? (
                        <Spinner />
                      ) : (
                        <svg
                          className="size-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* Footer note */}
        <p
          className="mt-8 text-center text-[11px] font-mono tracking-wide"
          style={{ color: "var(--color-text-muted)", opacity: 0.5 }}
        >
          You can change this at any time in settings
        </p>
      </div>

      {/* Bottom hairline */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--color-border) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}
