import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { imageUrl } from "../api/tmdb";
import { TitleSummary } from "../api/types";
import Colors from "../constants/colors";
import { useGenreNames } from "../hooks/queries";

interface MovieCardProps {
  item: TitleSummary;
  width?: number;
}

const MovieCard = ({ item, width = 120 }: MovieCardProps) => {
  const router = useRouter();
  const genreNames = useGenreNames();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{ width }}
      onPress={() =>
        router.push({ pathname: "/details/[id]", params: { id: item.key } })
      }
    >
      <Image
        source={imageUrl(item.posterPath, width > 150 ? "w342" : "w185")}
        style={[styles.poster, { width, height: width * 1.5 }]}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.rating}>
        <Ionicons name="star" size={10} color="#FFC107" />
        <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
      </View>
      <Text numberOfLines={1} style={styles.title}>
        {item.title}
      </Text>
      <Text numberOfLines={1} style={styles.genre}>
        {[item.year, ...genreNames(item.genreIds).slice(0, 2)]
          .filter(Boolean)
          .join(" | ")}
      </Text>
    </TouchableOpacity>
  );
};

export default MovieCard;

const styles = StyleSheet.create({
  poster: {
    borderRadius: 10,
    backgroundColor: Colors.surface,
  },
  rating: {
    position: "absolute",
    top: 6,
    left: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  ratingText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 3,
  },
  title: {
    color: Colors.text,
    fontWeight: "600",
    marginTop: 6,
  },
  genre: {
    color: Colors.gray,
    fontSize: 12,
    marginTop: 2,
  },
});
