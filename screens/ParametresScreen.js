// screens/ParametresScreen.js
import { colors, typography } from "../theme";
import PropTypes from "prop-types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  SafeAreaView,
  Platform,
} from "react-native";
import * as Linking from "expo-linking";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SettingsContext } from "../services/SettingsContext";
import AppButton from "../components/AppButton";
import i18n from "../i18n";

/** Carte de section pour homogénéiser l’UI */
const SectionCard = ({ title, subtitle, children, contraste }) => {
  return (
    <View
      style={[
        styles.section,
        contraste && {
          backgroundColor: colors.contrastBackground,
          borderColor: colors.contrastText,
        },
      ]}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={title}
    >
      <Text
        style={[
          styles.sectionTitle,
          contraste && { color: colors.contrastText },
        ]}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={[
            styles.sectionSubtitle,
            contraste && { color: colors.textLight },
          ]}
        >
          {subtitle}
        </Text>
      ) : null}
      <View style={{ marginTop: subtitle ? 12 : 8 }}>{children}</View>
    </View>
  );
};
SectionCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node,
  contraste: PropTypes.bool,
};

export default function ParametresScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const {
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
  } = useContext(SettingsContext);

  // Verrou pour éviter les doubles clics langue
  const [changingLang, setChangingLang] = React.useState(false);
  const chooseLang = async (code) => {
    if (changingLang) return;
    setChangingLang(true);
    try {
      setLangue(code);
    } finally {
      setChangingLang(false);
    }
  };

  const containerStyle = [
    styles.container,
    contraste && { backgroundColor: colors.contrastBackground },
    { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 8 },
  ];

  const titleStyle = [
    styles.title,
    contraste && { color: colors.contrastText },
  ];

  const labelStyle = [
    styles.label,
    contraste && { color: colors.contrastText },
  ];

  const handleResetSettings = () => {
    Alert.alert(
      i18n.t("resetSettings"),
      "Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?",
      [
        { text: i18n.t("cancel"), style: "cancel" },
        {
          text: i18n.t("yes"),
          style: "destructive",
          onPress: () => {
            setTheme("clair");
            setLangue("fr");
            setTexteGrand(false);
            setModeEnfant(false);
            setContraste(false);
          },
        },
      ]
    );
  };

  const SegButton = ({ selected, onPress, icon, label }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.segmentBtn,
        selected && styles.segmentBtnSelected,
        contraste && styles.segmentBtnContrast,
        selected &&
          contraste && {
            borderColor: colors.contrastText,
            backgroundColor: "transparent",
          },
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
    >
      {icon ? (
        <MaterialCommunityIcons
          name={icon}
          size={18}
          color={selected ? "#fff" : contraste ? colors.contrastText : "#666"}
          style={{ marginRight: 6 }}
        />
      ) : null}
      <Text
        style={[
          styles.segmentText,
          selected && styles.segmentTextSelected,
          contraste && { color: colors.contrastText },
          selected && contraste && { color: colors.contrastText },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  SegButton.propTypes = {
    selected: PropTypes.bool,
    onPress: PropTypes.func,
    icon: PropTypes.string,
    label: PropTypes.string.isRequired,
  };

  return (
    <SafeAreaView style={containerStyle}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <Text style={titleStyle}>{i18n.t("settingsTitle")}</Text>

        {/* 1) LANGUE */}
        <SectionCard
          title={i18n.t("language")}
          subtitle="Choisissez la langue de l’application. La voix peut se gérer séparément."
          contraste={contraste}
        >
          <View style={styles.segmentGroup} accessibilityRole="tablist">
            <SegButton
              selected={langue === "fr"}
              onPress={() => chooseLang("fr")}
              icon="flag"
              label="Français"
            />
            <SegButton
              selected={langue === "en"}
              onPress={() => chooseLang("en")}
              icon="flag"
              label="English"
            />
            <SegButton
              selected={langue === "mg"}
              onPress={() => chooseLang("mg")}
              icon="flag"
              label="Malagasy"
            />
          </View>
          <View style={{ marginTop: 8 }}>
            <Text
              style={[styles.helper, contraste && { color: colors.textLight }]}
            >
              Conseil : la voix TTS peut être différente de la langue de
              l’interface.
            </Text>
          </View>
        </SectionCard>

        {/* 2) VOIX & AUDIO */}
        <SectionCard
          title="Voix & audio"
          subtitle="Gérez la voix de synthèse et testez l’audio."
          contraste={contraste}
        >
          {/* Bouton de gestion (écran des voix) */}
          <AppButton
            title="Gérer les voix"
            onPress={() => navigation.navigate("VoiceTest")}
            color="primary"
            contrast={contraste}
            accessibilityLabel="Ouvrir l'écran de gestion des voix"
          />

          {/* ➕ Bouton spécifique quand langue = mg */}
          {langue === "mg" && (
            <View style={{ marginTop: 10 }}>
              <AppButton
                title="Configurer la voix Malagasy"
                onPress={() => {
                  // Ouvre les réglages du téléphone (l'utilisateur va dans Synthèse vocale / TTS)
                  if (Platform.OS === "android") {
                    Linking.openSettings();
                    // Essai plus direct (non garanti selon les OEM) :
                    // Linking.openURL("intent:#Intent;action=android.settings.TTS_SETTINGS;end");
                  } else {
                    Linking.openSettings();
                  }
                }}
                color="secondary"
                contrast={contraste}
                accessibilityLabel="Configurer la voix malgache dans les réglages du téléphone"
              />
              <Text
                style={[
                  styles.helper,
                  { marginTop: 8 },
                  contraste && { color: colors.textLight },
                ]}
              >
                Si aucune voix Malagasy n'apparaît, installe un moteur TTS (ex.
                “eSpeak NG”, “RHVoice”) puis active Malagasy.
              </Text>
            </View>
          )}
        </SectionCard>

        {/* 3) APPARENCE */}
        <SectionCard
          title={i18n.t("appearance")}
          subtitle="Préférez un thème clair ou sombre."
          contraste={contraste}
        >
          <View style={styles.settingRow}>
            <Text style={labelStyle}>{i18n.t("settings")} :</Text>
            <View style={styles.segmentGroup}>
              <SegButton
                selected={theme === "clair"}
                onPress={() => setTheme("clair")}
                icon="weather-sunny"
                label={i18n.t("themeLight")}
              />
              <SegButton
                selected={theme === "sombre"}
                onPress={() => setTheme("sombre")}
                icon="weather-night"
                label={i18n.t("themeDark")}
              />
            </View>
          </View>
        </SectionCard>

        {/* 4) ACCESSIBILITÉ */}
        <SectionCard
          title={i18n.t("accessibility")}
          subtitle="Ajustez la lisibilité et le contraste."
          contraste={contraste}
        >
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={labelStyle}>{i18n.t("largeText")}</Text>
              <Text
                style={[
                  styles.settingDescription,
                  contraste && { color: colors.textLight },
                ]}
              >
                Augmente la taille du texte pour une meilleure lisibilité.
              </Text>
            </View>
            <Switch
              value={texteGrand}
              onValueChange={setTexteGrand}
              trackColor={{ false: "#C8CAD1", true: colors.primary }}
              thumbColor={"#fff"}
              accessibilityLabel={i18n.t("largeText")}
            />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={labelStyle}>{i18n.t("highContrast")}</Text>
              <Text
                style={[
                  styles.settingDescription,
                  contraste && { color: colors.textLight },
                ]}
              >
                Améliore la visibilité avec des couleurs contrastées.
              </Text>
            </View>
            <Switch
              value={contraste}
              onValueChange={setContraste}
              trackColor={{ false: "#C8CAD1", true: colors.secondary }}
              thumbColor={"#fff"}
              accessibilityLabel={i18n.t("highContrast")}
            />
          </View>
        </SectionCard>

        {/* 5) MODE ENFANT */}
        <SectionCard
          title={i18n.t("specialMode")}
          subtitle="Interface simplifiée et éléments limités."
          contraste={contraste}
        >
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={labelStyle}>{i18n.t("childMode")}</Text>
              <Text
                style={[
                  styles.settingDescription,
                  contraste && { color: colors.textLight },
                ]}
              >
                Réduit le nombre de catégories et simplifie les interactions.
              </Text>
            </View>
            <Switch
              value={modeEnfant}
              onValueChange={setModeEnfant}
              trackColor={{ false: "#C8CAD1", true: colors.success }}
              thumbColor={"#fff"}
              accessibilityLabel={i18n.t("childMode")}
            />
          </View>
        </SectionCard>

        {/* 6) ACTIONS */}
        <SectionCard title="Actions" contraste={contraste}>
          <View style={{ gap: 10 }}>
            <AppButton
              title={i18n.t("customMessagesLong")}
              onPress={() => navigation.navigate("CustomMessages")}
              color="secondary"
              contrast={contraste}
              accessibilityLabel="Accéder aux messages personnalisés"
            />
            <AppButton
              title={i18n.t("testVoices")}
              onPress={() => navigation.navigate("VoiceTest")}
              color="primary"
              contrast={contraste}
              accessibilityLabel="Tester les voix"
            />
            <AppButton
              title={i18n.t("resetSettings")}
              onPress={handleResetSettings}
              color="error"
              contrast={contraste}
              accessibilityLabel="Réinitialiser tous les paramètres"
            />
          </View>
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}

ParametresScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: typography.fontSizeXL,
    fontWeight: typography.fontWeightBold,
    color: colors.primary,
    marginBottom: 12,
    marginTop: 8,
    alignSelf: "center",
    fontFamily: typography.fontFamily,
    letterSpacing: 0.5,
  },

  /* Section card */
  section: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 14,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: typography.fontSizeLarge,
    fontWeight: typography.fontWeightBold,
    color: colors.primary,
    fontFamily: typography.fontFamily,
  },
  sectionSubtitle: {
    marginTop: 4,
    color: colors.textLight,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: typography.fontFamily,
  },

  /* Lignes */
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 12,
  },
  settingInfo: { flex: 1, marginRight: 16 },

  /* Libellés */
  label: {
    fontSize: typography.fontSizeRegular,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
    marginBottom: 4,
    fontFamily: typography.fontFamily,
  },
  settingDescription: {
    fontSize: 13,
    color: colors.textLight,
    fontFamily: typography.fontFamily,
  },
  helper: {
    fontSize: 12,
    color: colors.textLight,
    fontFamily: typography.fontFamily,
  },

  /* Segmented control */
  segmentGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  segmentBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f3f5",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E3E6EB",
  },
  segmentBtnSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  segmentBtnContrast: {
    backgroundColor: colors.contrastBackground,
    borderColor: colors.contrastText,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
    fontFamily: typography.fontFamily,
  },
  segmentTextSelected: {
    color: "#fff",
  },
});
