import React from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import Colors from "../constants/colors";

const AppTextInput: React.FC<TextInputProps> = ({ ...props }) => {
  return (
    <View style={styles.wrapper}>
      <TextInput {...props} style={styles.input} />
    </View>
  );
};

export default AppTextInput;

const styles = StyleSheet.create({
  wrapper: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: Colors.text,
  },
});
