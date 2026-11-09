import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import React from "react";
import { ColorValue, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../../../constants/colors";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface TabIconProps {
  focused: boolean;
  color: ColorValue;
  icon: IconName;
  activeIcon: IconName;
}

const TabIcon = ({ focused, color, icon, activeIcon }: TabIconProps) => (
  <View style={[styles.iconPill, focused && styles.iconPillActive]}>
    <Ionicons
      name={focused ? activeIcon : icon}
      size={22}
      color={color as string}
    />
  </View>
);

const tabs: {
  name: string;
  label: string;
  icon: IconName;
  activeIcon: IconName;
}[] = [
  {
    name: "(home)/index",
    label: "Home",
    icon: "home-outline",
    activeIcon: "home",
  },
  { name: "movies", label: "Movies", icon: "film-outline", activeIcon: "film" },
  { name: "series", label: "Series", icon: "tv-outline", activeIcon: "tv" },
  {
    name: "favorites",
    label: "Favorites",
    icon: "heart-outline",
    activeIcon: "heart",
  },
  {
    name: "watched",
    label: "Watched",
    icon: "checkmark-circle-outline",
    activeIcon: "checkmark-circle",
  },
];

const TabLayout = () => {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 10);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: Colors.gray,
        tabBarActiveTintColor: Colors.primary,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [
          styles.tabBar,
          { height: 64 + bottomPadding, paddingBottom: bottomPadding },
        ],
        tabBarItemStyle: styles.tabItem,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            tabBarLabel: tab.label,
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                focused={focused}
                color={color}
                icon={tab.icon}
                activeIcon={tab.activeIcon}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};
export default TabLayout;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 0,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 12,
  },
  tabItem: {
    paddingTop: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },
  iconPill: {
    width: 52,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  iconPillActive: {
    backgroundColor: Colors.primary + "1A",
  },
});
