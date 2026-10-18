import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import Colors from "../../constants/colors";
import { UserDataProvider } from "../../context/UserDataContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, gcTime: 24 * 60 * 60 * 1000 },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserDataProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.background },
          }}
        >
          <Stack.Screen name="(login)/index" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="details/[id]" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="search" options={{ animation: "fade" }} />
        </Stack>
      </UserDataProvider>
    </QueryClientProvider>
  );
}
