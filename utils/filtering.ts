import {
  RegionWatchProviders,
  TitleSummary,
  WatchProviderEntry,
} from "../api/types";

export const streamingEntries = (
  regionData: RegionWatchProviders = {},
): WatchProviderEntry[] => [
  ...(regionData.flatrate ?? []),
  ...(regionData.free ?? []),
  ...(regionData.ads ?? []),
];

export const isStreamingOn = (
  regionData: RegionWatchProviders | undefined,
  providerIds: number[],
) =>
  streamingEntries(regionData).some((entry) =>
    providerIds.includes(entry.provider_id),
  );

export const mergeUniqueTitles = (...lists: TitleSummary[][]) => {
  const unique = new Map<string, TitleSummary>();
  lists.flat().forEach((title) => {
    if (!unique.has(title.key)) unique.set(title.key, title);
  });
  return [...unique.values()];
};

export const mergeByPopularity = (...lists: TitleSummary[][]) =>
  mergeUniqueTitles(...lists).sort((a, b) => b.popularity - a.popularity);

export const filterByTitle = (titles: TitleSummary[], query: string) => {
  const needle = query.trim().toLowerCase();
  if (!needle) return titles;
  return titles.filter((title) => title.title.toLowerCase().includes(needle));
};

export type SortOption = "popular" | "newest" | "rating";

export const sortTitles = (titles: TitleSummary[], sort: SortOption) =>
  [...titles].sort((a, b) =>
    sort === "newest"
      ? (b.year ?? 0) - (a.year ?? 0)
      : sort === "rating"
        ? b.rating - a.rating
        : b.popularity - a.popularity,
  );

export const excludeTitles = (
  titles: TitleSummary[],
  excluded: TitleSummary[],
) => {
  const keys = new Set(excluded.map((title) => title.key));
  return titles.filter((title) => !keys.has(title.key));
};
