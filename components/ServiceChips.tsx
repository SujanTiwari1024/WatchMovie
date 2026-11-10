import { Image } from "expo-image";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { imageUrl } from "../api/tmdb";
import Colors from "../constants/colors";
import { ProviderId, providersInRegion } from "../constants/providers";
import { useUserData } from "../context/UserDataContext";

interface ServiceChipsProps {
  selected: ProviderId[];
  onChange: (services: ProviderId[]) => void;
}

const ServiceChips = ({ selected, onChange }: ServiceChipsProps) => {
  const { region, myServices } = useUserData();
  const available = providersInRegion(region);
  const mine = available
    .filter((provider) => myServices.includes(provider.id))
    .map((provider) => provider.id);
  const mineActive =
    mine.length > 0 &&
    mine.length === selected.length &&
    mine.every((id) => selected.includes(id));

  const toggle = (id: ProviderId) =>
    onChange(
      selected.includes(id)
        ? selected.filter((service) => service !== id)
        : [...selected, id],
    );

  const renderTextChip = (
    label: string,
    active: boolean,
    onPress: () => void,
  ) => (
    <TouchableOpacity
      key={label}
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.chip, active && styles.activeChip]}
    >
      <Text style={[styles.text, active && styles.activeText]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {renderTextChip("All services", selected.length === 0, () =>
        onChange([]),
      )}
      {mine.length > 0 &&
        renderTextChip("My services", mineActive, () =>
          onChange(mineActive ? [] : mine),
        )}
      {available.map((provider) => {
        const active = selected.includes(provider.id);
        return (
          <TouchableOpacity
            key={provider.id}
            activeOpacity={0.7}
            onPress={() => toggle(provider.id)}
            style={[styles.chip, styles.logoChip, active && styles.activeChip]}
          >
            <Image
              source={imageUrl(provider.logoPath, "w92")}
              style={styles.logo}
            />
            <Text style={[styles.text, active && styles.activeText]}>
              {provider.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default ServiceChips;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    gap: 8,
  },
  chip: {
    height: 38,
    justifyContent: "center",
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    backgroundColor: Colors.surface,
  },
  logoChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingLeft: 6,
  },
  activeChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  logo: {
    height: 26,
    width: 26,
    borderRadius: 13,
  },
  text: {
    color: Colors.gray,
    fontWeight: "500",
  },
  activeText: {
    color: Colors.white,
  },
});
