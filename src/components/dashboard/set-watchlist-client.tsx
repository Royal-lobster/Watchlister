"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { setWatchlistDbAction } from "@/actions/settings";
import { Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
        className="size-5 rounded-sm object-cover flex-shrink-0"
      />
    );
  }

  if (isEmoji) {
    return (
      <span className="size-5 flex items-center justify-center text-base leading-none flex-shrink-0 select-none" aria-hidden="true">
        {icon}
      </span>
    );
  }

  const initial = title.trim().charAt(0).toUpperCase() || "N";
  return (
    <span className="size-5 flex items-center justify-center flex-shrink-0 rounded-sm text-xs font-semibold bg-muted text-muted-foreground border border-border" aria-hidden="true">
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-background">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-foreground">Choose your watchlist</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Select the Notion database where you track your watchlist
          </p>
        </div>

        {databases.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              <p className="text-sm">
                No databases found. Make sure you&apos;ve shared at least one
                database with this integration.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-2">
              <ul className="flex flex-col" role="list">
                {databases.map((db) => {
                  const isLoading = pendingId === db.id && isPending;
                  return (
                    <li key={db.id}>
                      <button
                        type="button"
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isPending}
                        onClick={() => handleSelect(db.id)}
                        aria-label={`Select ${db.title}`}
                        aria-busy={isLoading}
                      >
                        <DatabaseIcon icon={db.icon} title={db.title} />
                        <span className="flex-1 text-sm font-medium truncate text-foreground">
                          {db.title}
                        </span>
                        <span className="flex-shrink-0 text-muted-foreground">
                          {isLoading ? (
                            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                          ) : (
                            <ChevronRight className="size-4 opacity-50" aria-hidden="true" />
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        )}

        <p className="text-center text-xs text-muted-foreground mt-4">
          You can change this at any time in settings
        </p>
      </div>
    </div>
  );
}
