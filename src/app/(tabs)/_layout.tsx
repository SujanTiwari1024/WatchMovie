import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import React from "react";
import Colors from "../../../constants/colors";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: Colors.gray,
        tabBarActiveTintColor: Colors.primary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="(home)/index"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={20} color={color} />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="movies"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="film" size={20} color={color} />
          ),
          tabBarLabel: "Movies",
        }}
      />
      <Tabs.Screen
        name="series"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="tv" size={20} color={color} />
          ),
          tabBarLabel: "Series",
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={20}
              color="red"
            />
          ),
          tabBarLabel: "Favorites",
        }}
      />
      <Tabs.Screen
        name="watched"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="checkmark-circle" size={20} color={color} />
          ),
          tabBarLabel: "Watched",
        }}
      />
    </Tabs>
  );
};
export default TabLayout;
