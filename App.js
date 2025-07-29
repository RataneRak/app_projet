import React, { createContext, useState, useContext } from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import HomeScreen from "./screens/HomeScreen";
import PictogrammesScreen from "./screens/PictogrammesScreen";
import ClavierScreen from "./screens/ClavierScreen";
import HistoriqueScreen from "./screens/HistoriqueScreen";
import FavorisScreen from "./screens/FavorisScreen";
import ParametresScreen from "./screens/ParametresScreen";
import SOSScreen from "./screens/SOSScreen";

export const SettingsContext = createContext();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const { contraste } = useContext(SettingsContext);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: contraste ? "#FFD600" : "#1976d2",
        tabBarInactiveTintColor: contraste ? "#FFD600" : "#888",
        tabBarStyle: {
          backgroundColor: contraste ? "#000" : "#fff",
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          height: 64,
          paddingBottom: 8,
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

  const settings = {
    theme,
    setTheme,
    langue,
    setLangue,
    texteGrand,
    setTexteGrand,
    modeEnfant,
    setModeEnfant,
    contraste,
    setContraste,
  };

  let navTheme = theme === "sombre" ? DarkTheme : DefaultTheme;
  if (contraste) navTheme = HighContrastTheme;

  return (
    <SettingsContext.Provider value={settings}>
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="SOS" component={SOSScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SettingsContext.Provider>
  );
}
