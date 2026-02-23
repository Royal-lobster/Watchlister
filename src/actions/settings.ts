"use server";

import { z } from "zod";
import { authActionClient } from "@/lib/safe-action";
import { cookies } from "next/headers";
import { DB_COOKIE } from "@/lib/auth";
import { redirect } from "next/navigation";

export const setWatchlistDbAction = authActionClient
  .schema(z.object({ databaseId: z.string().min(1) }))
  .action(async ({ parsedInput: { databaseId } }) => {
    const cookieStore = await cookies();
    cookieStore.set(DB_COOKIE, databaseId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    redirect("/dashboard");
  });

export const toggleWatchProviderAction = authActionClient
  .schema(
    z.object({
      enabled: z.boolean(),
      countryCode: z.string().length(2),
    })
  )
  .action(async ({ parsedInput: { enabled, countryCode } }) => {
    const cookieStore = await cookies();
    cookieStore.set(
      "watch_provider_settings",
      JSON.stringify({ enabled, countryCode }),
      { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" }
    );
    return { success: true };
  });
