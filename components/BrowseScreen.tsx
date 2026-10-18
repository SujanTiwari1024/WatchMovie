import React, { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MediaType } from "../api/types";
import Colors from "../constants/colors";
import { tmdbIdsFor } from "../constants/providers";
import { useUserData } from "../context/UserDataContext";
import { useDiscover, useGenres } from "../hooks/queries";
import AppHeader from "./AppHeader";
import GenreChips from "./GenreChips";
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
  const { region, myServices } = useUserData();
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState<SortOption>("popular");
  const [onlyMine, setOnlyMine] = useState(false);

  const genres = useGenres(mediaType);
  const genreId = genres.data?.find((g) => g.name === genre)?.id;

  const query = useDiscover({
    mediaType,
    region,
    sort,
    genreIds: genreId ? [genreId] : [],
    providerIds: onlyMine ? tmdbIdsFor(myServices, region) : [],
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
        emptyText={
          onlyMine && myServices.length === 0
            ? "Add your streaming services in your profile first."
            : `No matching ${heading.toLowerCase()} found.`
        }
        header={
          <View style={{ marginBottom: 14 }}>
            <Text style={styles.heading}>{heading}</Text>
            <GenreChips
              genres={(genres.data ?? []).map((g) => g.name)}
              selected={genre}
              onSelect={setGenre}
            />
            <View style={styles.optionsRow}>
              <View style={{ flexDirection: "row", gap: 18 }}>
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
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <Text style={styles.sort}>My services</Text>
                <Switch
                  value={onlyMine}
                  onValueChange={setOnlyMine}
                  trackColor={{ true: Colors.primary }}
                />
              </View>
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
  optionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    marginTop: 10,
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
