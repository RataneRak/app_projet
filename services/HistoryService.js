// services/HistoryService.js
import AsyncStorage from "@react-native-async-storage/async-storage";
const STORAGE_KEY = "@history"; // array de { id, text, locale, createdAt }

export async function addToHistory(text, locale) {
  try {
    const raw = (await AsyncStorage.getItem(STORAGE_KEY)) ?? "[]";
    const arr = JSON.parse(raw);
    const item = {
      id: String(Date.now()),
      text,
      locale,
      createdAt: Date.now(),
    };
    arr.unshift(item);
    const trimmed = arr.slice(0, 200); // garde les 200 derniers
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    return item;
  } catch {
    return null;
  }
}

export async function getHistory() {
  try {
    const raw = (await AsyncStorage.getItem(STORAGE_KEY)) ?? "[]";
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function clearHistory() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {}
}
