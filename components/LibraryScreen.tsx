import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/colors";
import { TitleSummary } from "../api/types";
import { filterByTitle } from "../utils/filtering";
import AppHeader from "./AppHeader";
import TitleGrid from "./TitleGrid";

interface LibraryScreenProps {
  heading: string;
  data: TitleSummary[];
  emptyIcon: React.ComponentProps<typeof Ionicons>["name"];
  emptyText: string;
  countSuffix: string;
}

const LibraryScreen = ({
  heading,
  data,
  emptyIcon,
  emptyText,
  countSuffix,
}: LibraryScreenProps) => {
  const [query, setQuery] = useState("");
  const results = filterByTitle(data, query);
  const trimmed = query.trim();
  const plural = (n: number, word: string, many = `${word}s`) =>
    `${n} ${n === 1 ? word : many}`;
  const placeholder =
    data.length > 0
      ? `Search among ${plural(data.length, "title")} ${countSuffix}`
      : `Search ${heading}`;

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <AppHeader
        searchLabel={placeholder}
        searchValue={query}
        onSearchChange={setQuery}
      />
      {data.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name={emptyIcon} size={48} color={Colors.gray} />
          <Text style={styles.emptyText}>{emptyText}</Text>
        </View>
      ) : (
        <TitleGrid
          columns={2}
          data={results}
          emptyText={`Nothing in ${heading} matches "${trimmed}".`}
          header={
            trimmed && results.length > 0 ? (
              <Text style={styles.matches}>
                {plural(results.length, "match", "matches")} for "{trimmed}"
              </Text>
            ) : (
              <View style={{ height: 6 }} />
            )
          }
        />
      )}
    </SafeAreaView>
  );
};

export default LibraryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  matches: {
    color: Colors.gray,
    fontSize: 13,
    paddingHorizontal: 14,
    paddingTop: 4,
  },
  empty: {
    alignItems: "center",
    marginTop: 80,
    gap: 14,
    paddingHorizontal: 30,
  },
  emptyText: {
    color: Colors.gray,
    textAlign: "center",
  },
});
