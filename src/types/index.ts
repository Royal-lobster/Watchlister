export type MediaType = "movie" | "tv";

export interface Session {
  access_token: string;
  workspace_name: string;
  workspace_icon: string | null;
  bot_id: string;
}

export interface TmdbSearchResult {
  id: number;
  media_type: MediaType;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  overview: string;
  genre_ids: number[];
}

export interface TmdbDetail {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  genres: { id: number; name: string }[];
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  tagline?: string;
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

export interface WatchProviders {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}
