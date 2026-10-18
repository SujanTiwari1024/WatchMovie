import axios from "axios";
import { Genre, MediaType, Page, TitleDetails, TitleSummary } from "./types";

const IMAGE_BASE = "https://image.tmdb.org/t/p";

export const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  timeout: 10000,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_READ_TOKEN}`,
  },
  params: { language: "en-US" },
});

export const imageUrl = (
  path: string | null | undefined,
  size: "w92" | "w185" | "w342" | "w780" | "w1280" = "w342",
) => (path ? `${IMAGE_BASE}/${size}${path}` : undefined);

const titleKey = (mediaType: MediaType, id: number) => `${mediaType}-${id}`;

const parseTitleKey = (key: string) => {
  const [mediaType, id] = key.split("-");
  return { mediaType: mediaType as MediaType, id: Number(id) };
};

const toSummary = (raw: any, fallbackType?: MediaType): TitleSummary | null => {
  const mediaType: MediaType | undefined = raw.media_type ?? fallbackType;
  if (mediaType !== "movie" && mediaType !== "tv") return null;
  const date: string | undefined = raw.release_date || raw.first_air_date;
  return {
    key: titleKey(mediaType, raw.id),
    id: raw.id,
    mediaType,
    title: raw.title ?? raw.name ?? "Untitled",
    year: date ? Number(date.slice(0, 4)) : undefined,
    posterPath: raw.poster_path ?? null,
    backdropPath: raw.backdrop_path ?? null,
    rating: raw.vote_average ?? 0,
    popularity: raw.popularity ?? 0,
    genreIds: raw.genre_ids ?? raw.genres?.map((g: Genre) => g.id) ?? [],
    overview: raw.overview ?? "",
  };
};

const toPage = (data: any, fallbackType?: MediaType): Page<TitleSummary> => ({
  page: data.page,
  totalPages: Math.min(data.total_pages ?? 1, 500),
  results: (data.results ?? [])
    .map((r: any) => toSummary(r, fallbackType))
    .filter(
      (t: TitleSummary | null): t is TitleSummary =>
        t !== null && !!t.posterPath,
    ),
});

export const fetchGenres = async (mediaType: MediaType): Promise<Genre[]> => {
  const { data } = await tmdb.get(`/genre/${mediaType}/list`);
  return data.genres;
};

export const fetchTrending = async () => {
  const { data } = await tmdb.get("/trending/all/week");
  return toPage(data).results;
};

export interface DiscoverParams {
  mediaType: MediaType;
  region: string;
  page?: number;
  genreIds?: number[];
  genreMatch?: "all" | "any";
  providerIds?: number[];
  sort?: "popular" | "newest" | "rating";
}

export const fetchDiscover = async ({
  mediaType,
  region,
  page = 1,
  genreIds = [],
  genreMatch = "all",
  providerIds = [],
  sort = "popular",
}: DiscoverParams) => {
  const dateField =
    mediaType === "movie" ? "primary_release_date" : "first_air_date";
  const today = new Date().toISOString().slice(0, 10);

  const params: Record<string, string | number> = {
    page,
    watch_region: region,
    sort_by:
      sort === "newest"
        ? `${dateField}.desc`
        : sort === "rating"
          ? "vote_average.desc"
          : "popularity.desc",
    "vote_count.gte": sort === "rating" ? 300 : sort === "newest" ? 20 : 50,
    [`${dateField}.lte`]: today,
  };

  if (genreIds.length > 0) {
    params.with_genres = genreIds.join(genreMatch === "all" ? "," : "|");
  }
  if (providerIds.length > 0) {
    params.with_watch_providers = providerIds.join("|");
    params.with_watch_monetization_types = "flatrate|free|ads";
  }

  const { data } = await tmdb.get(`/discover/${mediaType}`, { params });
  return toPage(data, mediaType);
};

export const fetchSearch = async (query: string) => {
  const { data } = await tmdb.get("/search/multi", {
    params: { query, include_adult: false },
  });
  return toPage(data).results;
};

const formatRuntime = (raw: any, mediaType: MediaType) => {
  if (mediaType === "tv") {
    const n = raw.number_of_seasons ?? 0;
    return `${n} ${n === 1 ? "Season" : "Seasons"}`;
  }
  const minutes = raw.runtime ?? 0;
  if (!minutes) return "";
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
};

const pickTrailer = (videos: any[] = []) => {
  const youtube = videos.filter((v) => v.site === "YouTube");
  return (
    youtube.find((v) => v.type === "Trailer" && v.official) ??
    youtube.find((v) => v.type === "Trailer") ??
    youtube.find((v) => v.type === "Teaser")
  )?.key;
};

export const fetchDetails = async (key: string): Promise<TitleDetails> => {
  const { mediaType, id } = parseTitleKey(key);
  const { data } = await tmdb.get(`/${mediaType}/${id}`, {
    params: { append_to_response: "credits,videos,watch/providers" },
  });
  const summary = toSummary(data, mediaType)!;
  return {
    ...summary,
    genres: (data.genres ?? []).map((g: Genre) => g.name),
    runtime: formatRuntime(data, mediaType),
    cast: (data.credits?.cast ?? []).slice(0, 8).map((c: any) => c.name),
    trailerKey: pickTrailer(data.videos?.results),
    watchProviders: data["watch/providers"]?.results ?? {},
  };
};

export const errorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (!error.response)
      return "No internet connection. Check your network and try again.";
    if (error.response.status === 401)
      return "The TMDB access token is missing or invalid.";
    if (error.response.status === 429)
      return "Too many requests. Please wait a moment.";
    return `TMDB could not be reached (error ${error.response.status}).`;
  }
  return "Something went wrong. Please try again.";
};
