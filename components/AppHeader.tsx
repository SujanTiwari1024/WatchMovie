import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../constants/colors";

interface AppHeaderProps {
  showBack?: boolean;
  searchLabel?: string;
  onSearchPress?: () => void;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  onSearchClose?: () => void;
  autoFocus?: boolean;
}

const AppHeader = ({
  showBack,
  searchLabel = "Search",
  onSearchPress,
  searchValue,
  onSearchChange,
  onSearchClose,
  autoFocus,
}: AppHeaderProps) => {
  const router = useRouter();
  const showClear = !!onSearchClose || !!searchValue;

  return (
    <View style={styles.header}>
      {showBack && (
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
      )}
      {onSearchChange ? (
        <View style={[styles.search, styles.searchInputWrapper]}>
          <Ionicons name="search" size={16} color={Colors.gray} />
          <TextInput
            style={styles.input}
            value={searchValue}
            onChangeText={onSearchChange}
            placeholder={searchLabel}
            placeholderTextColor={Colors.gray}
            autoFocus={autoFocus}
            autoCorrect={false}
            returnKeyType="search"
          />
          {showClear && (
            <TouchableOpacity
              hitSlop={10}
              onPress={() =>
                onSearchClose ? onSearchClose() : onSearchChange("")
              }
            >
              <Ionicons name="close-circle" size={18} color={Colors.gray} />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.search}
          onPress={onSearchPress ?? (() => router.push("/search"))}
        >
          <Ionicons name="search" size={16} color={Colors.gray} />
          <Text style={styles.searchText}>{searchLabel}</Text>
        </TouchableOpacity>
      )}
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
  back: {
    height: 40,
    width: 40,
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
  searchInputWrapper: {
    justifyContent: "flex-start",
    paddingHorizontal: 14,
  },
  searchText: {
    color: Colors.gray,
    fontWeight: "600",
  },
  input: {
    flex: 1,
    height: "100%",
    color: Colors.text,
    paddingVertical: 0,
  },
});
