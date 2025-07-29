import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsContext } from "../App";
import colors from "../theme/colors";
import typography from "../theme/typography";
import AppButton from "../components/AppButton";

const SUGGESTIONS = [
  "Bonjour",
  "Merci",
  "Je veux sortir",
  "J’ai besoin d’aide",
  "Je suis fatigué",
  "Je veux aller aux toilettes",
];

const STORAGE_KEY = "@history";
const DEFAULT_CHILD_MSG = "Bonjour !";

export default function ClavierScreen() {
  const [text, setText] = useState("");
  const { texteGrand, contraste, modeEnfant } = useContext(SettingsContext);

  const speakAndSave = async () => {
    let msg = text.trim();
    if (modeEnfant) msg = DEFAULT_CHILD_MSG;
    if (msg) {
      Speech.speak(msg, { language: "fr-FR" });
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        let history = stored ? JSON.parse(stored) : [];
        const newItem = { text: msg, date: new Date().toISOString() };
        history = [newItem, ...history].slice(0, 50);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch (e) {}
    }
  };

  const fontSize = texteGrand
    ? typography.fontSizeXL
    : typography.fontSizeRegular;
  const suggestionSize = texteGrand
    ? typography.fontSizeLarge
    : typography.fontSizeRegular;

  const containerStyle = [
    styles.container,
    contraste && { backgroundColor: colors.contrastBackground },
  ];
  const titleStyle = [
    styles.title,
    texteGrand && { fontSize: typography.fontSizeXL },
    contraste && { color: colors.contrastText },
  ];
  const inputStyle = [
    styles.input,
    { fontSize },
    contraste && {
      backgroundColor: colors.contrastBackground,
      color: colors.contrastText,
      borderColor: colors.contrastText,
    },
  ];
  const suggestionStyle = [
    styles.suggestion,
    contraste && {
      backgroundColor: colors.contrastBackground,
      borderColor: colors.contrastText,
      borderWidth: 2,
    },
  ];
  const suggestionTextStyle = [
    styles.suggestionText,
    { fontSize: suggestionSize },
    contraste && { color: colors.contrastText },
  ];

  return (
    <View style={containerStyle}>
      <Text style={titleStyle}>Clavier virtuel</Text>
      {!modeEnfant && (
        <TextInput
          style={inputStyle}
          placeholder="Écrire un message..."
          placeholderTextColor={contraste ? colors.contrastText : colors.text}
          value={text}
          onChangeText={setText}
          multiline
        />
      )}
      <AppButton
        title="🔊 Parler"
        onPress={speakAndSave}
        contrast={contraste}
        accessibilityLabel="Bouton Parler"
        style={{ marginBottom: 16 }}
        textStyle={{ fontSize }}
      />
      {!modeEnfant && (
        <FlatList
          data={SUGGESTIONS}
          keyExtractor={(item) => item}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              style={suggestionStyle}
              onPress={() => setText(item)}
            >
              <Text style={suggestionTextStyle}>{item}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.suggestionRow}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  title: {
    fontSize: typography.fontSizeLarge,
    fontWeight: typography.fontWeightBold,
    color: colors.primary,
    marginBottom: 16,
    alignSelf: "center",
    fontFamily: typography.fontFamily,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    minHeight: 60,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    fontFamily: typography.fontFamily,
    color: colors.text,
  },
  suggestionRow: { marginBottom: 12 },
  suggestion: {
    backgroundColor: "#e3f0fc",
    borderRadius: 16,
    padding: 16,
    marginRight: 10,
    minWidth: 80,
    alignItems: "center",
  },
  suggestionText: {
    color: colors.primary,
    fontWeight: typography.fontWeightBold,
    fontSize: typography.fontSizeRegular,
    fontFamily: typography.fontFamily,
  },
});
