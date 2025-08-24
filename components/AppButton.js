import React from "react";
import PropTypes from "prop-types";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import colors from "../theme/colors";
import { typography } from "../theme/typography";

function AppButton({
  title,
  onPress,
  style,
  textStyle,
  color,
  contrast,
  accessibilityLabel,
  disabled,
  loading,
  size,
  variant,
  ...props
}) {
  const getButtonStyle = () => {
    const baseStyle = [styles.button];

    // Taille
    if (size === "small") baseStyle.push(styles.small);
    else if (size === "large") baseStyle.push(styles.large);

    // Variant
    if (variant === "outlined") {
      baseStyle.push(styles.outlined);
      if (contrast) {
        baseStyle.push({ borderColor: colors.contrastText });
      } else {
        baseStyle.push({ borderColor: colors[color] || colors.primary });
      }
    } else if (variant === "text") {
      baseStyle.push(styles.textVariant);
    } else {
      // filled (default)
      if (contrast) {
        baseStyle.push({ backgroundColor: colors.contrastText });
      } else {
        baseStyle.push({ backgroundColor: colors[color] || colors.primary });
      }
    }

    // Disabled
    if (disabled) {
      baseStyle.push(styles.disabled);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text];

    // Taille
    if (size === "small") baseStyle.push(styles.smallText);
    else if (size === "large") baseStyle.push(styles.largeText);

    // Variant
    if (variant === "outlined" || variant === "text") {
      if (contrast) {
        baseStyle.push({ color: colors.contrastText });
      } else {
        baseStyle.push({ color: colors[color] || colors.primary });
      }
    } else {
      // filled
      baseStyle.push({
        color: contrast ? colors.contrastBackground : colors.textLight,
      });
    }

    // Disabled
    if (disabled) {
      baseStyle.push(styles.disabledText);
    }

    return baseStyle;
  };

  const btnStyle = [...getButtonStyle(), style];
  const txtStyle = [...getTextStyle(), textStyle];

  return (
    <TouchableOpacity
      style={btnStyle}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: loading }}
      activeOpacity={disabled ? 1 : 0.85}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "filled" ? colors.textLight : colors.primary}
        />
      ) : (
        <Text style={txtStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

AppButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  style: PropTypes.object,
  textStyle: PropTypes.object,
  color: PropTypes.string,
  contrast: PropTypes.bool,
  accessibilityLabel: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  size: PropTypes.string,
  variant: PropTypes.string,
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 32,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 40,
    marginTop: 10,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    minHeight: 56,
  },
  small: {
    paddingVertical: 12,
    minHeight: 40,
    marginHorizontal: 20,
  },
  large: {
    paddingVertical: 24,
    minHeight: 72,
    marginHorizontal: 60,
  },
  outlined: {
    backgroundColor: "transparent",
    borderWidth: 2,
    elevation: 1,
  },
  textVariant: {
    backgroundColor: "transparent",
    elevation: 0,
    shadowOpacity: 0,
  },
  disabled: {
    backgroundColor: "#e0e0e0",
    borderColor: "#e0e0e0",
    elevation: 0,
    shadowOpacity: 0,
  },
  text: {
    fontWeight: typography.fontWeightBold,
    fontSize: 20,
    fontFamily: typography.fontFamily,
    textAlign: "center",
  },
  smallText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 24,
  },
  disabledText: {
    color: "#9e9e9e",
  },
});

export default AppButton;
