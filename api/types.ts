export type MediaType = "movie" | "tv";

export interface TitleSummary {
  key: string;
  id: number;
  mediaType: MediaType;
  title: string;
  year?: number;
  posterPath: string | null;
  backdropPath: string | null;
  rating: number;
  popularity: number;
  genreIds: number[];
  overview: string;
}

export interface WatchProviderEntry {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

interface RegionWatchProviders {
  link?: string;
  flatrate?: WatchProviderEntry[];
  free?: WatchProviderEntry[];
  ads?: WatchProviderEntry[];
  rent?: WatchProviderEntry[];
  buy?: WatchProviderEntry[];
}

export interface TitleDetails extends TitleSummary {
  genres: string[];
  runtime: string;
  cast: string[];
  trailerKey?: string;
  watchProviders: Record<string, RegionWatchProviders>;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Page<T> {
  page: number;
  totalPages: number;
  results: T[];
}
