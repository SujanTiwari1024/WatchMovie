import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppTextInput from "../../components/AppTextInput";
import TitleGrid from "../../components/TitleGrid";
import Colors from "../../constants/colors";
import { useSearch, useTrending } from "../../hooks/queries";
import { useDebounce } from "../../hooks/useDebounce";

const SearchScreen = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query.trim());

  const search = useSearch(debounced);
  const trending = useTrending();
  const searching = debounced.length >= 2;
  const active = searching ? search : trending;
  const results = active.data ?? [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 10 }}
        >
          <Ionicons name="chevron-back" size={26} color={Colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <AppTextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder="Search movies and series"
            placeholderTextColor={Colors.gray}
            returnKeyType="search"
          />
        </View>
      </View>

      <TitleGrid
        data={results}
        loading={active.isPending && (searching || !trending.data)}
        error={active.error}
        onRetry={active.refetch}
        header={
          <Text style={styles.label}>
            {searching
              ? `${results.length} ${results.length === 1 ? "result" : "results"} for "${debounced}"`
              : "Trending this week"}
          </Text>
        }
        emptyText="No matches. Try another title."
      />
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  label: {
    color: Colors.gray,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
});
