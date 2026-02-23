import { NextRequest, NextResponse } from "next/server";
import { searchTmdb } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q || q.length < 2) return NextResponse.json({ results: [] });

  try {
    const data = await searchTmdb(q, 1);
    const results = data.results
      .filter((r) => r.media_type === "movie" || r.media_type === "tv")
      .slice(0, 6)
      .map((r) => ({
        id: r.id,
        title: r.title ?? r.name ?? "Unknown",
        media_type: r.media_type,
        poster_path: r.poster_path,
        year: (r.release_date ?? r.first_air_date ?? "").split("-")[0],
      }));

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
