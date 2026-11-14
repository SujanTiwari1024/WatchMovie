import React from "react";
import { Text, TextProps } from "react-native";

export const MAX_FONT_SCALE = 1.2;

const AppText = (props: TextProps) => (
  <Text maxFontSizeMultiplier={MAX_FONT_SCALE} {...props} />
);

export default AppText;
