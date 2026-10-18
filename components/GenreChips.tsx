import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import Colors from "../constants/colors";

interface GenreChipsProps {
  genres: string[];
  selected: string;
  onSelect: (genre: string) => void;
}

const GenreChips = ({ genres, selected, onSelect }: GenreChipsProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {["All", ...genres].map((genre) => {
        const active = genre === selected;
        return (
          <TouchableOpacity
            key={genre}
            activeOpacity={0.7}
            onPress={() => onSelect(genre)}
            style={[styles.chip, active && styles.activeChip]}
          >
            <Text style={[styles.text, active && { color: Colors.white }]}>
              {genre}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default GenreChips;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    backgroundColor: Colors.surface,
  },
  activeChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  text: {
    color: Colors.gray,
    fontWeight: "500",
  },
});
