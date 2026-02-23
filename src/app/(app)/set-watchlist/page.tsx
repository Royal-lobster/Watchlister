import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createNotionClient } from "@/lib/notion";
import { SetWatchlistClient } from "@/components/dashboard/set-watchlist-client";

export default async function SetWatchlistPage() {
  const session = await getSession();
  if (!session) redirect("/");

  const notion = createNotionClient(session.access_token);

  const searchResponse = await notion.search({
    filter: { value: "database", property: "object" },
    sort: { direction: "descending", timestamp: "last_edited_time" },
  });

  const databases = searchResponse.results
    .filter((r) => r.object === "database")
    .map((db: any) => ({
      id: db.id,
      title: db.title?.[0]?.plain_text ?? "Untitled",
      icon: db.icon?.emoji ?? db.icon?.external?.url ?? null,
    }));

  return <SetWatchlistClient databases={databases} />;
}
