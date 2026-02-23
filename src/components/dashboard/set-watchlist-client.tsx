"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { setWatchlistDbAction } from "@/actions/settings";
import { Loader2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Database {
  id: string;
  title: string;
  icon: string | null;
}

interface SetWatchlistClientProps {
  databases: Database[];
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
        className="size-7 rounded-sm object-cover flex-shrink-0 opacity-85"
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

  const initial = title.trim().charAt(0).toUpperCase() || "N";
  return (
    <span
      className="size-7 flex items-center justify-center flex-shrink-0 rounded-sm text-xs font-mono font-semibold tracking-wider bg-muted text-muted-foreground border border-border"
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
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-background">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="mb-10 text-center">
          <span className="block mb-5 text-[10px] font-mono tracking-[0.28em] uppercase text-muted-foreground">
            Step 02 of 03
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Choose your watchlist
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Select the Notion database where you track your watchlist
          </p>
          <div aria-hidden="true" className="mx-auto mt-6 w-12 h-px bg-border" />
        </div>

        {/* Database list */}
        {databases.length === 0 ? (
          <div className="border border-border rounded-lg p-8 text-center text-muted-foreground">
            <p className="text-sm leading-relaxed max-w-[30ch] mx-auto">
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
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-md border border-border bg-card text-left transition-all hover:bg-accent hover:border-ring disabled:opacity-50 disabled:cursor-not-allowed",
                      isLoading && "ring-2 ring-ring"
                    )}
                    disabled={isDisabled}
                    onClick={() => handleSelect(db.id)}
                    aria-label={`Select ${db.title}`}
                    aria-busy={isLoading}
                  >
                    {/* Row number */}
                    <span
                      className="font-mono text-[10px] tabular-nums w-5 flex-shrink-0 text-right text-muted-foreground"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Icon */}
                    <DatabaseIcon icon={db.icon} title={db.title} />

                    {/* Title */}
                    <span
                      className={cn(
                        "flex-1 text-sm font-medium truncate",
                        isLoading ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {db.title}
                    </span>

                    {/* Right side: spinner or chevron */}
                    <span className="flex-shrink-0 flex items-center justify-center text-muted-foreground">
                      {isLoading ? (
                        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <ChevronRight className="size-4 opacity-40" aria-hidden="true" />
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* Footer note */}
        <p className="text-center text-[11px] text-muted-foreground/50 mt-6">
          You can change this at any time in settings
        </p>
      </div>
    </div>
  );
}
