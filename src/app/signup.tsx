import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../../components/AppButton";
import AppTextInput from "../../components/AppTextInput";
import Colors from "../../constants/colors";
import { useUserData } from "../../context/UserDataContext";

const SignUpScreen = () => {
  const router = useRouter();
  const { setUsername } = useUserData();
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    if (username.trim()) setUsername(username.trim());
    router.replace("/(tabs)/(home)");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={styles.container}>
        <Text style={styles.text}>Save your favorites!</Text>
        <Text style={styles.text}>Join today.</Text>
        <View style={styles.inputWrapper}>
          <AppTextInput
            placeholder="Username"
            placeholderTextColor={Colors.gray}
            autoCapitalize="none"
            value={username}
            onChangeText={setName}
          />
          <AppTextInput
            placeholder="Email"
            placeholderTextColor={Colors.gray}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <AppTextInput
            placeholder="Password"
            placeholderTextColor={Colors.gray}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Text style={styles.sub}>
            By joining you agree to the terms and conditions.
          </Text>
        </View>
        <AppButton
          primary
          style={{ width: "100%", height: 60, marginRight: 0 }}
          title="Sign Up"
          onPress={handleSignUp}
        />
        <Text style={styles.createaccount}>
          Already have an account?{" "}
          <Text onPress={() => router.back()} style={{ color: Colors.primary }}>
            Login
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};
export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "600",
    color: Colors.text,
    fontSize: 26,
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
  sub: {
    fontSize: 12,
    color: Colors.gray,
  },
});
