import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import colors from "../theme/colors";
import typography from "../theme/typography";

export default function AppButton({
  title,
  onPress,
  style,
  textStyle,
  color = "primary",
  contrast = false,
  accessibilityLabel,
  ...props
}) {
  const btnStyle = [
    styles.button,
    {
      backgroundColor: contrast
        ? colors.contrastText
        : colors[color] || colors.primary,
    },
    style,
  ];
  const txtStyle = [
    styles.text,
    { color: contrast ? colors.contrastBackground : colors.textLight },
    textStyle,
  ];
  return (
    <TouchableOpacity
      style={btnStyle}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel || title}
      activeOpacity={0.85}
      {...props}
    >
      <Text style={txtStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 32,
    paddingVertical: 18,
    alignItems: "center",
    marginHorizontal: 40,
    marginTop: 10,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  text: {
    fontWeight: typography.fontWeightBold,
    fontSize: 20,
    fontFamily: typography.fontFamily,
  },
});
