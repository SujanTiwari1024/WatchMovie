import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Colors from "../constants/colors";
interface AppButtonProps {
  title: string;
  icon?: any;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  primary?: boolean;
}

const AppButton = ({
  title,
  icon,
  style,
  onPress,
  primary,
}: AppButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={[styles.container, primary && styles.primary, style]}
    >
      <View style={{ flexDirection: "row" }}>
        <Text
          style={{
            color: primary ? Colors.white : Colors.text,
            fontWeight: "600",
            marginRight: 6,
          }}
        >
          {title}
        </Text>
        {icon}
      </View>
    </TouchableOpacity>
  );
};
export default AppButton;

const styles = StyleSheet.create({
  container: {
    height: 45,
    width: 140,
    borderRadius: 10,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  primary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
});
