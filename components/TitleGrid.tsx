import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
} from "react-native";
import { TitleSummary } from "../api/types";
import Colors from "../constants/colors";
import MovieCard from "./MovieCard";
import StatusView from "./StatusView";

interface TitleGridProps {
  data: TitleSummary[];
  header?: React.ReactElement;
  emptyText?: string;
  columns?: number;
  loading?: boolean;
  error?: unknown;
  onRetry?: () => void;
  onEndReached?: () => void;
  loadingMore?: boolean;
}

const GAP = 12;
const PADDING = 14;

const TitleGrid = ({
  data,
  header,
  emptyText = "Nothing here yet.",
  columns = 3,
  loading,
  error,
  onRetry,
  onEndReached,
  loadingMore,
}: TitleGridProps) => {
  const { width } = useWindowDimensions();
  const cardWidth = (width - PADDING * 2 - GAP * (columns - 1)) / columns;

  return (
    <FlatList
      data={loading || error ? [] : data}
      key={columns}
      numColumns={columns}
      keyExtractor={(item) => item.key}
      ListHeaderComponent={header}
      ListEmptyComponent={
        loading || error ? (
          <StatusView loading={loading} error={error} onRetry={onRetry} />
        ) : (
          <Text style={styles.empty}>{emptyText}</Text>
        )
      }
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator color={Colors.primary} style={{ margin: 20 }} />
        ) : null
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.6}
      columnWrapperStyle={{ gap: GAP, paddingHorizontal: PADDING }}
      contentContainerStyle={{ gap: 18, paddingBottom: 24 }}
      renderItem={({ item }) => <MovieCard item={item} width={cardWidth} />}
    />
  );
};

export default TitleGrid;

const styles = StyleSheet.create({
  empty: {
    color: Colors.gray,
    textAlign: "center",
    marginTop: 40,
    paddingHorizontal: 30,
  },
});
