import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  DiscoverParams,
  fetchDetails,
  fetchDiscover,
  fetchGenres,
  fetchRelated,
  fetchSearch,
  fetchTrending,
  fetchWatchProviders,
} from "../api/tmdb";
import { Genre, MediaType, TitleSummary } from "../api/types";
import { RegionCode } from "../constants/providers";
import {
  excludeTitles,
  isStreamingOn,
  mergeByPopularity,
  mergeUniqueTitles,
} from "../utils/filtering";

const HOUR = 60 * 60 * 1000;
const MAX_AVAILABILITY_CHECKS = 20;
const MAX_WATCHLIST_SOURCES = 3;

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

const discoverBoth = async (params: Omit<DiscoverParams, "mediaType">) => {
  const [movies, series] = await Promise.all(
    (["movie", "tv"] as MediaType[]).map((mediaType) =>
      fetchDiscover({ ...params, mediaType }),
    ),
  );
  return mergeByPopularity(movies.results, series.results);
};

const splitByServices = async (
  titles: TitleSummary[],
  region: RegionCode,
  providerIds: number[],
) => {
  const candidates = titles.slice(0, MAX_AVAILABILITY_CHECKS);
  const available = await Promise.all(
    candidates.map((title) =>
      providerIds.length === 0
        ? false
        : fetchWatchProviders(title.mediaType, title.id)
            .then((results) => isStreamingOn(results[region], providerIds))
            .catch(() => false),
    ),
  );
  return {
    onMyServices: candidates.filter((_, index) => available[index]),
    others: candidates.filter((_, index) => !available[index]),
  };
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
  const sources = mergeUniqueTitles(taste).slice(0, MAX_WATCHLIST_SOURCES);
  return useQuery({
    queryKey: [
      "recommendations",
      sources.map((title) => title.key),
      region,
      providerIds,
    ],
    queryFn: async () => {
      if (providerIds.length === 0) return [];
      const related = await Promise.all(
        sources.map((title) => fetchRelated(title.mediaType, title.id)),
      );
      const { onMyServices } = await splitByServices(
        excludeTitles(mergeUniqueTitles(...related), taste),
        region,
        providerIds,
      );
      if (onMyServices.length > 0) return onMyServices;
      const popular = await discoverBoth({ region, providerIds });
      return excludeTitles(popular, taste).slice(0, 20);
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
      const related = await fetchRelated(base!.mediaType, base!.id);
      return splitByServices(
        excludeTitles(related, [base!]),
        region,
        providerIds,
      );
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
