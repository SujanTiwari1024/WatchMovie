import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../../../components/AppButton";
import AppTextInput from "../../../components/AppTextInput";
import Colors from "../../../constants/colors";
import { useUserData } from "../../../context/UserDataContext";

const socialLogins = [
  { name: "Facebook", icon: "logo-facebook", color: "#1877F2" },
  { name: "Google", icon: "logo-google", color: "#EA4335" },
  { name: "Twitter", icon: "logo-twitter", color: "#1DA1F2" },
] as const;

const LoginScreen = () => {
  const router = useRouter();
  const { username: savedName, setUsername } = useUserData();
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");

  const enterApp = () => {
    if (username.trim()) setUsername(username.trim());
    router.replace("/(tabs)/(home)");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={styles.container}>
        <Text style={styles.logo}>WatchMovie</Text>
        <Text style={styles.text}>Find where to watch, fast.</Text>
        <View style={styles.inputWrapper}>
          <AppTextInput
            placeholder={`Username (${savedName})`}
            placeholderTextColor={Colors.gray}
            autoCapitalize="none"
            value={username}
            onChangeText={setName}
          />
          <AppTextInput
            placeholder="Password"
            placeholderTextColor={Colors.gray}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Text style={{ alignSelf: "flex-end", color: Colors.gray }}>
            Forgot password?
          </Text>
        </View>
        <AppButton
          primary
          style={{ width: "100%", height: 60, marginRight: 0 }}
          title="Login"
          onPress={enterApp}
        />
        <Text style={styles.createaccount}>
          Don't have an account?{" "}
          <Text
            onPress={() => router.push("/signup")}
            style={{ color: Colors.primary }}
          >
            Sign Up
          </Text>
        </Text>

        <Text style={styles.loginWith}>Login with:</Text>
        <View style={styles.socialRow}>
          {socialLogins.map((s) => (
            <TouchableOpacity
              key={s.name}
              activeOpacity={0.8}
              style={styles.social}
              onPress={enterApp}
            >
              <Ionicons name={s.icon} size={20} color={s.color} />
              <Text style={styles.socialText}>{s.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    color: "red",
    fontSize: 40,
    fontWeight: "800",
  },
  text: {
    fontWeight: "600",
    color: Colors.text,
    fontSize: 22,
    marginTop: 6,
  },
  inputWrapper: {
    width: "100%",
    marginVertical: 26,
  },
  createaccount: {
    color: Colors.gray,
    fontSize: 14,
    marginTop: 14,
  },
  loginWith: {
    color: Colors.gray,
    marginTop: 40,
    marginBottom: 12,
  },
  socialRow: {
    flexDirection: "row",
    gap: 10,
  },
  social: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    backgroundColor: Colors.surface,
  },
  socialText: {
    color: Colors.text,
    fontWeight: "500",
    fontSize: 13,
  },
});
