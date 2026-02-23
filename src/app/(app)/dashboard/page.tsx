import { redirect } from "next/navigation";
import { getSession, getNotionDbId } from "@/lib/auth";
import { createNotionClient, extractTitle, extractMultiSelect } from "@/lib/notion";
import { WatchlistGrid } from "@/components/dashboard/watchlist-grid";

export default async function DashboardPage() {
  const session = await getSession();
  const dbId = await getNotionDbId();

  if (!session) redirect("/");
  if (!dbId) redirect("/set-watchlist");

  const notion = createNotionClient(session.access_token);

  let entries: any[] = [];
  try {
    const response = await notion.dataSources.query({
      data_source_id: dbId,
      sorts: [{ timestamp: "created_time", direction: "descending" }],
      page_size: 50,
    });

    entries = response.results
      .filter((p) => p.object === "page")
      .map((page: any) => ({
        pageId: page.id,
        title: extractTitle(page.properties),
        genres: extractMultiSelect(page.properties, "Tags"),
        mediaType: page.properties["Type"]?.select?.name ?? "Movie",
        posterUrl: page.cover?.external?.url ?? page.cover?.file?.url ?? null,
        notionUrl: page.url,
      }));
  } catch (error) {
    console.error("Failed to fetch watchlist:", error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-(--color-text-primary)">My Watchlist</h1>
        <p className="text-(--color-text-secondary) mt-1">
          {entries.length} {entries.length === 1 ? "item" : "items"}
        </p>
      </div>
      <WatchlistGrid entries={entries} />
    </div>
  );
}
