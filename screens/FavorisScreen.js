import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Speech from "expo-speech";
import { SettingsContext } from "../services/SettingsContext";
import { getTTSLang } from "../i18n";
import { fontSize, spacing } from "../theme/dimensions";

const STORAGE_KEY = "@favoris";

export default function FavorisScreen() {
  const insets = useSafeAreaInsets();
  const [favoris, setFavoris] = useState([]);
  const [input, setInput] = useState("");
  const { texteGrand, contraste, langue, modeEnfant } =
    useContext(SettingsContext);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setFavoris(JSON.parse(stored));
      else
        setFavoris([
          { id: "1", label: "J’ai faim", emoji: "🍽️" },
          { id: "2", label: "Aide", emoji: "🆘" },
        ]);
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favoris));
  }, [favoris]);

  const speak = (text) => {
    Speech.speak(text, { language: getTTSLang(langue) });
  };

  const addFavori = () => {
    const value = input.trim();
    if (!value) return;
    if (favoris.some((f) => f.label.toLowerCase() === value.toLowerCase())) {
      Alert.alert("Déjà présent", "Ce favori existe déjà.");
      return;
    }
    setFavoris([
      ...favoris,
      { id: Date.now().toString(), label: value, emoji: "⭐" },
    ]);
    setInput("");
  };

  const removeFavori = (id) => {
    setFavoris(favoris.filter((f) => f.id !== id));
  };

  const labelSize = texteGrand ? fontSize.xlarge : fontSize.medium;
  const emojiSize = texteGrand ? fontSize.xlarge * 2 : fontSize.large;

  const containerStyle = [
    styles.container,
    contraste && { backgroundColor: "#000" },
  ];
  const titleStyle = [
    styles.title,
    { fontSize: texteGrand ? fontSize.xlarge : fontSize.large },
    contraste && { color: "#FFD600" },
  ];
  const rowStyle = [
    styles.row,
    contraste && {
      backgroundColor: "#222",
      borderColor: "#FFD600",
      borderWidth: 2,
    },
  ];
  const emojiStyle = [styles.emoji, { fontSize: emojiSize }];
  const labelStyle = [
    styles.label,
    { fontSize: labelSize },
    contraste && { color: "#FFD600" },
  ];
  const removeBtnStyle = [
    styles.removeBtn,
    contraste && { backgroundColor: "#FFD600" },
  ];
  const removeBtnTextStyle = [
    styles.removeBtnText,
    contraste && { color: "#000" },
  ];
  const inputStyle = [
    styles.input,
    contraste && {
      backgroundColor: "#222",
      color: "#FFD600",
      borderColor: "#FFD600",
    },
  ];
  const addBtnStyle = [
    styles.addBtn,
    contraste && { backgroundColor: "#FFD600" },
  ];
  const addBtnTextStyle = [styles.addBtnText, contraste && { color: "#000" }];

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top + 8 }}>
      <Text style={titleStyle}>Favoris</Text>
      <FlatList
        data={favoris}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={rowStyle}>
            <TouchableOpacity
              style={styles.emojiBtn}
              onPress={() => speak(item.label)}
            >
              <Text style={emojiStyle}>{item.emoji}</Text>
            </TouchableOpacity>
            <Text style={labelStyle}>{item.label}</Text>
            {!modeEnfant && (
              <TouchableOpacity
                style={removeBtnStyle}
                onPress={() => removeFavori(item.id)}
              >
                <Text style={removeBtnTextStyle}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        contentContainerStyle={[
          ...containerStyle,
          { paddingBottom: insets.bottom + spacing.large },
        ]}
        ListFooterComponent={
          !modeEnfant ? (
            <View style={styles.addRow}>
              <TextInput
                style={inputStyle}
                placeholder="Ajouter un favori..."
                placeholderTextColor={contraste ? "#FFD600" : "#888"}
                value={input}
                onChangeText={setInput}
              />
              <TouchableOpacity style={addBtnStyle} onPress={addFavori}>
                <Text style={addBtnTextStyle}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5faff",
    padding: spacing.medium,
  },
  title: {
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: spacing.medium,
    alignSelf: "center",
    fontFamily: "Roboto",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginVertical: spacing.small,
    padding: spacing.medium,
    elevation: 1,
  },
  emojiBtn: { marginRight: spacing.medium },
  emoji: {},
  label: {
    flex: 1,
    color: "#222",
    fontWeight: "bold",
    fontFamily: "Roboto",
  },
  removeBtn: {
    backgroundColor: "#d32f2f",
    borderRadius: 10,
    padding: spacing.small,
    marginLeft: spacing.small,
  },
  removeBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: fontSize.large,
  },
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.medium,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: spacing.small,
    fontSize: fontSize.medium,
    marginRight: spacing.small,
    borderWidth: 1,
    borderColor: "#1976d2",
    fontFamily: "Roboto",
  },
  addBtn: {
    backgroundColor: "#1976d2",
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    borderRadius: 10,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: fontSize.medium,
  },
});
