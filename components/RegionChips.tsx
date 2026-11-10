import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constants/colors";
import { regions } from "../constants/providers";
import { useUserData } from "../context/UserDataContext";

const RegionChips = () => {
  const { region, setRegion } = useUserData();
  return (
    <View style={styles.regions}>
      {regions.map((r) => {
        const active = region === r.code;
        return (
          <TouchableOpacity
            key={r.code}
            onPress={() => setRegion(r.code)}
            style={[styles.region, active && styles.regionActive]}
          >
            <Text style={[styles.text, active && styles.textActive]}>
              {r.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default RegionChips;

const styles = StyleSheet.create({
  regions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  region: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    backgroundColor: Colors.surface,
  },
  regionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  text: {
    color: Colors.text,
    fontWeight: "500",
  },
  textActive: {
    color: Colors.white,
  },
});
