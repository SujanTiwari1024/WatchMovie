import React, { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import MovieRow from "../../../../components/MovieRow";
import OverviewSection from "../../../../components/OverviewSection";
import Colors from "../../../../constants/colors";
import {
  providers,
  regionName,
  tmdbIdsFor,
} from "../../../../constants/providers";
import { useUserData } from "../../../../context/UserDataContext";
import {
  useProviderTop,
  useRecommendations,
  useTrending,
} from "../../../../hooks/queries";

const ProviderTopRow = ({ id }: { id: keyof typeof providers }) => {
  const { region } = useUserData();
  const query = useProviderTop(tmdbIdsFor([id], region), region);
  return (
    <MovieRow
      heading={`Top - ${providers[id].name}`}
      subheading={`Streaming in ${regionName(region)}`}
      data={query.data}
      loading={query.isPending}
      error={query.error}
      onRetry={query.refetch}
    />
  );
};

const HomeScreen = () => {
  const { favorites, watched, region, myServices } = useUserData();
  const [seed, setSeed] = useState(Math.random);

  const trending = useTrending();
  const recommended = useRecommendations({
    taste: [...favorites, ...watched],
    region,
    providerIds: tmdbIdsFor(myServices, region),
  });

  const withBackdrop = (trending.data ?? []).filter((t) => t.backdropPath);
  const featured = withBackdrop[Math.floor(seed * withBackdrop.length)];

  const refresh = () => {
    setSeed(Math.random());
    trending.refetch();
    recommended.refetch();
  };

  const regionalServices = myServices.filter((id) =>
    providers[id]?.regions.includes(region),
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={refresh}
            tintColor={Colors.text}
          />
        }
      >
        <OverviewSection featured={featured} />
        <MovieRow
          heading="Recommendation"
          subheading={
            favorites.length + watched.length > 0
              ? "Based on your taste, ready to stream on your services"
              : "Popular on your services. Add favorites to personalise this"
          }
          data={recommended.data}
          loading={recommended.isPending}
          error={recommended.error}
          onRetry={recommended.refetch}
          emptyText="Nothing matching on your services right now."
          cardWidth={160}
        />
        <MovieRow
          heading="Top Trending"
          data={trending.data}
          loading={trending.isPending}
          error={trending.error}
          onRetry={trending.refetch}
        />
        <MovieRow heading="Favorites" data={favorites} />
        {regionalServices.map((id) => (
          <ProviderTopRow key={id} id={id} />
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
