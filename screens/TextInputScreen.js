import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsContext } from "../services/SettingsContext";
import { fontSize, spacing, colors } from "../theme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getTTSLang } from "../i18n";
import { translateText, getSpeakLangCode } from "../services/TranslationService";

const HISTORY_KEY = "@history";
const FAVORITES_KEY = "@favorites";

export default function TextInputScreen() {
  const insets = useSafeAreaInsets();
  const { texteGrand, contraste, langue } = useContext(SettingsContext);
  const [text, setText] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [isFav, setIsFav] = useState(false);
  const [feedback] = useState(new Animated.Value(0));

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem(FAVORITES_KEY);
        if (stored) setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error("Erreur chargement favoris:", e);
      }
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    setIsFav(favorites.includes(text.trim()) && text.trim().length > 0);
  }, [text, favorites]);

  const handleSpeak = async (msg) => {
    if (!msg.trim()) return;
    let textToSpeak = msg;
    if (langue === "en") {
      const translated = await translateText(msg, "fr", "en");
      textToSpeak = translated || msg;
    }
    if (langue === "fr") {
      const translated = await translateText(msg, "en", "fr");
      textToSpeak = translated || msg;
    }
    Speech.speak(textToSpeak, { language: getSpeakLangCode(langue) });
    try {
      const stored = await AsyncStorage.getItem(HISTORY_KEY);
      let history = stored ? JSON.parse(stored) : [];
      const newItem = { text: msg, date: new Date().toISOString() };
      history = [newItem, ...history].slice(0, 50);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.error("Erreur mise à jour historique:", e);
    }

    Animated.sequence([
      Animated.timing(feedback, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(feedback, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    Keyboard.dismiss();
  };

  const toggleFavorite = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const newFavs = isFav
      ? favorites.filter((f) => f !== trimmed)
      : [...favorites, trimmed];
    setFavorites(newFavs);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavs));
  };

  const containerStyle = [
    styles.container,
    contraste && { backgroundColor: colors.contrastBackground },
  ];
  const titleStyle = [
    styles.title,
    texteGrand && { fontSize: fontSize.xlarge },
    contraste && { color: colors.contrastText },
  ];
  const inputStyle = [
    styles.input,
    texteGrand && { fontSize: fontSize.large },
    contraste && {
      backgroundColor: colors.contrastSurface,
      color: colors.contrastText,
      borderColor: colors.contrastText,
    },
  ];
  const speakBtnStyle = [
    styles.speakBtn,
    contraste && { backgroundColor: colors.contrastText },
  ];
  const speakTextStyle = [
    styles.speakText,
    texteGrand && { fontSize: fontSize.large },
    contraste && { color: colors.contrastBackground },
  ];

  return (
    <SafeAreaView style={[...containerStyle, { paddingTop: insets.top + 8 }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={insets.top}
      >
        <ScrollView
          contentContainerStyle={{
            padding: spacing.large,
            flexGrow: 1,
            paddingBottom: insets.bottom + spacing.large,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={titleStyle}>Ajouter un message</Text>

          <View style={styles.inputRow}>
            <TextInput
              style={inputStyle}
              placeholder="Écrire votre message..."
              placeholderTextColor={contraste ? colors.contrastText : "#888"}
              value={text}
              onChangeText={setText}
              multiline
              numberOfLines={3}
              maxLength={200}
            />
            <TouchableOpacity
              style={styles.favBtn}
              onPress={toggleFavorite}
              activeOpacity={0.7}
            >
              <Icon
                name={isFav ? "star" : "star-outline"}
                size={32}
                color={isFav ? colors.contrastText : "#bbb"}
              />
            </TouchableOpacity>
          </View>

          <Animated.View
            style={{
              transform: [
                {
                  scale: feedback.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.15],
                  }),
                },
              ],
            }}
          >
            <TouchableOpacity
              style={speakBtnStyle}
              onPress={() => handleSpeak(text)}
              activeOpacity={0.85}
            >
              <Icon name="volume-high" size={24} color="#fff" />
              <Text style={speakTextStyle}>Parler</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: fontSize.large,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: spacing.large,
    alignSelf: "center",
    fontFamily: "Roboto",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: spacing.small,
    marginBottom: spacing.large,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: fontSize.medium,
    color: colors.text,
    padding: spacing.medium,
    borderRadius: 12,
    minHeight: 60,
    backgroundColor: "#f7faff",
    fontFamily: "Roboto",
  },
  favBtn: {
    marginLeft: spacing.small,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 4,
    elevation: 2,
  },
  speakBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.large,
    alignSelf: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  speakText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: fontSize.medium,
    marginLeft: spacing.small,
    fontFamily: "Roboto",
  },
});
