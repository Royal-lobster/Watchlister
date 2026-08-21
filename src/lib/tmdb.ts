import type { MediaType, TmdbSearchResult, TmdbDetail, WatchProviders } from "@/types";

const TMDB_BASE = "https://api.themoviedb.org";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

function getApiKey(): string {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error("TMDB_API_KEY is not set");
  return key;
}

export function getTmdbImageUrl(
  path: string | null,
  size: "w92" | "w185" | "w300" | "w500" | "w780" | "original"
): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function buildSearchUrl(query: string, page: number): string {
  const params = new URLSearchParams({
    api_key: getApiKey(),
    query,
    page: String(page),
  });
  return `${TMDB_BASE}/3/search/multi?${params}`;
}

export function buildDetailUrl(type: MediaType, id: number): string {
  return `${TMDB_BASE}/3/${type}/${id}?api_key=${getApiKey()}`;
}

export async function searchTmdb(
  query: string,
  page = 1
): Promise<{ results: TmdbSearchResult[]; total_pages: number }> {
  const res = await fetch(buildSearchUrl(query, page), { cache: "no-store" });
  if (!res.ok) throw new Error("TMDB search failed");
  return res.json();
}

export async function getTmdbDetail(
  type: MediaType,
  id: number
): Promise<TmdbDetail> {
  const res = await fetch(buildDetailUrl(type, id), {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("TMDB detail fetch failed");
  return res.json();
}

export async function getWatchProviders(
  type: MediaType,
  id: number,
  countryCode: string
): Promise<WatchProviders | null> {
  const url = `${TMDB_BASE}/3/${type}/${id}/watch/providers?api_key=${getApiKey()}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.results?.[countryCode] ?? null;
}

// Genre ID to name mapping (avoids extra API call)
const GENRE_MAP: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
  10759: "Action & Adventure", 10762: "Kids", 10763: "News",
  10764: "Reality", 10765: "Sci-Fi & Fantasy", 10766: "Soap",
  10767: "Talk", 10768: "War & Politics",
};

export function genreIdsToNames(ids: number[]): string[] {
  return ids.map((id) => GENRE_MAP[id] ?? "Unknown").filter(Boolean);
}
