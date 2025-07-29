import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Animated,
} from "react-native";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n, { ttsLangMap } from "../i18n";
import { LanguageContext } from "../App";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const HISTORY_KEY = "@history";
const FAVORITES_KEY = "@favorites";

export default function TextInputScreen() {
  const { lang } = useContext(LanguageContext);
  const [text, setText] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [isFav, setIsFav] = useState(false);
  const [feedback, setFeedback] = useState(new Animated.Value(0));

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem(FAVORITES_KEY);
        if (stored) setFavorites(JSON.parse(stored));
      } catch (e) {}
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    setIsFav(favorites.includes(text.trim()) && text.trim().length > 0);
  }, [text, favorites]);

  const handleSpeak = async () => {
    if (!text.trim()) return;
    const voiceLang = ttsLangMap[lang] || "en-US";
    Speech.speak(text, { language: voiceLang });
    try {
      const stored = await AsyncStorage.getItem(HISTORY_KEY);
      let history = stored ? JSON.parse(stored) : [];
      history.push({ text: text.trim(), lang });
      if (history.length > 50) history = history.slice(-50);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {}
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
    if (!text.trim()) return;
    let newFavs;
    if (favorites.includes(text.trim())) {
      newFavs = favorites.filter((f) => f !== text.trim());
    } else {
      newFavs = [...favorites, text.trim()];
    }
    setFavorites(newFavs);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavs));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t("addMessage")}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={i18n.t("addMessage")}
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
            color={isFav ? "#FFD600" : "#bbb"}
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
          style={styles.speakBtn}
          onPress={handleSpeak}
          activeOpacity={0.8}
        >
          <Icon name="volume-high" size={28} color="#fff" />
          <Text style={styles.speakText}>{i18n.t("add")}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3f0fc",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 18,
    alignSelf: "center",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 8,
    marginBottom: 24,
    shadowColor: "#1976d2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 20,
    color: "#222",
    padding: 12,
    borderRadius: 12,
    minHeight: 60,
    backgroundColor: "#f7faff",
  },
  favBtn: {
    marginLeft: 8,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 4,
    elevation: 2,
  },
  speakBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1976d2",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignSelf: "center",
    shadowColor: "#1976d2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  speakText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 12,
  },
});
