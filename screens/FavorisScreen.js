import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import * as Speech from "expo-speech";
import { SettingsContext } from "../App";

export default function FavorisScreen() {
  const [favoris, setFavoris] = useState([
    { id: "1", label: "J’ai faim", emoji: "🍽️" },
    { id: "2", label: "Aide", emoji: "🆘" },
  ]);
  const [input, setInput] = useState("");
  const { texteGrand, contraste, modeEnfant } = useContext(SettingsContext);

  const speak = (text) => {
    Speech.speak(text, { language: "fr-FR" });
  };

  const addFavori = () => {
    if (!input.trim()) return;
    setFavoris([
      ...favoris,
      { id: Date.now().toString(), label: input.trim(), emoji: "⭐" },
    ]);
    setInput("");
  };

  const removeFavori = (id) => {
    setFavoris(favoris.filter((f) => f.id !== id));
  };

  const labelSize = texteGrand ? 40 : 20;
  const emojiSize = texteGrand ? 80 : 40;

  const containerStyle = [
    styles.container,
    contraste && { backgroundColor: "#000" },
  ];
  const titleStyle = [
    styles.title,
    texteGrand && { fontSize: 36 },
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
    <View style={containerStyle}>
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
        contentContainerStyle={{ paddingBottom: 24 }}
      />
      {!modeEnfant && (
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5faff", padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 16,
    alignSelf: "center",
    fontFamily: "Roboto",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginVertical: 8,
    padding: 16,
    elevation: 1,
  },
  emojiBtn: { marginRight: 16 },
  emoji: { fontSize: 40 },
  label: {
    flex: 1,
    fontSize: 20,
    color: "#222",
    fontWeight: "bold",
    fontFamily: "Roboto",
  },
  removeBtn: {
    backgroundColor: "#d32f2f",
    borderRadius: 10,
    padding: 10,
    marginLeft: 16,
  },
  removeBtnText: { color: "#fff", fontWeight: "bold", fontSize: 20 },
  addRow: { flexDirection: "row", alignItems: "center", marginTop: 16 },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    fontSize: 18,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#1976d2",
    fontFamily: "Roboto",
  },
  addBtn: {
    backgroundColor: "#1976d2",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  addBtnText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});
