import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const CACHE_PREFIX = "@translation:"; // @translation:src:dst:text

function getEnv(name) {
  // Prefer EXPO_PUBLIC_* at runtime; fallback to app.json extra
  if (typeof process !== "undefined" && process.env && process.env[name]) {
    return process.env[name];
  }
  const extra = Constants?.expoConfig?.extra || Constants?.manifest?.extra || {};
  return extra[name];
}

const PROVIDER = (getEnv("EXPO_PUBLIC_TRANSLATION_PROVIDER") || "google").toLowerCase();
const GOOGLE_KEY = getEnv("EXPO_PUBLIC_GOOGLE_TRANSLATE_KEY");
const DEEPL_KEY = getEnv("EXPO_PUBLIC_DEEPL_API_KEY");

const providerOrder = () => {
  const list = [];
  if (PROVIDER === "deepl") list.push("deepl", "google");
  else list.push("google", "deepl");
  return list;
};

const mapToGoogle = (lang) => {
  switch (lang) {
    case "fr":
    case "en":
    case "ar":
    case "mg":
      return lang;
    default:
      return "en";
  }
};

const mapToDeepL = (lang) => {
  switch (lang) {
    case "fr":
      return "FR";
    case "en":
      return "EN";
    case "ar":
      return "AR";
    default:
      return null; // DeepL might not support mg
  }
};

async function getCached(source, target, text) {
  try {
    const key = `${CACHE_PREFIX}${source}:${target}:${text}`;
    const value = await AsyncStorage.getItem(key);
    return value || null;
  } catch {
    return null;
  }
}

async function setCached(source, target, text, translated) {
  try {
    const key = `${CACHE_PREFIX}${source}:${target}:${text}`;
    await AsyncStorage.setItem(key, translated);
  } catch {}
}

async function translateWithGoogle(text, source, target) {
  if (!GOOGLE_KEY) return null;
  const q = encodeURIComponent(text);
  const sl = mapToGoogle(source);
  const tl = mapToGoogle(target);
  const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_KEY}`;
  const body = {
    q: text,
    source: sl,
    target: tl,
    format: "text",
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) return null;
  const data = await res.json();
  const translated = data?.data?.translations?.[0]?.translatedText;
  return translated || null;
}

async function translateWithDeepL(text, source, target) {
  if (!DEEPL_KEY) return null;
  const sl = mapToDeepL(source);
  const tl = mapToDeepL(target);
  if (!tl) return null;
  const params = new URLSearchParams();
  params.append("text", text);
  if (sl) params.append("source_lang", sl);
  params.append("target_lang", tl);
  const res = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    headers: { Authorization: `DeepL-Auth-Key ${DEEPL_KEY}` },
    body: params,
  });
  if (!res.ok) return null;
  const data = await res.json();
  const translated = data?.translations?.[0]?.text;
  return translated || null;
}

export async function translateText(text, source, target) {
  if (!text || !text.trim() || source === target) return text;
  const cached = await getCached(source, target, text);
  if (cached) return cached;

  const order = providerOrder();
  let translated = null;
  for (const p of order) {
    try {
      if (p === "google") translated = await translateWithGoogle(text, source, target);
      else if (p === "deepl") translated = await translateWithDeepL(text, source, target);
      if (translated) break;
    } catch {}
  }

  if (!translated) return text; // fallback: original text
  await setCached(source, target, text, translated);
  return translated;
}

export function getSpeakLangCode(langue) {
  // Map to expo-speech BCP-47 codes
  switch (langue) {
    case "fr":
      return "fr-FR";
    case "en":
      return "en-US";
    case "ar":
      return "ar-SA";
    case "mg":
      return "en-US"; // fallback
    default:
      return "en-US";
  }
}

