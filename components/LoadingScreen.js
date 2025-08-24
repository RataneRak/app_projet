import React from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../theme/colors";
import typography from "../theme/typography";

function LoadingScreen({ message }) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="chat-processing"
        size={80}
        color={colors.primary}
      />
      <Text style={styles.title}>Tableau de communication</Text>
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={styles.spinner}
      />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

LoadingScreen.propTypes = {
  message: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: typography.fontSizeXL,
    fontWeight: typography.fontWeightBold,
    color: colors.primary,
    marginTop: 20,
    marginBottom: 40,
    textAlign: "center",
    fontFamily: typography.fontFamily,
  },
  spinner: {
    marginVertical: 20,
  },
  message: {
    fontSize: typography.fontSizeRegular,
    color: colors.text,
    textAlign: "center",
    fontFamily: typography.fontFamily,
  },
});

export default LoadingScreen;
