import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constants/colors";
import { ProviderOption } from "../utils/streaming";

interface ProviderRowProps {
  option: ProviderOption;
  onWatch: () => void;
}

const ProviderRow = ({ option, onWatch }: ProviderRowProps) => {
  const { name, logo, color, available, mine } = option;
  return (
    <View style={[styles.row, !available && { opacity: 0.55 }]}>
      {logo ? (
        <Image source={logo} style={styles.badge} />
      ) : (
        <View style={[styles.badge, { backgroundColor: color }]}>
          <Text style={styles.badgeText}>{name[0]}</Text>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{name}</Text>
        {mine && <Text style={styles.mine}>Your service</Text>}
      </View>
      {available ? (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.watch}
          onPress={onWatch}
        >
          <Text style={styles.watchText}>Watch Now</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.unavailable}>Not Available</Text>
      )}
    </View>
  );
};

export default ProviderRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    marginBottom: 10,
    gap: 12,
  },
  badge: {
    height: 38,
    width: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 18,
  },
  name: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  mine: {
    color: Colors.primary,
    fontSize: 12,
    marginTop: 2,
  },
  watch: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  watchText: {
    color: Colors.white,
    fontWeight: "700",
  },
  unavailable: {
    color: Colors.gray,
    fontWeight: "600",
  },
});
