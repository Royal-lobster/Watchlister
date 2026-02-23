"use client";

import { useAction } from "next-safe-action/hooks";
import { addToWatchlistAction } from "@/actions/watchlist";
import type { MediaType } from "@/types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface AddToWatchlistButtonProps {
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  genres: string[];
  posterPath: string | null;
  overview: string;
  releaseYear?: string;
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`atw-spin ${className ?? ""}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        style={{ opacity: 0.25 }}
      />
      <path
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        style={{ opacity: 0.8 }}
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`atw-check-pop ${className ?? ""}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// AddToWatchlistButton
// ---------------------------------------------------------------------------

export function AddToWatchlistButton(props: AddToWatchlistButtonProps) {
  const { execute, status } = useAction(addToWatchlistAction);

  const isExecuting = status === "executing";
  const hasSucceeded = status === "hasSucceeded";

  const handleClick = () => {
    if (isExecuting || hasSucceeded) return;
    execute(props);
  };

  return (
    <>
      <style>{`
        @keyframes atw-spin-kf {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes atw-check-pop-kf {
          0%   { transform: scale(0.5); opacity: 0; }
          60%  { transform: scale(1.25); opacity: 1; }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes atw-label-in-kf {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .atw-spin {
          animation: atw-spin-kf 0.8s linear infinite;
        }
        .atw-check-pop {
          animation: atw-check-pop-kf 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .atw-label {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          animation: atw-label-in-kf 0.2s ease forwards;
        }

        /* Root button */
        .atw-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          /* Pill shape */
          border-radius: 9999px;
          /* Large size */
          height: 3rem;
          padding: 0 2rem;
          min-width: 10rem;
          /* Typography */
          font-family: var(--font-sans);
          font-size: 0.9375rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          white-space: nowrap;
          /* Interaction */
          cursor: pointer;
          user-select: none;
          border: none;
          outline: none;
          /* Transitions */
          transition:
            background-color 0.3s ease,
            box-shadow 0.3s ease,
            transform 0.15s ease,
            color 0.3s ease;
        }

        /* Focus ring */
        .atw-btn:focus-visible {
          box-shadow:
            0 0 0 2px var(--color-background),
            0 0 0 4px var(--color-accent);
        }

        /* Idle — red primary */
        .atw-btn--idle {
          background-color: var(--color-accent);
          color: #ffffff;
          box-shadow:
            0 1px 3px 0 rgb(0 0 0 / 0.4),
            0 0 0 0 color-mix(in srgb, var(--color-accent) 0%, transparent);
        }
        .atw-btn--idle:hover {
          background-color: var(--color-accent-hover);
          box-shadow:
            0 4px 16px -2px color-mix(in srgb, var(--color-accent) 45%, transparent),
            0 1px 4px 0 rgb(0 0 0 / 0.5);
          transform: translateY(-1px);
        }
        .atw-btn--idle:active {
          transform: scale(0.97) translateY(0);
          box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.4);
        }

        /* Executing — muted red, non-interactive */
        .atw-btn--executing {
          background-color: color-mix(in srgb, var(--color-accent) 70%, var(--color-surface));
          color: rgba(255, 255, 255, 0.75);
          cursor: not-allowed;
          box-shadow: none;
        }

        /* Success — calm green, disabled */
        .atw-btn--success {
          background-color: #1a3d2b;
          color: #4ade80;
          cursor: default;
          pointer-events: none;
          box-shadow:
            0 0 0 1px color-mix(in srgb, #4ade80 20%, transparent),
            inset 0 0 0 1px color-mix(in srgb, #4ade80 12%, transparent);
        }
      `}</style>

      <button
        type="button"
        onClick={handleClick}
        disabled={isExecuting || hasSucceeded}
        aria-busy={isExecuting}
        aria-label={
          hasSucceeded
            ? `${props.title} added to watchlist`
            : isExecuting
            ? `Adding ${props.title} to watchlist`
            : `Add ${props.title} to watchlist`
        }
        className={[
          "atw-btn",
          hasSucceeded
            ? "atw-btn--success"
            : isExecuting
            ? "atw-btn--executing"
            : "atw-btn--idle",
        ].join(" ")}
      >
        {isExecuting ? (
          <span className="atw-label" key="executing">
            <SpinnerIcon className="size-4" />
            Adding...
          </span>
        ) : hasSucceeded ? (
          <span className="atw-label" key="success">
            <CheckIcon className="size-4" />
            Added!
          </span>
        ) : (
          <span className="atw-label" key="idle">
            <PlusIcon className="size-4" />
            Add to Watchlist
          </span>
        )}
      </button>
    </>
  );
}
