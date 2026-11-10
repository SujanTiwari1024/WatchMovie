import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MediaType } from "../api/types";
import Colors from "../constants/colors";
import { ProviderId, providers, tmdbIdsFor } from "../constants/providers";
import { useUserData } from "../context/UserDataContext";
import { useDiscover, useGenres } from "../hooks/queries";
import AppHeader from "./AppHeader";
import GenreChips from "./GenreChips";
import ServiceChips from "./ServiceChips";
import TitleGrid from "./TitleGrid";

type SortOption = "popular" | "newest" | "rating";

const sortLabels: Record<SortOption, string> = {
  popular: "Popular",
  newest: "Newest",
  rating: "Rating",
};

interface BrowseScreenProps {
  mediaType: MediaType;
  heading: string;
}

const BrowseScreen = ({ mediaType, heading }: BrowseScreenProps) => {
  const { region } = useUserData();
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState<SortOption>("popular");
  const [selectedServices, setSelectedServices] = useState<ProviderId[]>([]);
  const activeServices = selectedServices.filter((id) =>
    providers[id].regions.includes(region),
  );

  const genres = useGenres(mediaType);
  const genreId = genres.data?.find((g) => g.name === genre)?.id;

  const query = useDiscover({
    mediaType,
    region,
    sort,
    genreIds: genreId ? [genreId] : [],
    providerIds: tmdbIdsFor(activeServices, region),
  });

  const data = query.data?.pages.flatMap((p) => p.results) ?? [];
  const unique = [...new Map(data.map((t) => [t.key, t])).values()];

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <AppHeader />
      <TitleGrid
        data={unique}
        loading={query.isPending}
        error={query.error}
        onRetry={query.refetch}
        loadingMore={query.isFetchingNextPage}
        onEndReached={() =>
          query.hasNextPage &&
          !query.isFetchingNextPage &&
          query.fetchNextPage()
        }
        emptyText={`No ${heading.toLowerCase()} match these filters. Try another genre or service.`}
        header={
          <View style={{ marginBottom: 14 }}>
            <Text style={styles.heading}>{heading}</Text>
            <GenreChips
              genres={(genres.data ?? []).map((g) => g.name)}
              selected={genre}
              onSelect={setGenre}
            />
            {genres.isError && (
              <Text style={styles.genreError} onPress={() => genres.refetch()}>
                Genres could not be loaded. Tap to try again.
              </Text>
            )}
            <View style={{ marginTop: 10 }}>
              <ServiceChips
                selected={activeServices}
                onChange={setSelectedServices}
              />
            </View>
            <View style={styles.optionsRow}>
              {(Object.keys(sortLabels) as SortOption[]).map((s) => (
                <Text
                  key={s}
                  onPress={() => setSort(s)}
                  style={[styles.sort, sort === s && styles.sortActive]}
                >
                  {sortLabels[s]}
                </Text>
              ))}
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default BrowseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  heading: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "700",
    padding: 14,
  },
  genreError: {
    color: Colors.primary,
    paddingHorizontal: 14,
    marginTop: 8,
  },
  optionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    paddingHorizontal: 14,
    marginTop: 14,
  },
  sort: {
    color: Colors.gray,
    fontWeight: "500",
  },
  sortActive: {
    color: Colors.primary,
    fontWeight: "700",
  },
});
