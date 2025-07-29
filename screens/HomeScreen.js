import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SettingsContext } from "../App";
import colors from "../theme/colors";
import typography from "../theme/typography";
import AppButton from "../components/AppButton";

const ALL_CATEGORIES = [
  { key: "nourriture", label: "Nourriture", icon: "food", color: "#90caf9" },
  { key: "boisson", label: "Boisson", icon: "cup-water", color: "#a5d6a7" },
  { key: "besoins", label: "Besoins", icon: "toilet", color: "#ffe082" },
  { key: "maison", label: "Maison", icon: "home", color: "#b39ddb" },
  {
    key: "emotions",
    label: "Émotions",
    icon: "emoticon-happy-outline",
    color: "#ffab91",
  },
  { key: "activites", label: "Activités", icon: "run", color: "#80cbc4" },
  { key: "appeler", label: "Appeler", icon: "phone", color: "#f48fb1" },
  { key: "autre", label: "Autre", icon: "dots-horizontal", color: "#cfd8dc" },
];

const CHILD_CATEGORIES = ["nourriture", "boisson", "besoins", "emotions"];

export default function HomeScreen({ navigation }) {
  const { texteGrand, contraste, modeEnfant } = useContext(SettingsContext);
  const containerStyle = [
    styles.container,
    contraste && { backgroundColor: colors.contrastBackground },
  ];
  const titleStyle = [
    styles.title,
    texteGrand && { fontSize: typography.fontSizeXL },
    contraste && { color: colors.contrastText },
  ];
  const gridStyle = [styles.grid];
  const catBtnStyle = (color) => [
    styles.catBtn,
    { backgroundColor: color },
    contraste && {
      backgroundColor: colors.contrastBackground,
      borderColor: colors.contrastText,
      borderWidth: 2,
    },
  ];
  const catLabelStyle = [
    styles.catLabel,
    texteGrand && { fontSize: typography.fontSizeLarge },
    contraste && { color: colors.contrastText },
  ];
  const iconSize = texteGrand ? 64 : 48;

  const categories = modeEnfant
    ? ALL_CATEGORIES.filter((cat) => CHILD_CATEGORIES.includes(cat.key))
    : ALL_CATEGORIES;

  return (
    <View style={containerStyle}>
      <Text style={titleStyle}>Tableau de communication</Text>
      <View style={gridStyle}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={catBtnStyle(cat.color)}
            onPress={() =>
              navigation.navigate("Pictogrammes", { category: cat.key })
            }
            accessibilityLabel={cat.label}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons
              name={cat.icon}
              size={iconSize}
              color={contraste ? colors.contrastText : colors.primary}
            />
            <Text style={catLabelStyle}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <AppButton
        title="🚨 SOS"
        onPress={() => navigation.navigate("SOS")}
        contrast={contraste}
        accessibilityLabel="Bouton SOS"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: typography.fontSizeLarge,
    fontWeight: typography.fontWeightBold,
    color: colors.primary,
    marginBottom: 18,
    alignSelf: "center",
    fontFamily: typography.fontFamily,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  catBtn: {
    width: 120,
    height: 120,
    borderRadius: 28,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  catLabel: {
    marginTop: 10,
    fontSize: typography.fontSizeRegular,
    color: colors.primary,
    fontWeight: typography.fontWeightBold,
    fontFamily: typography.fontFamily,
    textAlign: "center",
  },
});
