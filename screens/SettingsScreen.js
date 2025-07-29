import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Speech from "expo-speech";
import i18n, { LANG_KEY, translations } from "../i18n";
import { LanguageContext } from "../App";

const languageList = [
  { code: "fr", label: "french" },
  { code: "en", label: "english" },
  { code: "ar", label: "arabic" },
  { code: "es", label: "spanish" },
  { code: "de", label: "german" },
  { code: "it", label: "italian" },
  { code: "pt", label: "portuguese" },
  { code: "zh", label: "chinese" },
  { code: "ru", label: "russian" },
  { code: "tr", label: "turkish" },
];

const TEXT_SIZE_KEY = "@text_size";
const CONTRAST_KEY = "@contrast";
const DARKMODE_KEY = "@darkmode";
const VOICE_KEY = "@voice";
const RATE_KEY = "@rate";

export default function SettingsScreen() {
  const { lang, setLang } = useContext(LanguageContext);
  const [voiceAvailable, setVoiceAvailable] = useState(true);
  const [textSize, setTextSize] = useState("medium");
  const [contrast, setContrast] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);

  useEffect(() => {
    i18n.locale = lang;
    checkVoice(lang);
    (async () => {
      const ts = await AsyncStorage.getItem(TEXT_SIZE_KEY);
      if (ts) setTextSize(ts);
      const c = await AsyncStorage.getItem(CONTRAST_KEY);
      if (c) setContrast(c === "true");
      const dm = await AsyncStorage.getItem(DARKMODE_KEY);
      if (dm) setDarkMode(dm === "true");
      const v = await AsyncStorage.getItem(VOICE_KEY);
      if (v) setSelectedVoice(v);
      const r = await AsyncStorage.getItem(RATE_KEY);
      if (r) setRate(Number(r));
    })();
  }, [lang]);

  useEffect(() => {
    getVoices();
  }, [lang]);

  const selectLang = async (l) => {
    setLang(l);
    await AsyncStorage.setItem(LANG_KEY, l);
  };

  const setTextSizePref = async (size) => {
    setTextSize(size);
    await AsyncStorage.setItem(TEXT_SIZE_KEY, size);
  };
  const setContrastPref = async (val) => {
    setContrast(val);
    await AsyncStorage.setItem(CONTRAST_KEY, val ? "true" : "false");
  };
  const setDarkModePref = async (val) => {
    setDarkMode(val);
    await AsyncStorage.setItem(DARKMODE_KEY, val ? "true" : "false");
  };
  const setVoicePref = async (voice) => {
    setSelectedVoice(voice);
    await AsyncStorage.setItem(VOICE_KEY, voice);
  };
  const setRatePref = async (r) => {
    setRate(r);
    await AsyncStorage.setItem(RATE_KEY, String(r));
  };

  // Récupère les voix disponibles pour la langue courante
  const getVoices = async () => {
    if (Speech.getAvailableVoicesAsync) {
      const allVoices = await Speech.getAvailableVoicesAsync();
      const filtered = allVoices.filter(
        (v) => v.language && v.language.toLowerCase().startsWith(lang)
      );
      setVoices(filtered);
      if (
        filtered.length &&
        !filtered.find((v) => v.identifier === selectedVoice)
      ) {
        setSelectedVoice(filtered[0].identifier);
        await AsyncStorage.setItem(VOICE_KEY, filtered[0].identifier);
      }
    }
  };

  // Vérifie si la voix est disponible pour la langue
  const checkVoice = async (l) => {
    if (Speech.getAvailableVoicesAsync) {
      const voices = await Speech.getAvailableVoicesAsync();
      const found = voices.find(
        (v) => v.language && v.language.toLowerCase().startsWith(l)
      );
      setVoiceAvailable(!!found);
    } else {
      setVoiceAvailable(true); // fallback : on ne peut pas vérifier
    }
  };

  useEffect(() => {
    checkVoice(lang);
  }, [lang]);

  return (
    <ScrollView
      style={[styles.container, darkMode && { backgroundColor: "#222" }]}
    >
      <Text
        style={[
          styles.title,
          contrast && { color: "#FFD600" },
          darkMode && { color: "#fff" },
        ]}
      >
        {i18n.t("language")}
      </Text>
      {languageList.map((l) => (
        <TouchableOpacity
          key={l.code}
          style={[
            styles.btn,
            lang === l.code && styles.selected,
            contrast && { borderColor: "#FFD600" },
            darkMode && { backgroundColor: "#333" },
          ]}
          onPress={() => selectLang(l.code)}
        >
          <Text
            style={[
              styles.btnText,
              contrast && { color: "#FFD600" },
              darkMode && { color: "#fff" },
            ]}
          >
            {i18n.t(l.label)}
          </Text>
        </TouchableOpacity>
      ))}
      {!voiceAvailable && (
        <Text style={styles.warning}>{i18n.t("downloadVoice")}</Text>
      )}
      <Text
        style={[
          styles.section,
          contrast && { color: "#FFD600" },
          darkMode && { color: "#fff" },
        ]}
      >
        Voix
      </Text>
      {voices.length > 0 ? (
        voices.map((v) => (
          <TouchableOpacity
            key={v.identifier}
            style={[
              styles.btn,
              selectedVoice === v.identifier && styles.selected,
              contrast && { borderColor: "#FFD600" },
              darkMode && { backgroundColor: "#333" },
            ]}
            onPress={() => setVoicePref(v.identifier)}
          >
            <Text
              style={[
                styles.btnText,
                contrast && { color: "#FFD600" },
                darkMode && { color: "#fff" },
              ]}
            >
              {v.name} ({v.quality})
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text
          style={{ color: contrast ? "#FFD600" : darkMode ? "#fff" : "#222" }}
        >
          Aucune voix trouvée
        </Text>
      )}
      <View style={styles.row}>
        <Text
          style={[
            styles.label,
            contrast && { color: "#FFD600" },
            darkMode && { color: "#fff" },
          ]}
        >
          Vitesse
        </Text>
        <TouchableOpacity
          style={[styles.sizeBtn, rate === 0.7 && styles.sizeBtnActive]}
          onPress={() => setRatePref(0.7)}
        >
          {" "}
          <Text style={styles.sizeLabel}>-</Text>{" "}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sizeBtn, rate === 1 && styles.sizeBtnActive]}
          onPress={() => setRatePref(1)}
        >
          {" "}
          <Text style={styles.sizeLabel}>1x</Text>{" "}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sizeBtn, rate === 1.3 && styles.sizeBtnActive]}
          onPress={() => setRatePref(1.3)}
        >
          {" "}
          <Text style={styles.sizeLabel}>+</Text>{" "}
        </TouchableOpacity>
      </View>
      <Text
        style={[
          styles.section,
          contrast && { color: "#FFD600" },
          darkMode && { color: "#fff" },
        ]}
      >
        Accessibilité
      </Text>
      <View style={styles.row}>
        <Text
          style={[
            styles.label,
            contrast && { color: "#FFD600" },
            darkMode && { color: "#fff" },
          ]}
        >
          Taille du texte
        </Text>
        <TouchableOpacity
          style={[styles.sizeBtn, textSize === "small" && styles.sizeBtnActive]}
          onPress={() => setTextSizePref("small")}
        >
          {" "}
          <Text style={styles.sizeLabel}>A-</Text>{" "}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sizeBtn,
            textSize === "medium" && styles.sizeBtnActive,
          ]}
          onPress={() => setTextSizePref("medium")}
        >
          {" "}
          <Text style={styles.sizeLabel}>A</Text>{" "}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sizeBtn, textSize === "large" && styles.sizeBtnActive]}
          onPress={() => setTextSizePref("large")}
        >
          {" "}
          <Text style={styles.sizeLabel}>A+</Text>{" "}
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <Text
          style={[
            styles.label,
            contrast && { color: "#FFD600" },
            darkMode && { color: "#fff" },
          ]}
        >
          Contraste élevé
        </Text>
        <Switch value={!!contrast} onValueChange={setContrastPref} />
      </View>
      <View style={styles.row}>
        <Text
          style={[
            styles.label,
            contrast && { color: "#FFD600" },
            darkMode && { color: "#fff" },
          ]}
        >
          Mode sombre
        </Text>
        <Switch value={!!darkMode} onValueChange={setDarkModePref} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  btn: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#eee",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#eee",
  },
  selected: { backgroundColor: "#1976d2", borderColor: "#1976d2" },
  btnText: { fontSize: 18, color: "#222", fontWeight: "bold" },
  warning: {
    color: "#d32f2f",
    fontWeight: "bold",
    marginTop: 16,
    fontSize: 16,
  },
  section: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 12,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  label: { fontSize: 18, flex: 1 },
  sizeBtn: {
    backgroundColor: "#eee",
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 4,
  },
  sizeBtnActive: { backgroundColor: "#1976d2" },
  sizeLabel: { fontSize: 18, color: "#222", fontWeight: "bold" },
});
