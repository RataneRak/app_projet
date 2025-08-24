import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";

function grams(text, n = 3) {
  const s = ` ${text.toLowerCase()} `;
  const arr = [];
  for (let i = 0; i <= s.length - n; i++) arr.push(s.slice(i, i + n));
  return arr;
}

let modelsCache = null;

export async function loadLidModels() {
  if (modelsCache) return modelsCache;
  try {
    const asset = Asset.fromModule(
      require("../../assets/nlp/lid_ngrams_mini.json")
    );
    await asset.downloadAsync();
    const json = await FileSystem.readAsStringAsync(asset.localUri);
    modelsCache = JSON.parse(json);
  } catch (e) {
    // mini modèles par défaut (exemple très réduit) – à remplacer par vos stats réelles
    modelsCache = {
      fr: { "tri:ent": 0.6, "tri:ion": 0.5, "tri:que": 0.7 },
      en: { "tri: the": 0.8, "tri:ing": 0.6, "tri:and": 0.5 },
      mg: { "tri: ny": 0.7, "tri:ana": 0.5, "tri:aka": 0.4 },
    };
  }
  return modelsCache;
}

export async function detectLanguage(text, { n = 3 } = {}) {
  const models = await loadLidModels();
  const gs = grams(text, n);
  const scores = {};
  for (const lang of Object.keys(models)) {
    let s = 0;
    const table = models[lang];
    for (const g of gs) {
      const key = `tri:${g}`;
      if (table[key]) s += table[key];
    }
    scores[lang] = s / (gs.length || 1);
  }
  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [best, score] = ranked[0] || ["fr", 0];
  return { lang: best, confidence: score, scores };
}
