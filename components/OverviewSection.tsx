import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { imageUrl } from "../api/tmdb";
import { TitleSummary } from "../api/types";
import Colors from "../constants/colors";
import { profilePhoto } from "../constants/images";
import { useUserData } from "../context/UserDataContext";
import { useGenreNames } from "../hooks/queries";

interface OverviewSectionProps {
  featured?: TitleSummary;
}

const OverviewSection = ({ featured }: OverviewSectionProps) => {
  const router = useRouter();
  const { username } = useUserData();
  const genreNames = useGenreNames();
  const openDetails = () =>
    featured &&
    router.push({ pathname: "/details/[id]", params: { id: featured.key } });

  return (
    <View style={styles.overview}>
      <Image
        style={styles.overviewImage}
        source={imageUrl(
          featured?.backdropPath ?? featured?.posterPath,
          "w780",
        )}
        contentFit="cover"
        transition={300}
      />

      {/*Overview Cover*/}
      <View style={styles.cover}>
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => router.push("/profile")}
            >
              <Image style={styles.profile} source={profilePhoto} />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.greet}>Hi, {username}</Text>
                <Text style={{ color: Colors.overlayText, fontSize: 16 }}>
                  Welcome back!
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.searchWrapper}
              activeOpacity={0.8}
              onPress={() => router.push("/search")}
            >
              <Ionicons name="search" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        {featured && (
          <LinearGradient
            style={styles.blur}
            colors={["transparent", "rgba(0,0,0,0.85)"]}
          >
            <TouchableOpacity activeOpacity={0.9} onPress={openDetails}>
              <Image
                source={imageUrl(featured.posterPath, "w185")}
                style={styles.poster}
              />
            </TouchableOpacity>
            <View style={{ flex: 1, gap: 8 }}>
              <View style={styles.categoryBadge}>
                <Text
                  style={{
                    color: Colors.text,
                    fontWeight: "500",
                    fontSize: 14,
                  }}
                >
                  {featured.mediaType === "tv" ? "Series" : "Movie"}
                </Text>
              </View>
              <Text
                numberOfLines={2}
                style={{ fontSize: 24, fontWeight: "700", color: Colors.white }}
              >
                {featured.title}
              </Text>
              <Text numberOfLines={1} style={{ color: Colors.overlayText }}>
                {[featured.year, ...genreNames(featured.genreIds).slice(0, 2)]
                  .filter(Boolean)
                  .join(" | ")}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.playbtn}
              onPress={openDetails}
            >
              <Ionicons name="play" size={24} color={Colors.white} />
            </TouchableOpacity>
          </LinearGradient>
        )}
      </View>
    </View>
  );
};

export default OverviewSection;

const styles = StyleSheet.create({
  overview: {
    height: 400,
    position: "relative",
    backgroundColor: Colors.surface,
  },
  overviewImage: {
    height: "100%",
    width: "100%",
  },
  cover: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },
  profile: {
    height: 45,
    width: 45,
    borderRadius: 50,
  },
  greet: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 22,
  },
  searchWrapper: {
    height: 50,
    width: 50,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  blur: {
    width: "100%",
    padding: 14,
    paddingTop: 40,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 14,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 10,
  },
  categoryBadge: {
    padding: 8,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 14,
  },
  playbtn: {
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
  },
});
