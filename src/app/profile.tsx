import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import { Image } from "expo-image";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../../components/AppButton";
import Colors from "../../constants/colors";
import { profilePhoto } from "../../constants/images";
import { imageUrl } from "../../api/tmdb";
import { providersInRegion, regions } from "../../constants/providers";
import { useUserData } from "../../context/UserDataContext";

const ProfileScreen = () => {
  const router = useRouter();
  const {
    username,
    region,
    myServices,
    favorites,
    watched,
    setRegion,
    toggleService,
  } = useUserData();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Profile</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 40 }}>
        <View style={styles.user}>
          <Image style={styles.avatar} source={profilePhoto} />
          <Text style={styles.name}>{username}</Text>
        </View>

        <View style={styles.stats}>
          <TouchableOpacity
            style={styles.stat}
            onPress={() => router.push("/(tabs)/favorites")}
          >
            <Text style={styles.statValue}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.stat}
            onPress={() => router.push("/(tabs)/watched")}
          >
            <Text style={styles.statValue}>{watched.length}</Text>
            <Text style={styles.statLabel}>Watched</Text>
          </TouchableOpacity>
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {
                providersInRegion(region).filter((p) =>
                  myServices.includes(p.id),
                ).length
              }
            </Text>
            <Text style={styles.statLabel}>Services</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>My streaming services</Text>
        <Text style={styles.hint}>
          Pick the services you subscribe to. They are shown first on every
          title.
        </Text>
        <View style={styles.services}>
          {providersInRegion(region).map((p) => {
            const active = myServices.includes(p.id);
            return (
              <TouchableOpacity
                key={p.id}
                activeOpacity={0.8}
                onPress={() => toggleService(p.id)}
                style={[styles.service, active && { borderColor: p.color }]}
              >
                <Image
                  source={imageUrl(p.logoPath, "w92")}
                  style={styles.badge}
                />
                <Text style={styles.serviceName}>{p.name}</Text>
                <Ionicons
                  name={active ? "checkmark-circle" : "ellipse-outline"}
                  size={20}
                  color={active ? Colors.primary : Colors.gray}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Region</Text>
        <Text style={styles.hint}>
          Streaming availability differs between countries.
        </Text>
        <View style={styles.regions}>
          {regions.map((r) => (
            <TouchableOpacity
              key={r.code}
              onPress={() => setRegion(r.code)}
              style={[styles.region, region === r.code && styles.regionActive]}
            >
              <Text
                style={{
                  color: region === r.code ? Colors.white : Colors.text,
                  fontWeight: "500",
                }}
              >
                {r.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <AppButton
          title="Log out"
          icon={
            <Ionicons name="log-out-outline" size={16} color={Colors.text} />
          }
          style={{
            width: "100%",
            marginTop: 30,
            marginRight: 0,
            borderColor: "red",
          }}
          onPress={() => router.replace("/(login)")}
        />
        <Text style={styles.attribution}>
          This product uses the TMDB API but is not endorsed or certified by
          TMDB. Streaming availability data by JustWatch.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  topTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  user: {
    alignItems: "center",
    marginTop: 10,
  },
  avatar: {
    height: 90,
    width: 90,
    borderRadius: 45,
  },
  name: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: "700",
    marginTop: 10,
  },
  stats: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  stat: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.surface,
  },
  statValue: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: "700",
  },
  statLabel: {
    color: Colors.gray,
    marginTop: 2,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 28,
  },
  hint: {
    color: Colors.gray,
    marginTop: 4,
    marginBottom: 12,
  },
  services: {
    gap: 10,
  },
  service: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    backgroundColor: Colors.surface,
  },
  badge: {
    height: 34,
    width: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },
  serviceName: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
    fontWeight: "500",
  },
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
  attribution: {
    color: Colors.gray,
    fontSize: 11,
    textAlign: "center",
    marginTop: 20,
  },
  regionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
});
