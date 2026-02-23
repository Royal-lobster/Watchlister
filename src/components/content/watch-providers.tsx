import Image from "next/image";
import { Separator } from "@/components/ui/separator";

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
    <span className="relative inline-flex shrink-0 group">
      <Image
        src={logoUrl}
        alt={provider.provider_name}
        width={40}
        height={40}
        className="w-10 h-10 rounded-lg border border-border object-cover bg-card transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:border-primary/40 group-hover:shadow-lg"
        unoptimized
      />
      {/* Tooltip */}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150 z-10 whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-[0.6875rem] font-medium tracking-wide text-foreground shadow-md"
      >
        {provider.provider_name}
      </span>
    </span>
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
    <div className="flex items-center gap-3">
      <span
        className="shrink-0 min-w-[3.25rem] pr-3 border-r border-border text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground"
        aria-label={`${label} providers`}
      >
        {label}
      </span>
      <div className="flex items-center gap-2 flex-wrap">
        {providers.map((p) => (
          <ProviderLogo key={p.provider_id} provider={p} />
        ))}
      </div>
    </div>
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
    <div className="flex flex-col gap-3" aria-label="Where to watch">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Where to Watch
        </span>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View on JustWatch (opens in new tab)"
          className="inline-flex items-center gap-1 text-[0.6875rem] tracking-wide text-muted-foreground border-b border-transparent hover:text-foreground hover:border-border transition-colors duration-150 pb-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          via JustWatch
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
      <div className="flex flex-col gap-2.5">
        {flatrate && flatrate.length > 0 && (
          <ProviderGroup label="Stream" providers={flatrate} />
        )}
        {flatrate && flatrate.length > 0 && (rent || buy) && (
          <Separator className="my-0.5" />
        )}
        {rent && rent.length > 0 && (
          <ProviderGroup label="Rent" providers={rent} />
        )}
        {rent && rent.length > 0 && buy && buy.length > 0 && (
          <Separator className="my-0.5" />
        )}
        {buy && buy.length > 0 && (
          <ProviderGroup label="Buy" providers={buy} />
        )}
      </div>
    </div>
  );
}
