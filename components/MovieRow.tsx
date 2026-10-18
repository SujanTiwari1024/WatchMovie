import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { TitleSummary } from "../api/types";
import Colors from "../constants/colors";
import MovieCard from "./MovieCard";
import StatusView from "./StatusView";

interface MovieRowProps {
  heading: string;
  subheading?: string;
  data?: TitleSummary[];
  cardWidth?: number;
  loading?: boolean;
  error?: unknown;
  onRetry?: () => void;
  emptyText?: string;
}

const MovieRow = ({
  heading,
  subheading,
  data = [],
  cardWidth,
  loading,
  error,
  onRetry,
  emptyText,
}: MovieRowProps) => {
  if (!loading && !error && data.length === 0 && !emptyText) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>{heading}</Text>
      {subheading && <Text style={styles.subheading}>{subheading}</Text>}
      {loading || error ? (
        <StatusView compact loading={loading} error={error} onRetry={onRetry} />
      ) : data.length === 0 ? (
        <Text style={styles.empty}>{emptyText}</Text>
      ) : (
        <FlatList
          horizontal
          data={data}
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 14,
            gap: 12,
            paddingTop: 10,
          }}
          renderItem={({ item }) => <MovieCard item={item} width={cardWidth} />}
        />
      )}
    </View>
  );
};

export default MovieRow;

const styles = StyleSheet.create({
  section: {
    marginTop: 22,
  },
  heading: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "700",
    paddingHorizontal: 14,
  },
  subheading: {
    color: Colors.gray,
    fontSize: 13,
    paddingHorizontal: 14,
    marginTop: 2,
  },
  empty: {
    color: Colors.gray,
    paddingHorizontal: 14,
    marginTop: 10,
  },
});
