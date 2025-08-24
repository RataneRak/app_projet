import { colors, typography } from "../theme"; // ✅ theme imports
import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// VoiceService not used; removed import
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsContext } from "../services/SettingsContext";
import AppButton from "../components/AppButton";
import * as Speech from "expo-speech";
import { getTTSLang } from "../i18n";

const STORAGE_KEY = "@history";

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleString();
}

export default function HistoriqueScreen() {
  const insets = useSafeAreaInsets();
  const [history, setHistory] = useState([]);
  const { texteGrand, contraste, langue, modeEnfant } =
    useContext(SettingsContext);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setHistory(JSON.parse(stored));
    })();
  }, []);

  const speak = (item) => {
    Speech.speak(item.text, { language: getTTSLang(langue) });
  };

  const clearHistory = () => {
    Alert.alert("Effacer", "Effacer tout l'historique ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Oui",
        style: "destructive",
        onPress: async () => {
          setHistory([]);
          await AsyncStorage.removeItem(STORAGE_KEY);
        },
      },
    ]);
  };

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
  const rowStyle = [
    styles.row,
    contraste && {
      backgroundColor: colors.contrastBackground,
      borderColor: colors.contrastText,
      borderWidth: 2,
    },
  ];
  const msgStyle = [
    styles.msg,
    texteGrand && { fontSize: typography.fontSizeLarge },
    contraste && { color: colors.contrastText },
  ];
  const dateStyle = [
    styles.date,
    texteGrand && { fontSize: typography.fontSizeRegular },
    contraste && { color: colors.contrastText },
  ];

  return (
    <View style={containerStyle}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Text style={titleStyle}>Historique des messages</Text>
        {!modeEnfant && (
          <AppButton
            title="Effacer"
            onPress={clearHistory}
            color="error"
            style={{
              paddingVertical: 8,
              paddingHorizontal: 18,
              borderRadius: 8,
              marginLeft: 12,
            }}
            accessibilityLabel="Effacer l'historique"
            textStyle={{ fontSize: typography.fontSizeRegular }}
          />
        )}
      </View>
      <FlatList
        data={history}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={rowStyle}>
            <Text style={msgStyle}>{item.text}</Text>
            <Text style={dateStyle}>{formatDate(item.date)}</Text>
            <AppButton
              title="🔊"
              onPress={() => speak(item)}
              color="primary"
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 8,
                marginLeft: 12,
                minWidth: 44,
              }}
              accessibilityLabel={`Écouter le message : ${item.text}`}
              textStyle={{ fontSize: 20 }}
            />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <Text style={[msgStyle, { textAlign: "center", marginTop: 32 }]}>
            Aucun message
          </Text>
        }
      />
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginVertical: 8,
    padding: 16,
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  msg: { flex: 1, fontSize: typography.fontSizeRegular, color: colors.text },
  date: { fontSize: 12, color: colors.text, marginLeft: 8 },
});
