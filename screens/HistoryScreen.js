import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Speech from "expo-speech";
import i18n, { ttsLangMap } from "../i18n";
import { LanguageContext } from "../App";
import { MaterialIcons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const STORAGE_KEY = "@history";
const { width } = Dimensions.get("window");

function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleString();
}

export default function HistoryScreen({ navigation }) {
  const { lang } = useContext(LanguageContext);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    i18n.locale = lang;
    navigation.setOptions({ title: i18n.t("history") });
  }, [lang]);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch (e) {}
  };

  const clearHistory = async () => {
    Alert.alert(i18n.t("clear"), i18n.t("confirmClear"), [
      { text: i18n.t("cancel"), style: "cancel" },
      {
        text: i18n.t("yes"),
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem(STORAGE_KEY);
          setHistory([]);
        },
      },
    ]);
  };

  const handleSpeak = (item) => {
    const voiceLang = ttsLangMap[item.lang] || "en-US";
    Speech.speak(item.text, { language: voiceLang });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Icon name="history" size={28} color="#1976d2" style={styles.cardIcon} />
      <View style={styles.cardContent}>
        <Text style={styles.msgLabel} numberOfLines={2} ellipsizeMode="tail">
          {typeof item.text === "string"
            ? item.text
            : JSON.stringify(item.text)}
        </Text>
        <Text style={styles.dateLabel}>{formatDate(item.date)}</Text>
      </View>
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() => handleSpeak(item)}
        accessibilityLabel={i18n.t("speak")}
      >
        <MaterialIcons name="volume-up" size={24} color="#1976d2" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{i18n.t("history")}</Text>
        <TouchableOpacity
          onPress={clearHistory}
          style={styles.clearBtn}
          accessibilityLabel={i18n.t("clear")}
        >
          <MaterialIcons name="delete" size={28} color="#d32f2f" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={history
          .slice()
          .reverse()
          .map((item) => ({ ...item, date: item.date || new Date() }))}
        keyExtractor={(_, idx) => idx.toString()}
        contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="history" size={64} color="#b3c6e6" />
            <Text style={styles.emptyText}>{i18n.t("noHistory")}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width < 400 ? 10 : 20,
    backgroundColor: "#f7fafd",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    fontSize: width < 400 ? 20 : 24,
    fontWeight: "bold",
    color: "#1976d2",
  },
  clearBtn: {
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 6,
    shadowColor: "#1976d2",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 14,
    padding: width < 400 ? 10 : 16,
    shadowColor: "#1976d2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 70,
  },
  cardIcon: {
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  msgLabel: {
    fontSize: width < 400 ? 16 : 20,
    color: "#222",
    fontWeight: "500",
    marginBottom: 2,
  },
  dateLabel: {
    fontSize: width < 400 ? 10 : 12,
    color: "#888",
  },
  iconBtn: {
    backgroundColor: "#f5f5f5",
    borderRadius: 50,
    padding: 8,
    marginLeft: 8,
    shadowColor: "#1976d2",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  emptyText: {
    color: "#b3c6e6",
    fontWeight: "bold",
    fontSize: width < 400 ? 18 : 22,
    marginTop: 12,
    textAlign: "center",
  },
});
