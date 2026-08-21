import Image from "next/image";
import { Separator } from "@/components/ui/separator";

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

const TMDB_LOGO_BASE = "https://image.tmdb.org/t/p/w92";

function ProviderLogo({ provider }: { provider: Provider }) {
  const logoUrl = `${TMDB_LOGO_BASE}${provider.logo_path}`;

  return (
    <Image
      src={logoUrl}
      alt={provider.provider_name}
      width={36}
      height={36}
      className="w-9 h-9 rounded-md border border-border object-cover bg-card"
      unoptimized
      title={provider.provider_name}
    />
  );
}

function ProviderGroup({ label, providers }: { label: string; providers: Provider[] }) {
  if (!providers || providers.length === 0) return null;

  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0 w-12 text-xs text-muted-foreground">
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

export function WatchProviders({ providers }: WatchProvidersProps) {
  if (!providers) return null;

  const { link, flatrate, rent, buy } = providers;

  const hasAny =
    (flatrate && flatrate.length > 0) ||
    (rent && rent.length > 0) ||
    (buy && buy.length > 0);

  if (!hasAny) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Where to Watch</p>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          aria-label="View on JustWatch (opens in new tab)"
        >
          via JustWatch ↗
        </a>
      </div>

      <div className="flex flex-col gap-2">
        {flatrate && flatrate.length > 0 && (
          <ProviderGroup label="Stream" providers={flatrate} />
        )}
        {flatrate && flatrate.length > 0 && (rent || buy) && (
          <Separator />
        )}
        {rent && rent.length > 0 && (
          <ProviderGroup label="Rent" providers={rent} />
        )}
        {rent && rent.length > 0 && buy && buy.length > 0 && (
          <Separator />
        )}
        {buy && buy.length > 0 && (
          <ProviderGroup label="Buy" providers={buy} />
        )}
      </div>
    </div>
  );
}
