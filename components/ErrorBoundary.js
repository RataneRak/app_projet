import React from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../theme/colors";
import typography from "../theme/typography";
import AppButton from "./AppButton";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Ici vous pourriez envoyer l'erreur à un service de monitoring
    console.error("Erreur capturée par ErrorBoundary:", error, errorInfo);
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={80}
            color={colors.error}
          />
          <Text style={styles.title}>Oups ! Une erreur s&apos;est produite</Text>
          <Text style={styles.message}>
            L&apos;application a rencontré un problème inattendu. Veuillez réessayer
            ou redémarrer l&apos;application.
          </Text>

          <View style={styles.buttonContainer}>
            <AppButton
              title="Réessayer"
              onPress={this.handleRestart}
              color="primary"
              accessibilityLabel="Réessayer de charger l'application"
            />
            <AppButton
              title="Redémarrer l'app"
              onPress={() => {
                // Ici vous pourriez implémenter un redémarrage complet
                this.handleRestart();
              }}
              color="secondary"
              variant="outlined"
              accessibilityLabel="Redémarrer complètement l'application"
            />
          </View>

          {this.state.error && (
            <View style={styles.debugContainer}>
              <Text style={styles.debugTitle}>Informations de débogage :</Text>
              <Text style={styles.debugText}>
                {this.state.error.toString()}
              </Text>
              <Text style={styles.debugText}>
                {this.state.errorInfo.componentStack}
              </Text>
            </View>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
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
    fontSize: typography.fontSizeLarge,
    fontWeight: typography.fontWeightBold,
    color: colors.error,
    marginTop: 20,
    marginBottom: 16,
    textAlign: "center",
    fontFamily: typography.fontFamily,
  },
  message: {
    fontSize: typography.fontSizeRegular,
    color: colors.text,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
    fontFamily: typography.fontFamily,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  debugContainer: {
    marginTop: 32,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    width: "100%",
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: typography.fontWeightBold,
    color: colors.error,
    marginBottom: 8,
    fontFamily: typography.fontFamily,
  },
  debugText: {
    fontSize: 12,
    color: colors.text,
    fontFamily: "monospace",
    marginBottom: 4,
  },
});

export default ErrorBoundary;
