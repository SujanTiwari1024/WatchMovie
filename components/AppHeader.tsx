import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constants/colors";
import { profilePhoto } from "../constants/images";
import { useUserData } from "../context/UserDataContext";

interface AppHeaderProps {
  showBack?: boolean;
}

const AppHeader = ({ showBack }: AppHeaderProps) => {
  const router = useRouter();
  const { username } = useUserData();

  return (
    <View style={styles.header}>
      {showBack && (
        <TouchableOpacity style={styles.logo} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.search}
        onPress={() => router.push("/search")}
      >
        <Ionicons name="search" size={16} color={Colors.gray} />
        <Text style={styles.searchText}>Search</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.greet}
        onPress={() => router.push("/profile")}
      >
        <Image source={profilePhoto} style={styles.avatar} />
        <Text numberOfLines={1} style={styles.greetText}>
          Hi, {username}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 10,
  },
  logo: {
    height: 42,
    width: 42,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  search: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  searchText: {
    color: Colors.gray,
    fontWeight: "600",
  },
  greet: {
    height: 40,
    maxWidth: 150,
    paddingLeft: 4,
    paddingRight: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    justifyContent: "center",
  },
  avatar: {
    height: 32,
    width: 32,
    borderRadius: 16,
  },
  greetText: {
    flexShrink: 1,
    color: Colors.text,
    fontWeight: "500",
  },
});
