import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/colors";
import { TitleSummary } from "../api/types";
import AppHeader from "./AppHeader";
import TitleGrid from "./TitleGrid";

interface LibraryScreenProps {
  heading: string;
  data: TitleSummary[];
  emptyIcon: React.ComponentProps<typeof Ionicons>["name"];
  emptyText: string;
}

const LibraryScreen = ({
  heading,
  data,
  emptyIcon,
  emptyText,
}: LibraryScreenProps) => {
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <AppHeader />
      {data.length === 0 ? (
        <>
          <Text style={styles.heading}>{heading}</Text>
          <View style={styles.empty}>
            <Ionicons name={emptyIcon} size={48} color={Colors.gray} />
            <Text style={styles.emptyText}>{emptyText}</Text>
          </View>
        </>
      ) : (
        <TitleGrid
          columns={2}
          data={data}
          header={
            <Text style={styles.heading}>
              {heading} <Text style={styles.count}>({data.length})</Text>
            </Text>
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
  heading: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "700",
    padding: 14,
  },
  count: {
    color: Colors.gray,
    fontSize: 20,
    fontWeight: "500",
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
