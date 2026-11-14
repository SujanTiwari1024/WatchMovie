import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Text from "./AppText";
import { SafeAreaView } from "react-native-safe-area-context";
import { MediaType } from "../api/types";
import Colors from "../constants/colors";
import { ProviderId, providers, tmdbIdsFor } from "../constants/providers";
import { useUserData } from "../context/UserDataContext";
import { useBrowseSearch, useDiscover, useGenres } from "../hooks/queries";
import { useDebounce } from "../hooks/useDebounce";
import { SortOption } from "../utils/filtering";
import AppHeader from "./AppHeader";
import GenreChips from "./GenreChips";
import ServiceChips from "./ServiceChips";
import TitleGrid from "./TitleGrid";

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [text, setText] = useState("");
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState<SortOption>("popular");
  const [selectedServices, setSelectedServices] = useState<ProviderId[]>([]);
  const activeServices = selectedServices.filter((id) =>
    providers[id].regions.includes(region),
  );

  const debounced = useDebounce(text.trim());
  const searching = searchOpen && debounced.length >= 2;

  const closeSearch = () => {
    setSearchOpen(false);
    setText("");
    setGenre("All");
    setSort("popular");
    setSelectedServices([]);
  };

  const genres = useGenres(mediaType);
  const genreId = genres.data?.find((g) => g.name === genre)?.id;
  const genreIds = genreId ? [genreId] : [];
  const providerIds = tmdbIdsFor(activeServices, region);

  const discover = useDiscover({
    mediaType,
    region,
    sort,
    genreIds,
    providerIds,
  });
  const search = useBrowseSearch({
    mediaType,
    region,
    sort,
    genreIds,
    providerIds,
    query: searching ? debounced : "",
  });

  const discovered = discover.data?.pages.flatMap((p) => p.results) ?? [];
  const unique = [...new Map(discovered.map((t) => [t.key, t])).values()];
  const label = heading.toLowerCase();

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {searchOpen ? (
        <AppHeader
          autoFocus
          searchLabel={`Search ${label}`}
          searchValue={text}
          onSearchChange={setText}
          onSearchClose={closeSearch}
        />
      ) : (
        <AppHeader
          searchLabel={`Search ${label}`}
          onSearchPress={() => setSearchOpen(true)}
        />
      )}
      <TitleGrid
        data={searching ? (search.data ?? []) : unique}
        loading={searching ? search.isPending : discover.isPending}
        error={searching ? search.error : discover.error}
        onRetry={searching ? search.refetch : discover.refetch}
        loadingMore={!searching && discover.isFetchingNextPage}
        onEndReached={() =>
          !searching &&
          discover.hasNextPage &&
          !discover.isFetchingNextPage &&
          discover.fetchNextPage()
        }
        emptyText={
          searching
            ? `No ${label} match "${debounced}" with these filters.`
            : `No ${label} match these filters. Try another genre or service.`
        }
        header={
          searchOpen ? (
            <View style={styles.filters}>
              <>
                <GenreChips
                  genres={(genres.data ?? []).map((g) => g.name)}
                  selected={genre}
                  onSelect={setGenre}
                />
                {genres.isError && (
                  <Text
                    style={styles.genreError}
                    onPress={() => genres.refetch()}
                  >
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
              </>
            </View>
          ) : (
            <View style={{ height: 6 }} />
          )
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
  filters: {
    marginTop: 6,
    marginBottom: 14,
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
