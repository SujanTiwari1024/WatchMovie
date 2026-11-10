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

export const excludeTitles = (
  titles: TitleSummary[],
  excluded: TitleSummary[],
) => {
  const keys = new Set(excluded.map((title) => title.key));
  return titles.filter((title) => !keys.has(title.key));
};
