import React, { useState, useEffect } from "react";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { TTSProvider } from "./services/TTSContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PropTypes from "prop-types";
import { SettingsContext } from "./services/SettingsContext";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import HomeScreen from "./screens/HomeScreen";
import PictogrammesScreen from "./screens/PictogrammesScreen";
import ClavierScreen from "./screens/ClavierScreen";
import HistoriqueScreen from "./screens/HistoriqueScreen";
import FavorisScreen from "./screens/FavorisScreen";
import ParametresScreen from "./screens/ParametresScreen";
import SOSScreen from "./screens/SOSScreen";
import CustomMessagesScreen from "./screens/CustomMessagesScreen";
import TextInputScreen from "./screens/TextInputScreen";
import VoiceTestScreen from "./screens/VoiceTestScreen";
import LoadingScreen from "./components/LoadingScreen";
import ErrorBoundary from "./components/ErrorBoundary";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "react-native";
import { setI18nConfig } from "./i18n";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs({ contraste }) {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: contraste ? "#FFD600" : "#1976d2",
        tabBarInactiveTintColor: contraste ? "#FFD600" : "#888",
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: contraste ? "#000" : "#fff",
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          height: 64 + insets.bottom,
          paddingBottom: Math.max(8, insets.bottom),
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Accueil") iconName = "home";
          else if (route.name === "Pictogrammes") iconName = "apps";
          else if (route.name === "Clavier") iconName = "keyboard-outline";
          else if (route.name === "Historique") iconName = "history";
          else if (route.name === "Favoris") iconName = "star";
          else if (route.name === "Paramètres") iconName = "cog";
          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
      })}
    >
      <Tab.Screen name="Accueil" component={HomeScreen} />
      <Tab.Screen name="Pictogrammes" component={PictogrammesScreen} />
      <Tab.Screen name="Clavier" component={ClavierScreen} />
      <Tab.Screen name="Historique" component={HistoriqueScreen} />
      <Tab.Screen name="Favoris" component={FavorisScreen} />
      <Tab.Screen name="Paramètres" component={ParametresScreen} />
    </Tab.Navigator>
  );
}

MainTabs.propTypes = {
  contraste: PropTypes.bool,
};

const HighContrastTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#000",
    card: "#000",
    text: "#FFD600",
    border: "#FFD600",
    primary: "#FFD600",
    notification: "#FFD600",
  },
};

export default function App() {
  const [theme, setTheme] = useState("clair");
  const [langue, setLangue] = useState("fr");
  const [texteGrand, setTexteGrand] = useState(false);
  const [modeEnfant, setModeEnfant] = useState(false);
  const [contraste, setContraste] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les paramètres sauvegardés
  useEffect(() => {
    loadSettings();
  }, []);

  // Mettre à jour la langue globale i18n
  useEffect(() => {
    setI18nConfig(langue);
  }, [langue]);

  const loadSettings = async () => {
    try {
      const [
        savedTheme,
        savedLangue,
        savedTexteGrand,
        savedModeEnfant,
        savedContraste,
      ] = await Promise.all([
        AsyncStorage.getItem("@settings_theme"),
        AsyncStorage.getItem("@settings_langue"),
        AsyncStorage.getItem("@settings_texte_grand"),
        AsyncStorage.getItem("@settings_mode_enfant"),
        AsyncStorage.getItem("@settings_contraste"),
      ]);

      if (savedTheme) setTheme(savedTheme);
      if (savedLangue) setLangue(savedLangue);
      if (savedTexteGrand) setTexteGrand(savedTexteGrand === "true");
      if (savedModeEnfant) setModeEnfant(savedModeEnfant === "true");
      if (savedContraste) setContraste(savedContraste === "true");
    } catch (error) {
      console.error("Erreur lors du chargement des paramètres:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sauvegarder les paramètres
  const saveSettings = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des paramètres:", error);
    }
  };

  // Wrappers pour sauvegarder automatiquement
  const setThemeAndSave = (newTheme) => {
    setTheme(newTheme);
    saveSettings("@settings_theme", newTheme);
  };

  const setLangueAndSave = (newLangue) => {
    setLangue(newLangue);
    setI18nConfig(newLangue);
    saveSettings("@settings_langue", newLangue);
  };

  const setTexteGrandAndSave = (newTexteGrand) => {
    setTexteGrand(newTexteGrand);
    saveSettings("@settings_texte_grand", newTexteGrand);
  };

  const setModeEnfantAndSave = (newModeEnfant) => {
    setModeEnfant(newModeEnfant);
    saveSettings("@settings_mode_enfant", newModeEnfant);
  };

  const setContrasteAndSave = (newContraste) => {
    setContraste(newContraste);
    saveSettings("@settings_contraste", newContraste);
  };

  const settings = {
    theme,
    setTheme: setThemeAndSave,
    langue,
    setLangue: setLangueAndSave,
    texteGrand,
    setTexteGrand: setTexteGrandAndSave,
    modeEnfant,
    setModeEnfant: setModeEnfantAndSave,
    contraste,
    setContraste: setContrasteAndSave,
    isLoading,
  };

  let navTheme = theme === "sombre" ? DarkTheme : DefaultTheme;
  if (contraste) navTheme = HighContrastTheme;

  if (isLoading) {
    return <LoadingScreen message="Chargement des paramètres..." />;
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <SettingsContext.Provider value={settings}>
          {/* ⤵️ Ajout du provider TTS ici */}
          <TTSProvider>
            <NavigationContainer theme={navTheme}>
              <StatusBar
                translucent={false}
                backgroundColor={contraste ? "#000" : "#fff"}
                barStyle={contraste ? "light-content" : "dark-content"}
              />
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="MainTabs">
                  {() => <MainTabs contraste={contraste} />}
                </Stack.Screen>
                <Stack.Screen name="SOS" component={SOSScreen} />
                <Stack.Screen
                  name="CustomMessages"
                  component={CustomMessagesScreen}
                />
                <Stack.Screen name="TextInput" component={TextInputScreen} />
                <Stack.Screen name="VoiceTest" component={VoiceTestScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </TTSProvider>
        </SettingsContext.Provider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
