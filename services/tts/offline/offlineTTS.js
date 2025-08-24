// services/tts/offline/offlineTTS.js
import { Audio } from "expo-av";
import { pcm16ToWavBase64 } from "./wav";
import { g2p } from "./g2p_malagasy";

let ready = false;

// Init "offline TTS" (placeholder). Plus tard, charge tes modèles ONNX ici.
export async function initOfflineTTS() {
  // Ex: préparer onnxruntime-react-native + charger assets modèles
  // Pour l’instant, rien à charger : on synthétise une onde factice.
  ready = true;
  return true;
}

export function isOfflineReady() {
  return !!ready;
}

/**
 * Synthèse factice totalement hors-ligne (onde sinusoïdale)
 * pour valider l'intégration: pas de dépendances, pas d'API.
 * Remplacer le bloc "FAKE SYNTH" par l'inférence ONNX plus tard.
 */
export async function speakOffline(text, { sampleRate = 22050 } = {}) {
  if (!ready) throw new Error("Offline TTS not initialized");

  // 1) G2P (pour montrer le pipeline ; pas utilisé ici pour l’audio factice)
  const phones = g2p(text);
  // 2) FAKE SYNTH : génère une “intonation” selon la longueur/phones
  const durSec = Math.max(0.4, Math.min(2.0, text.length * 0.06)); // 0.4s à 2s
  const len = Math.floor(sampleRate * durSec);
  const pcm = new Int16Array(len);

  // Fréquence de base selon la 1ère voyelle trouvée (juste pour s’amuser)
  const baseF = /[a]/.test(phones)
    ? 190
    : /[e]/.test(phones)
      ? 210
      : /[i]/.test(phones)
        ? 230
        : /[o]/.test(phones)
          ? 170
          : /[u]/.test(phones)
            ? 160
            : 200;

  for (let i = 0; i < len; i++) {
    const t = i / sampleRate;
    const vibrato = Math.sin(2 * Math.PI * 5 * t) * 8; // léger vibrato
    const f = baseF + vibrato;
    const v = Math.sin(2 * Math.PI * f * t) * Math.exp(-3 * t); // mini décroissance
    pcm[i] = Math.max(-1, Math.min(1, v)) * 32767;
  }

  // 3) WAV + lecture
  const uri = pcm16ToWavBase64(pcm, sampleRate);
  const sound = new Audio.Sound();
  await sound.loadAsync({ uri });
  await sound.playAsync();
  return sound;
}
