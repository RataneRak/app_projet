import { colors, typography } from "../theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PropTypes from "prop-types";
import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SettingsContext } from "../services/SettingsContext";
import VoiceService from "../services/VoiceService";

const TEST_PHRASES = {
  fr: [
    "Bonjour, comment allez-vous ?",
    "J'ai faim et soif",
    "Je veux aller aux toilettes",
    "J'ai besoin d'aide",
    "Merci beaucoup",
  ],
  mg: [
    "Salama, manao ahoana ianao?",
    "Noana sy mangetaheta aho",
    "Tia ho any am-pandriana aho",
    "Mila fanampiana aho",
    "Misaotra betsaka",
  ],
};

export default function VoiceTestScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [customText, setCustomText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [offlineReady, setOfflineReady] = useState(
    VoiceService.isOfflineReady()
  );
  const { langue, texteGrand, contraste } = useContext(SettingsContext);

  useEffect(() => {
    const unsub = VoiceService.onSpeakingChange(setIsSpeaking);
    // petit check au focus : offlineReady peut changer après init
    const t = setInterval(
      () => setOfflineReady(VoiceService.isOfflineReady()),
      1000
    );
    return () => {
      unsub?.();
      clearInterval(t);
    };
  }, []);

  const speakText = async (text, language = langue) => {
    try {
      if (isSpeaking) {
        await VoiceService.stop();
        return;
      }
      await VoiceService.speak(text, language);
    } catch (error) {
      console.error("Erreur lors de la synthèse vocale:", error);
      Alert.alert("Erreur", "Impossible de lire le texte");
    }
  };

  const containerStyle = [
    styles.container,
    contraste && { backgroundColor: colors.contrastBackground },
  ];

  const titleStyle = [
    styles.title,
    texteGrand && { fontSize: typography.fontSizeXL },
    contraste && { color: colors.contrastText },
  ];

  const sectionStyle = [
    styles.section,
    contraste && { borderColor: colors.contrastText },
  ];

  const labelStyle = [
    styles.label,
    texteGrand && { fontSize: typography.fontSizeLarge },
    contraste && { color: colors.contrastText },
  ];

  const buttonStyle = [
    styles.testButton,
    contraste && { backgroundColor: colors.contrastSurface },
  ];

  const buttonTextStyle = [
    styles.buttonText,
    contraste && { color: colors.contrastText },
  ];

  return (
    <SafeAreaView
      style={[
        ...containerStyle,
        { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 8 },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={contraste ? colors.contrastText : colors.text}
            />
          </TouchableOpacity>
          <Text style={titleStyle}>Test des Voix</Text>
        </View>

        {/* État du moteur offline MG */}
        <View style={[sectionStyle, { paddingVertical: 10 }]}>
          <Text style={labelStyle}>
            Voix Malagasy offline prête : {offlineReady ? "✅" : "⏳"}
          </Text>
        </View>

        {/* Texte personnalisé */}
        <View style={sectionStyle}>
          <Text style={styles.sectionTitle}>Texte personnalisé</Text>
          <TextInput
            style={[
              styles.textInput,
              contraste && {
                backgroundColor: colors.contrastSurface,
                color: colors.contrastText,
                borderColor: colors.contrastText,
              },
            ]}
            value={customText}
            onChangeText={setCustomText}
            placeholder="Tapez votre texte ici..."
            placeholderTextColor={contraste ? colors.contrastText : "#666"}
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity
            style={[buttonStyle, isSpeaking && styles.speakingButton]}
            onPress={() => speakText(customText)}
            disabled={!customText.trim()}
          >
            <MaterialCommunityIcons
              name={isSpeaking ? "volume-off" : "volume-high"}
              size={20}
              color={isSpeaking ? "#fff" : colors.primary}
            />
            <Text style={buttonTextStyle}>
              {isSpeaking ? "Arrêter" : "Tester"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Phrases de test françaises */}
        <View style={sectionStyle}>
          <Text style={styles.sectionTitle}>Phrases de test - Français</Text>
          {TEST_PHRASES.fr.map((phrase, index) => (
            <TouchableOpacity
              key={index}
              style={buttonStyle}
              onPress={() => speakText(phrase, "fr")}
            >
              <MaterialCommunityIcons
                name="volume-high"
                size={16}
                color={colors.primary}
              />
              <Text style={[buttonTextStyle, styles.phraseText]}>{phrase}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Phrases de test malgaches */}
        <View style={sectionStyle}>
          <Text style={styles.sectionTitle}>Phrases de test - Malagasy</Text>
          {TEST_PHRASES.mg.map((phrase, index) => (
            <TouchableOpacity
              key={index}
              style={buttonStyle}
              onPress={() => speakText(phrase, "mg")}
            >
              <MaterialCommunityIcons
                name="volume-high"
                size={16}
                color={colors.primary}
              />
              <Text style={[buttonTextStyle, styles.phraseText]}>{phrase}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Informations sur les voix */}
        <View style={sectionStyle}>
          <Text style={styles.sectionTitle}>Informations</Text>
          <Text style={[labelStyle, styles.infoText]}>
            La voix malgache utilise un moteur hors‑ligne personnalisé si
            disponible, sinon une voix système en alternative.
          </Text>
          <Text style={[labelStyle, styles.infoText]}>
            La vitesse de lecture peut être ajustée côté moteur.
          </Text>
          <Text style={[labelStyle, styles.infoText]}>
            Les pictogrammes s&apos;adaptent automatiquement à la langue
            sélectionnée.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

VoiceTestScreen.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
  }),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: typography.fontSizeLarge,
    fontWeight: "bold",
    color: colors.text,
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: typography.fontSizeMedium,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },
  label: {
    fontSize: typography.fontSizeSmall,
    color: colors.text,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: typography.fontSizeSmall,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  testButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  speakingButton: {
    backgroundColor: colors.error,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: typography.fontSizeSmall,
    color: colors.text,
  },
  phraseText: {
    flex: 1,
    marginLeft: 8,
  },
  infoText: {
    marginBottom: 4,
    lineHeight: 20,
  },
});
