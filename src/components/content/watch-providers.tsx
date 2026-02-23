import Image from "next/image";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

interface WatchProvidersProps {
  providers: {
    link: string;
    flatrate?: Provider[];
    rent?: Provider[];
    buy?: Provider[];
  } | null;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TMDB_LOGO_BASE = "https://image.tmdb.org/t/p/w92";

// ---------------------------------------------------------------------------
// ProviderLogo — single logo icon with tooltip
// ---------------------------------------------------------------------------

function ProviderLogo({ provider }: { provider: Provider }) {
  const logoUrl = `${TMDB_LOGO_BASE}${provider.logo_path}`;

  return (
    <>
      <style>{`
        .wp-logo-wrap {
          position: relative;
          display: inline-flex;
          flex-shrink: 0;
        }
        .wp-logo-img {
          width: 40px;
          height: 40px;
          border-radius: 0.5rem;
          border: 1px solid var(--color-border);
          object-fit: cover;
          background-color: var(--color-surface-raised);
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }
        .wp-logo-wrap:hover .wp-logo-img {
          transform: translateY(-2px) scale(1.06);
          border-color: color-mix(in srgb, var(--color-accent) 40%, var(--color-border));
          box-shadow:
            0 4px 12px -2px color-mix(in srgb, var(--color-accent) 20%, transparent),
            0 2px 6px -1px rgb(0 0 0 / 0.5);
        }
        /* Tooltip */
        .wp-logo-tooltip {
          position: absolute;
          bottom: calc(100% + 6px);
          left: 50%;
          transform: translateX(-50%);
          background-color: var(--color-surface-raised);
          border: 1px solid var(--color-border);
          color: var(--color-text-primary);
          font-size: 0.6875rem;
          font-family: var(--font-mono);
          font-weight: 500;
          letter-spacing: 0.02em;
          white-space: nowrap;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          box-shadow: 0 4px 12px -2px rgb(0 0 0 / 0.6);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s ease, transform 0.15s ease;
          transform: translateX(-50%) translateY(4px);
          z-index: 10;
        }
        .wp-logo-wrap:hover .wp-logo-tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      `}</style>

      <span className="wp-logo-wrap">
        <Image
          src={logoUrl}
          alt={provider.provider_name}
          width={40}
          height={40}
          className="wp-logo-img"
          unoptimized
        />
        <span className="wp-logo-tooltip" role="tooltip">
          {provider.provider_name}
        </span>
      </span>
    </>
  );
}

// ---------------------------------------------------------------------------
// ProviderGroup — labeled row of logos
// ---------------------------------------------------------------------------

function ProviderGroup({
  label,
  providers,
}: {
  label: string;
  providers: Provider[];
}) {
  if (!providers || providers.length === 0) return null;

  return (
    <>
      <style>{`
        .wp-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .wp-group-label {
          font-size: 0.625rem;
          font-family: var(--font-mono);
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          min-width: 3.25rem;
          flex-shrink: 0;
          /* Vertical rule separator */
          padding-right: 0.75rem;
          border-right: 1px solid var(--color-border-subtle);
        }
        .wp-group-logos {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
      `}</style>

      <div className="wp-group">
        <span className="wp-group-label" aria-label={`${label} providers`}>
          {label}
        </span>
        <div className="wp-group-logos">
          {providers.map((p) => (
            <ProviderLogo key={p.provider_id} provider={p} />
          ))}
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// WatchProviders — main export
// ---------------------------------------------------------------------------

export function WatchProviders({ providers }: WatchProvidersProps) {
  if (!providers) return null;

  const { link, flatrate, rent, buy } = providers;

  const hasAny =
    (flatrate && flatrate.length > 0) ||
    (rent && rent.length > 0) ||
    (buy && buy.length > 0);

  if (!hasAny) return null;

  return (
    <>
      <style>{`
        .wp-root {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        /* Header row: title + JustWatch attribution link */
        .wp-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .wp-heading {
          font-size: 0.75rem;
          font-family: var(--font-mono);
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-text-secondary);
        }
        .wp-justwatch-link {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.6875rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
          text-decoration: none;
          letter-spacing: 0.04em;
          border-bottom: 1px solid transparent;
          transition: color 0.15s ease, border-color 0.15s ease;
          padding-bottom: 1px;
        }
        .wp-justwatch-link:hover {
          color: var(--color-text-secondary);
          border-bottom-color: var(--color-border);
        }
        .wp-justwatch-link:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 3px;
          border-radius: 2px;
        }

        /* Groups container */
        .wp-groups {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }

        /* Divider between groups */
        .wp-divider {
          height: 1px;
          background-color: var(--color-border-subtle);
          margin: 0.125rem 0;
        }
      `}</style>

      <div className="wp-root" aria-label="Where to watch">
        {/* Header */}
        <div className="wp-header">
          <span className="wp-heading">Where to Watch</span>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="wp-justwatch-link"
            aria-label="View on JustWatch (opens in new tab)"
          >
            via JustWatch
            {/* External link icon */}
            <svg
              width="9"
              height="9"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2 10L10 2M10 2H5M10 2v5" />
            </svg>
          </a>
        </div>

        {/* Provider groups */}
        <div className="wp-groups">
          {flatrate && flatrate.length > 0 && (
            <ProviderGroup label="Stream" providers={flatrate} />
          )}
          {flatrate && flatrate.length > 0 && (rent || buy) && (
            <div className="wp-divider" aria-hidden="true" />
          )}
          {rent && rent.length > 0 && (
            <ProviderGroup label="Rent" providers={rent} />
          )}
          {rent && rent.length > 0 && buy && buy.length > 0 && (
            <div className="wp-divider" aria-hidden="true" />
          )}
          {buy && buy.length > 0 && (
            <ProviderGroup label="Buy" providers={buy} />
          )}
        </div>
      </div>
    </>
  );
}
