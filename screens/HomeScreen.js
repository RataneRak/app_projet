import colors from "../theme/colors";
import typography from "../theme/typography";
import React, { useContext } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SettingsContext } from "../services/SettingsContext";
import PropTypes from "prop-types";
import AppButton from "../components/AppButton";
import i18n from "../i18n";

const ALL_CATEGORIES = [
  { key: "nourriture", label: "eat", icon: "food", color: "#90caf9" },
  { key: "boisson", label: "drink", icon: "cup-water", color: "#a5d6a7" },
  { key: "besoins", label: "toilet", icon: "toilet", color: "#ffe082" },
  { key: "maison", label: "home", icon: "home", color: "#b39ddb" },
  {
    key: "emotions",
    label: "help",
    icon: "emoticon-happy-outline",
    color: "#ffab91",
  },
  { key: "activites", label: "history", icon: "run", color: "#80cbc4" },
  { key: "appeler", label: "settings", icon: "phone", color: "#f48fb1" },
  {
    key: "autre",
    label: "customMessages",
    icon: "dots-horizontal",
    color: "#cfd8dc",
  },
];

const CHILD_CATEGORIES = ["nourriture", "boisson", "besoins", "emotions"];

// Get screen dimensions
const { width } = Dimensions.get("window");
const numColumns = 3; // Adjust number of columns here
const marginSize = 10;
const catBtnSize = (width - (numColumns + 1) * marginSize) / numColumns;

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { texteGrand, contraste, modeEnfant } = useContext(SettingsContext);

  // Dynamic styles based on settings
  const containerStyle = [
    styles.container,
    contraste && { backgroundColor: colors.contrastBackground },
    { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 8 },
  ];
  const titleStyle = [
    styles.title,
    texteGrand && { fontSize: typography.fontSizeXL },
    contraste && { color: colors.contrastText },
  ];
  const catLabelStyle = [
    styles.catLabel,
    { fontSize: catBtnSize * 0.12 }, // Dynamic font size
    texteGrand && { fontSize: catBtnSize * 0.15 },
    contraste && { color: colors.contrastText },
  ];
  const iconSize = texteGrand ? catBtnSize * 0.5 : catBtnSize * 0.4;

  const categories = modeEnfant
    ? ALL_CATEGORIES.filter((cat) => CHILD_CATEGORIES.includes(cat.key))
    : ALL_CATEGORIES;

  return (
    <View style={containerStyle}>
      <Text style={titleStyle}>{i18n.t("home")}</Text>
      <View style={styles.grid}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.catBtn,
              { backgroundColor: cat.color },
              contraste && {
                backgroundColor: colors.contrastBackground,
                borderColor: colors.contrastText,
                borderWidth: 2,
              },
            ]}
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
            <Text style={catLabelStyle}>{i18n.t(cat.label)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <AppButton
        title={i18n.t("sos")}
        onPress={() => navigation.navigate("SOS")}
        contrast={contraste}
        accessibilityLabel="Bouton SOS"
      />
    </View>
  );
}

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

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
    width: catBtnSize,
    height: catBtnSize,
    borderRadius: 28,
    margin: marginSize,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  catLabel: {
    marginTop: 5,
    fontWeight: typography.fontWeightBold,
    fontFamily: typography.fontFamily,
    textAlign: "center",
    color: colors.primary,
  },
});
