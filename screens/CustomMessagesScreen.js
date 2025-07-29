import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Speech from "expo-speech";
import i18n, { LANG_KEY, getDefaultLang, ttsLangMap } from "../i18n";
import { LanguageContext } from "../App";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

const STORAGE_KEY = "@custom_messages";

export default function CustomMessagesScreen({ navigation }) {
  const { lang } = useContext(LanguageContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    i18n.locale = lang;
    navigation.setOptions({ title: i18n.t("customMessages") });
  }, [lang]);

  const loadMessages = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setMessages(JSON.parse(stored));
    } catch (e) {}
  };

  const saveMessages = async (msgs) => {
    setMessages(msgs);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const addMessage = () => {
    if (input.trim().length === 0) return;
    const newMsgs = [
      ...messages,
      { id: Date.now().toString(), label: input.trim(), image: image || null },
    ];
    saveMessages(newMsgs);
    setInput("");
    setImage(null);
  };

  const deleteMessage = (id) => {
    const newMsgs = messages.filter((msg) => msg.id !== id);
    saveMessages(newMsgs);
  };

  const handleSpeak = (text) => {
    const voiceLang = ttsLangMap[lang] || "en-US";
    Speech.speak(text, { language: voiceLang });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t("customMessages")}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={i18n.t("addMessage")}
          value={input}
          onChangeText={setInput}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.addBtn} onPress={addMessage}>
          <MaterialIcons name="add-circle" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
        <MaterialIcons
          name="image"
          size={22}
          color={image ? "#1976d2" : "#888"}
        />
        <Text style={{ color: image ? "#1976d2" : "#888", marginLeft: 8 }}>
          {image ? i18n.t("imageSelected") : i18n.t("pickImage")}
        </Text>
      </TouchableOpacity>
      {image && (
        <View style={{ alignItems: "center", marginVertical: 8 }}>
          <Image
            source={{ uri: image }}
            style={styles.previewImage}
            accessible
            accessibilityLabel={i18n.t("selectedImage")}
          />
        </View>
      )}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={styles.cardImage}
                  accessible
                  accessibilityLabel={item.label}
                />
              ) : (
                <View style={styles.cardImagePlaceholder}>
                  <MaterialIcons name="image" size={28} color="#bbb" />
                </View>
              )}
              <Text style={styles.msgLabel}>{item.label}</Text>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  onPress={() => handleSpeak(item.label)}
                  style={styles.iconBtn}
                  accessibilityLabel={i18n.t("speak")}
                >
                  <MaterialIcons name="volume-up" size={24} color="#1976d2" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteMessage(item.id)}
                  style={styles.iconBtn}
                  accessibilityLabel={i18n.t("delete")}
                >
                  <MaterialIcons name="delete" size={24} color="#d32f2f" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: "#888", marginTop: 20, textAlign: "center" }}>
            {i18n.t("noCustom")}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f7fafd" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 18,
    color: "#1976d2",
    alignSelf: "center",
  },
  inputRow: { flexDirection: "row", marginBottom: 16 },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#b3c6e6",
    borderRadius: 12,
    padding: 10,
    marginRight: 8,
    backgroundColor: "#fff",
    fontSize: 18,
  },
  addBtn: {
    backgroundColor: "#1976d2",
    paddingHorizontal: 8,
    justifyContent: "center",
    borderRadius: 50,
    alignItems: "center",
    height: 48,
    width: 48,
    shadowColor: "#1976d2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  imageBtn: {
    backgroundColor: "#e3eafc",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#b3c6e6",
    flexDirection: "row",
    justifyContent: "center",
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#b3c6e6",
    marginVertical: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#1976d2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    padding: 0,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  cardImage: {
    width: 56,
    height: 56,
    borderRadius: 14,
    marginRight: 14,
    backgroundColor: "#e3eafc",
  },
  cardImagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 14,
    marginRight: 14,
    backgroundColor: "#e3eafc",
    alignItems: "center",
    justifyContent: "center",
  },
  msgLabel: { fontSize: 20, flex: 1, color: "#222", fontWeight: "500" },
  cardActions: { flexDirection: "row", alignItems: "center" },
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
});
