import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { TitleSummary } from "../api/types";
import { ProviderId, providers, RegionCode } from "../constants/providers";

const STORAGE_KEY = "watchmovie:user-data:v2";

interface UserData {
  username: string;
  region: RegionCode;
  myServices: ProviderId[];
  favorites: TitleSummary[];
  watched: TitleSummary[];
}

const defaults: UserData = {
  username: "Sujan",
  region: "FI",
  myServices: ["netflix", "prime", "appletv"],
  favorites: [],
  watched: [],
};

interface UserDataContextValue extends UserData {
  isFavorite: (key: string) => boolean;
  isWatched: (key: string) => boolean;
  toggleFavorite: (title: TitleSummary) => void;
  toggleWatched: (title: TitleSummary) => void;
  toggleService: (id: ProviderId) => void;
  setRegion: (region: RegionCode) => void;
  setUsername: (name: string) => void;
}

const UserDataContext = createContext<UserDataContextValue | null>(null);

const toSnapshot = ({
  key,
  id,
  mediaType,
  title,
  year,
  posterPath,
  backdropPath,
  rating,
  popularity,
  genreIds,
  overview,
}: TitleSummary): TitleSummary => ({
  key,
  id,
  mediaType,
  title,
  year,
  posterPath,
  backdropPath,
  rating,
  popularity,
  genreIds,
  overview,
});

const isValidTitle = (t: unknown): t is TitleSummary =>
  typeof t === "object" &&
  t !== null &&
  typeof (t as TitleSummary).key === "string" &&
  Array.isArray((t as TitleSummary).genreIds);

const sanitize = (stored: Partial<UserData>): UserData => ({
  ...defaults,
  ...stored,
  favorites: (stored.favorites ?? []).filter(isValidTitle),
  watched: (stored.watched ?? []).filter(isValidTitle),
  myServices: (stored.myServices ?? defaults.myServices).filter(
    (id) => id in providers,
  ),
});

const toggleTitle = (list: TitleSummary[], title: TitleSummary) =>
  list.some((t) => t.key === title.key)
    ? list.filter((t) => t.key !== title.key)
    : [toSnapshot(title), ...list];

export const UserDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, setData] = useState<UserData>(defaults);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setData(sanitize(JSON.parse(raw)));
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded)
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {});
  }, [data, loaded]);

  const update = (patch: (prev: UserData) => Partial<UserData>) =>
    setData((prev) => ({ ...prev, ...patch(prev) }));

  const value: UserDataContextValue = {
    ...data,
    isFavorite: (key) => data.favorites.some((t) => t.key === key),
    isWatched: (key) => data.watched.some((t) => t.key === key),
    toggleFavorite: (title) =>
      update((p) => ({ favorites: toggleTitle(p.favorites, title) })),
    toggleWatched: (title) =>
      update((p) => ({ watched: toggleTitle(p.watched, title) })),
    toggleService: (id) =>
      update((p) => ({
        myServices: p.myServices.includes(id)
          ? p.myServices.filter((s) => s !== id)
          : [...p.myServices, id],
      })),
    setRegion: (region) => update(() => ({ region })),
    setUsername: (username) => update(() => ({ username })),
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const ctx = useContext(UserDataContext);
  if (!ctx) throw new Error("useUserData must be used inside UserDataProvider");
  return ctx;
};
