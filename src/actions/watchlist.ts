"use server";

import { z } from "zod";
import { dbActionClient } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";

const AddToWatchlistSchema = z.object({
  tmdbId: z.number(),
  mediaType: z.enum(["movie", "tv"]),
  title: z.string().min(1),
  genres: z.array(z.string()),
  posterPath: z.string().nullable(),
  overview: z.string(),
  releaseYear: z.string().optional(),
});

export const addToWatchlistAction = dbActionClient
  .schema(AddToWatchlistSchema)
  .action(async ({ parsedInput, ctx: { notion, dbId } }) => {
    const { title, genres, posterPath, overview, mediaType, tmdbId, releaseYear } = parsedInput;

    await notion.pages.create({
      parent: { database_id: dbId },
      icon: posterPath
        ? { type: "external", external: { url: `https://image.tmdb.org/t/p/w92${posterPath}` } }
        : undefined,
      cover: posterPath
        ? { type: "external", external: { url: `https://image.tmdb.org/t/p/w500${posterPath}` } }
        : undefined,
      properties: {
        Name: { title: [{ text: { content: title } }] },
        Tags: { multi_select: genres.map((g) => ({ name: g })) },
        Type: { select: { name: mediaType === "movie" ? "Movie" : "TV Show" } },
        TMDB_ID: { number: tmdbId },
        Overview: { rich_text: [{ text: { content: overview.slice(0, 2000) } }] },
        ...(releaseYear ? { Year: { rich_text: [{ text: { content: releaseYear } }] } } : {}),
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  });

export const archiveFromWatchlistAction = dbActionClient
  .schema(z.object({ pageId: z.string().min(1) }))
  .action(async ({ parsedInput: { pageId }, ctx: { notion } }) => {
    await notion.pages.update({
      page_id: pageId,
      archived: true,
    });
    revalidatePath("/dashboard");
    return { success: true };
  });
