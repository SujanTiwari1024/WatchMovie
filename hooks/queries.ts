import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  DiscoverParams,
  fetchDetails,
  fetchDiscover,
  fetchGenres,
  fetchSearch,
  fetchTrending,
} from "../api/tmdb";
import { Genre, MediaType, TitleSummary } from "../api/types";
import { RegionCode } from "../constants/providers";
import {
  canonicalGenres,
  genresFor,
  mergeByPopularity,
  rankBySimilarity,
  rankByTaste,
  tasteGenres,
} from "../utils/recommend";

const HOUR = 60 * 60 * 1000;

export const useGenres = (mediaType: MediaType) =>
  useQuery({
    queryKey: ["genres", mediaType],
    queryFn: () => fetchGenres(mediaType),
    staleTime: 24 * HOUR,
  });

export const useGenreNames = () => {
  const movie = useGenres("movie");
  const tv = useGenres("tv");
  const map = new Map<number, string>();
  [...(movie.data ?? []), ...(tv.data ?? [])].forEach((g: Genre) =>
    map.set(g.id, g.name),
  );
  return (ids: number[]) =>
    ids.map((id) => map.get(id)).filter(Boolean) as string[];
};

export const useTrending = () =>
  useQuery({ queryKey: ["trending"], queryFn: fetchTrending, staleTime: HOUR });

export const useDiscover = (params: Omit<DiscoverParams, "page">) =>
  useInfiniteQuery({
    queryKey: ["discover", params],
    queryFn: ({ pageParam }) => fetchDiscover({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.totalPages ? last.page + 1 : undefined,
    staleTime: HOUR,
  });

const discoverBoth = async (
  params: Omit<DiscoverParams, "mediaType">,
  canonical: number[] = [],
) => {
  const [movies, series] = await Promise.all(
    (["movie", "tv"] as MediaType[]).map((mediaType) =>
      fetchDiscover({
        ...params,
        mediaType,
        genreIds: genresFor(mediaType, canonical),
      }),
    ),
  );
  return mergeByPopularity(movies.results, series.results);
};

export const useProviderTop = (providerIds: number[], region: RegionCode) =>
  useQuery({
    queryKey: ["provider-top", providerIds, region],
    queryFn: () => discoverBoth({ region, providerIds }),
    staleTime: HOUR,
  });

interface RecommendationInput {
  taste: TitleSummary[];
  region: RegionCode;
  providerIds: number[];
}

export const useRecommendations = ({
  taste,
  region,
  providerIds,
}: RecommendationInput) => {
  const genres = tasteGenres(taste);
  return useQuery({
    queryKey: [
      "recommendations",
      genres,
      region,
      providerIds,
      taste.map((t) => t.key),
    ],
    queryFn: async () => {
      const candidates = await discoverBoth(
        { region, providerIds, genreMatch: "any" },
        genres,
      );
      return rankByTaste(candidates, taste).slice(0, 20);
    },
    staleTime: HOUR,
  });
};

export const useSimilar = (
  base: TitleSummary | undefined,
  region: RegionCode,
  providerIds: number[],
) =>
  useQuery({
    queryKey: ["similar", base?.key, region, providerIds],
    enabled: !!base,
    queryFn: async () => {
      const page = await fetchDiscover({
        mediaType: base!.mediaType,
        region,
        providerIds,
        genreIds: genresFor(base!.mediaType, canonicalGenres(base!.genreIds)),
        genreMatch: "any",
      });
      return rankBySimilarity(page.results, base!).slice(0, 12);
    },
    staleTime: HOUR,
  });

export const useDetails = (key: string) =>
  useQuery({
    queryKey: ["details", key],
    queryFn: () => fetchDetails(key),
    staleTime: 6 * HOUR,
  });

export const useSearch = (query: string) =>
  useQuery({
    queryKey: ["search", query],
    queryFn: () => fetchSearch(query),
    enabled: query.length >= 2,
    staleTime: HOUR,
  });
