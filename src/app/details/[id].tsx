import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { imageUrl } from "../../../api/tmdb";
import { TitleDetails } from "../../../api/types";
import AppButton from "../../../components/AppButton";
import AppHeader from "../../../components/AppHeader";
import MovieRow from "../../../components/MovieRow";
import ProviderRow from "../../../components/ProviderRow";
import StatusView from "../../../components/StatusView";
import Colors from "../../../constants/colors";
import { regionName, tmdbIdsFor } from "../../../constants/providers";
import { useUserData } from "../../../context/UserDataContext";
import { useDetails, useSimilar } from "../../../hooks/queries";
import {
  getWatchOptions,
  openInApp,
  openTrailer,
} from "../../../utils/streaming";

const shareTitle = (item: TitleDetails, where: string[]) =>
  Share.share({
    message:
      `Let's watch "${item.title}"${item.year ? ` (${item.year})` : ""}! ` +
      (where.length > 0 ? `It's on ${where.join(", ")}.` : ""),
  });

const DetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    region,
    myServices,
    isFavorite,
    isWatched,
    toggleFavorite,
    toggleWatched,
  } = useUserData();
  const details = useDetails(id);
  const similar = useSimilar(
    details.data,
    region,
    tmdbIdsFor(myServices, region),
  );
  const item = details.data;

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader showBack />
        <StatusView
          loading={details.isPending}
          error={details.error}
          onRetry={details.refetch}
        />
      </SafeAreaView>
    );
  }

  const favorite = isFavorite(item.key);
  const watched = isWatched(item.key);
  const { mine, others, tmdbLink } = getWatchOptions(item, region, myServices);
  const streamingOn = [...mine, ...others]
    .filter((o) => o.available)
    .map((o) => o.name);

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <AppHeader showBack />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{item.title}</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.favButton, favorite && styles.favActive]}
            onPress={() => toggleFavorite(item)}
          >
            <Ionicons
              name={favorite ? "heart" : "heart-outline"}
              size={16}
              color={favorite ? "red" : Colors.text}
            />
            <Text style={styles.favText}>
              {favorite ? "Favorited" : "Add to favorites"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.trailer}
          onPress={() => openTrailer(item)}
        >
          <Image
            source={imageUrl(item.backdropPath ?? item.posterPath, "w780")}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.6)"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.rating}>
            <Ionicons name="star" size={12} color="#FFC107" />
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>
          <View style={styles.play}>
            <Ionicons name="play" size={30} color={Colors.white} />
          </View>
          <Text style={styles.trailerText}>
            {item.trailerKey ? "Watch trailer" : "Search trailer"}
          </Text>
        </TouchableOpacity>

        <View style={styles.body}>
          <Text style={styles.meta}>
            {[
              item.year,
              item.mediaType === "tv" ? "Series" : "Movie",
              item.runtime,
              item.genres.join(", "),
            ]
              .filter(Boolean)
              .join(" | ")}
          </Text>
          <Text style={styles.description}>
            {item.overview || "No description available."}
          </Text>
          {item.cast.length > 0 && (
            <Text style={styles.cast}>Cast: {item.cast.join(", ")}</Text>
          )}

          <View style={styles.actions}>
            <AppButton
              title={watched ? "Watched" : "Mark as watched"}
              icon={
                <Ionicons
                  name={
                    watched ? "checkmark-circle" : "checkmark-circle-outline"
                  }
                  size={16}
                  color={watched ? Colors.primary : Colors.text}
                />
              }
              style={{ flex: 1 }}
              onPress={() => toggleWatched(item)}
            />
            <AppButton
              title="Share"
              icon={
                <Ionicons
                  name="share-social-outline"
                  size={16}
                  color={Colors.text}
                />
              }
              style={{ flex: 1, marginRight: 0 }}
              onPress={() => shareTitle(item, streamingOn)}
            />
          </View>

          <Text style={styles.sectionTitle}>
            Where to watch in {regionName(region)}
          </Text>
          {mine.length === 0 ? (
            <Text style={styles.hint}>
              You haven't added your streaming services yet.{" "}
              <Text style={styles.link} onPress={() => router.push("/profile")}>
                Add them in your profile
              </Text>
            </Text>
          ) : (
            mine.map((o) => (
              <ProviderRow
                key={o.key}
                option={o}
                onWatch={() => openInApp(o.url)}
              />
            ))
          )}

          {others.length > 0 && (
            <>
              <Text style={styles.subTitle}>Also available on</Text>
              {others.map((o) => (
                <ProviderRow
                  key={o.key}
                  option={o}
                  onWatch={() => openInApp(o.url)}
                />
              ))}
            </>
          )}

          {streamingOn.length === 0 && (
            <Text style={styles.hint}>
              Not on any subscription service in {regionName(region)} right now.
              {tmdbLink ? " " : ""}
              {tmdbLink && (
                <Text style={styles.link} onPress={() => openInApp(tmdbLink)}>
                  See rent or buy options
                </Text>
              )}
            </Text>
          )}
          <Text style={styles.attribution}>
            Streaming data by JustWatch, via TMDB.
          </Text>
        </View>

        <MovieRow
          heading="More like this"
          subheading="Similar genres, on your services"
          data={similar.data}
          loading={similar.isPending}
          error={similar.error}
          onRetry={similar.refetch}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    marginTop: 10,
    gap: 10,
  },
  title: {
    flex: 1,
    color: Colors.text,
    fontSize: 26,
    fontWeight: "700",
  },
  favButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    backgroundColor: Colors.surface,
  },
  favActive: {
    borderColor: "red",
  },
  favText: {
    color: Colors.text,
    fontWeight: "500",
    fontSize: 13,
  },
  trailer: {
    height: 210,
    marginHorizontal: 14,
    marginTop: 14,
    borderRadius: 16,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
  },
  rating: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  ratingText: {
    color: Colors.white,
    fontWeight: "700",
  },
  play: {
    height: 64,
    width: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  trailerText: {
    color: Colors.white,
    fontWeight: "600",
    marginTop: 10,
  },
  body: {
    padding: 14,
  },
  meta: {
    color: Colors.gray,
    fontSize: 13,
  },
  description: {
    color: Colors.text,
    lineHeight: 21,
    marginTop: 10,
  },
  cast: {
    color: Colors.gray,
    marginTop: 8,
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    marginTop: 18,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 12,
  },
  subTitle: {
    color: Colors.gray,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 10,
  },
  hint: {
    color: Colors.gray,
    lineHeight: 20,
    marginBottom: 10,
  },
  link: {
    color: Colors.primary,
  },
  attribution: {
    color: Colors.gray,
    fontSize: 11,
    marginTop: 6,
  },
});
