import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { errorMessage } from "../api/tmdb";
import Colors from "../constants/colors";

interface StatusViewProps {
  loading?: boolean;
  error?: unknown;
  onRetry?: () => void;
  compact?: boolean;
}

const StatusView = ({ loading, error, onRetry, compact }: StatusViewProps) => {
  if (loading) {
    return (
      <View style={[styles.container, compact && styles.compact]}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }
  if (!error) return null;
  return (
    <View style={[styles.container, compact && styles.compact]}>
      <Ionicons
        name="cloud-offline-outline"
        size={compact ? 24 : 40}
        color={Colors.gray}
      />
      <Text style={styles.text}>{errorMessage(error)}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retry} onPress={onRetry}>
          <Text style={styles.retryText}>Try again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default StatusView;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    gap: 10,
  },
  compact: {
    padding: 14,
    minHeight: 120,
  },
  text: {
    color: Colors.gray,
    textAlign: "center",
  },
  retry: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.primary,
  },
  retryText: {
    color: Colors.white,
    fontWeight: "600",
  },
});
