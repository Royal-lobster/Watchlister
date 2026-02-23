"use client";

import { useAction } from "next-safe-action/hooks";
import { addToWatchlistAction } from "@/actions/watchlist";
import { Button } from "@/components/ui/button";
import { Loader2, Check, Plus } from "lucide-react";
import type { MediaType } from "@/types";

interface AddToWatchlistButtonProps {
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  genres: string[];
  posterPath: string | null;
  overview: string;
  releaseYear?: string;
}

export function AddToWatchlistButton(props: AddToWatchlistButtonProps) {
  const { execute, status } = useAction(addToWatchlistAction);
  const isExecuting = status === "executing";
  const hasSucceeded = status === "hasSucceeded";

  return (
    <Button
      onClick={() => {
        if (!isExecuting && !hasSucceeded) execute(props);
      }}
      disabled={isExecuting || hasSucceeded}
      variant={hasSucceeded ? "secondary" : "default"}
      size="lg"
      className="rounded-full min-w-40"
      aria-busy={isExecuting}
    >
      {isExecuting ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Adding...
        </>
      ) : hasSucceeded ? (
        <>
          <Check className="size-4" />
          Added!
        </>
      ) : (
        <>
          <Plus className="size-4" />
          Add to Watchlist
        </>
      )}
    </Button>
  );
}
