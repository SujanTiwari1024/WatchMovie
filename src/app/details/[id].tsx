import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Share, StyleSheet, TouchableOpacity, View } from "react-native";
import Text from "../../../components/AppText";
import { SafeAreaView } from "react-native-safe-area-context";
import { imageUrl } from "../../../api/tmdb";
import { TitleDetails } from "../../../api/types";
import AppButton from "../../../components/AppButton";
import AppHeader from "../../../components/AppHeader";
import MovieRow from "../../../components/MovieRow";
import ProviderRow from "../../../components/ProviderRow";
import RegionChips from "../../../components/RegionChips";
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

const DESCRIPTION_LINES = 3;
const CAST_LINES = 1;

const shareTitle =(item: TitleDetails, where: string[]) =>
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
  const [expanded, setExpanded] = useState(false);
  const [descriptionLines, setDescriptionLines] = useState(0);
  const [castLines, setCastLines] = useState(0);

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

  const overview = item.overview || "No description available.";
  const castText = `Cast: ${item.cast.join(", ")}`;
  const canExpand =
    descriptionLines > DESCRIPTION_LINES || castLines > CAST_LINES;
  const toggleExpanded = () => setExpanded((e) => !e);

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
            style={styles.shareButton}
            onPress={() => shareTitle(item, streamingOn)}
          >
            <Ionicons
              name="share-social-outline"
              size={16}
              color={Colors.text}
            />
            <Text style={styles.shareText}>Share</Text>
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
            <Ionicons
              name="play"
              size={30}
              color={Colors.white}
              style={{ marginLeft: 4 }}
            />
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
          <View>
            <Text
              style={styles.description}
              numberOfLines={expanded ? undefined : DESCRIPTION_LINES}
              onPress={canExpand ? toggleExpanded : undefined}
            >
              {overview}
            </Text>
            <View
              style={styles.measure}
              pointerEvents="none"
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              <Text
                style={styles.description}
                onTextLayout={(e) =>
                  setDescriptionLines(e.nativeEvent.lines.length)
                }
              >
                {overview}
              </Text>
            </View>
          </View>
          {canExpand && (
            <Text style={styles.more} onPress={toggleExpanded}>
              {expanded ? "Show less" : "Read more"}
            </Text>
          )}
          {item.cast.length > 0 && (
            <View>
              <Text
                style={styles.cast}
                numberOfLines={expanded ? undefined : CAST_LINES}
              >
                {castText}
              </Text>
              <View
                style={styles.measure}
                pointerEvents="none"
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              >
                <Text
                  style={styles.cast}
                  onTextLayout={(e) => setCastLines(e.nativeEvent.lines.length)}
                >
                  {castText}
                </Text>
              </View>
            </View>
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
              style={[
                styles.actionButton,
                { marginRight: 10 },
                watched && styles.actionActive,
              ]}
              onPress={() => toggleWatched(item)}
            />
            <AppButton
              title={favorite ? "On watchlist" : "Add to watchlist"}
              icon={
                <Ionicons
                  name={favorite ? "bookmark" : "bookmark-outline"}
                  size={16}
                  color={favorite ? Colors.primary : Colors.text}
                />
              }
              style={[
                styles.actionButton,
                { marginRight: 0 },
                favorite && styles.actionActive,
              ]}
              onPress={() => toggleFavorite(item)}
            />
          </View>

          <Text style={styles.sectionTitle}>
            Where to watch in {regionName(region)}
          </Text>
          <View style={styles.regionPicker}>
            <RegionChips />
          </View>
          {mine.length === 0 ? (
            <Text style={styles.hint}>
              You haven't added any streaming services for {regionName(region)}{" "}
              yet.{" "}
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
        </View>

        <MovieRow
          heading="Similar on your services"
          subheading={`Suggested by TMDB, streaming in ${regionName(region)}`}
          data={similar.data?.onMyServices}
          loading={similar.isPending}
          error={similar.error}
          onRetry={similar.refetch}
        />
        <MovieRow
          heading={
            similar.data?.onMyServices.length
              ? "More similar titles"
              : "Similar titles"
          }
          subheading="Suggested by TMDB, not on your services"
          data={similar.data?.others}
        />
        <Text style={styles.attribution}>
          Data provided by JustWatch. Movie information from TMDB.
        </Text>
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
    marginTop: 4,
    gap: 10,
  },
  title: {
    flex: 1,
    color: Colors.text,
    fontSize: 24,
    fontWeight: "700",
  },
  shareButton: {
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
  shareText: {
    color: Colors.text,
    fontWeight: "500",
    fontSize: 13,
  },
  actionButton: {
    flex: 1,
    height: 42,
  },
  actionActive: {
    borderColor: Colors.primary,
  },
  measure: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    opacity: 0,
  },
  more: {
    color: Colors.primary,
    fontWeight: "600",
    marginTop: 4,
  },
  trailer: {
    height: 180,
    marginHorizontal: 14,
    marginTop: 10,
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
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  meta: {
    color: Colors.gray,
    fontSize: 13,
  },
  description: {
    color: Colors.text,
    lineHeight: 20,
    marginTop: 6,
  },
  cast: {
    color: Colors.gray,
    marginTop: 6,
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    marginTop: 12,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 18,
    marginBottom: 8,
  },
  regionPicker: {
    marginBottom: 10,
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
    marginTop: 18,
    paddingHorizontal: 14,
  },
});
