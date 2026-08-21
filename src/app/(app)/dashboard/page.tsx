import { redirect } from "next/navigation";
import { getSession, getNotionDbId } from "@/lib/auth";
import { createNotionClient, extractTitle, extractMultiSelect, extractSelect } from "@/lib/notion";
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
      .map((page: any) => {
        const typeValue = extractSelect(page.properties, "Type");
        const isTV = typeValue
          ? /tv/i.test(typeValue) || /series/i.test(typeValue)
          : false;

        return {
          pageId: page.id,
          title: extractTitle(page.properties),
          genres: extractMultiSelect(page.properties, "Tags"),
          mediaType: isTV ? "TV Show" : (typeValue ?? "Movie"),
          posterUrl: page.cover?.external?.url ?? page.cover?.file?.url ?? null,
          notionUrl: page.url,
        };
      });
  } catch (error) {
    console.error("Failed to fetch watchlist:", error);
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Watchlist</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {entries.length} {entries.length === 1 ? "title" : "titles"}
        </p>
      </div>

      <WatchlistGrid entries={entries} />
    </div>
  );
}
