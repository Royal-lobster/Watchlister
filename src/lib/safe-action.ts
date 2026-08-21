import { createSafeActionClient } from "next-safe-action";
import { getSession, getNotionDbId } from "@/lib/auth";
import { createNotionClient } from "@/lib/notion";

// Base action client — no auth required (used for logout)
export const actionClient = createSafeActionClient();

// Authenticated action client — requires valid session cookie
export const authActionClient = createSafeActionClient().use(
  async ({ next }) => {
    const session = await getSession();
    if (!session) {
      throw new Error("Unauthorized");
    }
    const notion = createNotionClient(session.access_token);
    return next({ ctx: { session, notion } });
  }
);

// Authenticated action client that also requires a selected database
export const dbActionClient = createSafeActionClient().use(
  async ({ next }) => {
    const session = await getSession();
    const dbId = await getNotionDbId();
    if (!session) throw new Error("Unauthorized");
    if (!dbId) throw new Error("No watchlist database selected");
    const notion = createNotionClient(session.access_token);
    return next({ ctx: { session, notion, dbId } });
  }
);
