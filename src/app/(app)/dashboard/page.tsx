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
        // Normalize: "TV Show", "tv", "TV", "TV Series" all → "TV Show", else "Movie"
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
    <div className="max-w-screen-xl mx-auto px-6 py-12">
      {/* Editorial header */}
      <div className="mb-12">
        <span className="editorial-label">Your Collection</span>
        <h1
          className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight"
          style={{
            fontFamily: "var(--font-display), Georgia, serif",
            color: "var(--color-text-primary)",
          }}
        >
          Watchlist
        </h1>
        <div className="mt-4 flex items-center gap-4">
          <div className="h-px flex-1 bg-(--color-border)" />
          <span className="text-[0.625rem] font-semibold tracking-[0.18em] uppercase text-(--color-text-muted)">
            {entries.length} {entries.length === 1 ? "title" : "titles"}
          </span>
          <div className="h-px flex-1 bg-(--color-border)" />
        </div>
      </div>

      <WatchlistGrid entries={entries} />
    </div>
  );
}
