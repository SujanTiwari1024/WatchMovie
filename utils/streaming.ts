import { Alert, Linking } from "react-native";
import { imageUrl } from "../api/tmdb";
import { TitleDetails, WatchProviderEntry } from "../api/types";
import {
  providerForTmdbId,
  providersInRegion,
  ProviderId,
  RegionCode,
} from "../constants/providers";

export interface ProviderOption {
  key: string;
  name: string;
  logo?: string;
  color: string;
  available: boolean;
  mine: boolean;
  url?: string;
}

export const getWatchOptions = (
  title: TitleDetails,
  region: RegionCode,
  myServices: ProviderId[],
) => {
  const regionData = title.watchProviders[region] ?? {};
  const streaming: WatchProviderEntry[] = [
    ...(regionData.flatrate ?? []),
    ...(regionData.free ?? []),
    ...(regionData.ads ?? []),
  ];
  const availableTmdbIds = new Set(streaming.map((p) => p.provider_id));

  const mine: ProviderOption[] = providersInRegion(region)
    .filter((p) => myServices.includes(p.id))
    .map((p) => ({
      key: p.id,
      name: p.name,
      logo: imageUrl(p.logoPath, "w92"),
      color: p.color,
      available: p.tmdbIds.some((id) => availableTmdbIds.has(id)),
      mine: true,
      url: p.searchUrl(title.title),
    }))
    .sort((a, b) => Number(b.available) - Number(a.available));

  const others = new Map<string, ProviderOption>();
  streaming.forEach((entry) => {
    const known = providerForTmdbId(entry.provider_id);
    if (known && myServices.includes(known.id)) return;
    const key = known?.id ?? String(entry.provider_id);
    if (others.has(key)) return;
    others.set(key, {
      key,
      name: known?.name ?? entry.provider_name,
      logo: imageUrl(entry.logo_path, "w92"),
      color: known?.color ?? "#333333",
      available: true,
      mine: false,
      url: known ? known.searchUrl(title.title) : regionData.link,
    });
  });

  return { mine, others: [...others.values()], tmdbLink: regionData.link };
};

export const openInApp = async (url?: string) => {
  if (!url) return;
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert("Could not open link", "Please try again later.");
  }
};

export const openTrailer = (title: TitleDetails) =>
  openInApp(
    title.trailerKey
      ? `https://www.youtube.com/watch?v=${title.trailerKey}`
      : `https://www.youtube.com/results?search_query=${encodeURIComponent(
          `${title.title} ${title.year ?? ""} trailer`,
        )}`,
  );
