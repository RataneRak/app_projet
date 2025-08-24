// services/Suggestions.js
import AsyncStorage from "@react-native-async-storage/async-storage";
const KEY = "@bigram_counts"; // {"idA->idB": count}

export async function learnSequence(ids) {
  if (!Array.isArray(ids) || ids.length < 2) return;
  const raw = (await AsyncStorage.getItem(KEY)) ?? "{}";
  const map = JSON.parse(raw);
  for (let i = 0; i < ids.length - 1; i++) {
    const k = `${ids[i]}->${ids[i + 1]}`;
    map[k] = (map[k] ?? 0) + 1;
  }
  await AsyncStorage.setItem(KEY, JSON.stringify(map));
}

export async function suggestAfter(prevId, limit = 6) {
  const raw = (await AsyncStorage.getItem(KEY)) ?? "{}";
  const map = JSON.parse(raw);
  const items = Object.entries(map)
    .filter(([k]) => k.startsWith(prevId + "->"))
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([k]) => k.split("->")[1]);
  return items;
}
