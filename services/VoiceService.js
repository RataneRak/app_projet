// services/VoiceService.js
// Unifie TTS offline (MG) + expo-speech (fallback).
// API compatible avec ta version: speak, stop, isVoiceAvailable, speakMalagasy, speakWithVoice.

import * as Speech from "expo-speech";
import {
  initOfflineTTS,
  speakOffline,
  isOfflineReady as _isOfflineReady,
} from "./tts/offline/offlineTTS";

// Config de fallback pour expo-speech (hors MG offline)
const VOICE_CONFIG = {
  fr: { language: "fr-FR", pitch: 1.0, rate: 0.8 },
  en: { language: "en-US", pitch: 1.0, rate: 0.8 },
  mg: { language: "en-US", pitch: 1.0, rate: 0.7 }, // utilisé seulement si offline indispo
  ar: { language: "ar-SA", pitch: 1.0, rate: 0.8 },
  es: { language: "es-ES", pitch: 1.0, rate: 0.8 },
};

class VoiceService {
  constructor() {
    this.isSpeaking = false;
    this.currentVoice = null;
    this._initialized = false;
    this._offlineSound = null;
    // init lazy : on initialisera offline au premier speak()
  }

  async _ensureInit() {
    if (this._initialized) return;
    try {
      await initOfflineTTS(); // version FAKE SYNTH instantanée; remplacera l’inférence ONNX plus tard
    } catch (e) {
      // pas grave, on retombera sur expo-speech
      // console.warn("Offline TTS init failed:", e?.message);
    }
    this._initialized = true;
  }

  _setSpeaking(v) {
    this.isSpeaking = !!v;
  }

  _cfgFor(language) {
    return VOICE_CONFIG[language] || VOICE_CONFIG.fr;
  }

  // Parler (offline MG si possible, sinon expo-speech)
  async speak(text, language = "fr") {
    const msg = String(text || "").trim();
    if (!msg) return;

    await this._ensureInit();

    // Stop toute lecture en cours avant d'en lancer une autre
    await this.stop();

    const lang = (language || "fr").slice(0, 2).toLowerCase();

    // 1) MALGACHE OFFLINE prioritaire si prêt
    if (lang === "mg" && _isOfflineReady()) {
      try {
        this._setSpeaking(true);
        const snd = await speakOffline(msg); // Audio.Sound
        this._offlineSound = snd;

        // synchroniser l’état isSpeaking avec la lecture
        snd.setOnPlaybackStatusUpdate((st) => {
          // fin ou pause
          if (st?.didJustFinish || (st?.isLoaded && !st.isPlaying)) {
            this._setSpeaking(false);
            try {
              snd.setOnPlaybackStatusUpdate(null);
            } catch {}
            this._offlineSound = null;
          }
        });
        return;
      } catch (e) {
        // offline échoué → fallback expo-speech
        // console.warn("Offline MG failed, fallback:", e?.message);
      }
    }

    // 2) Fallback expo-speech (toutes langues y compris MG si offline indispo)
    const cfg = this._cfgFor(lang);
    try {
      this._setSpeaking(true);
      Speech.stop();
      Speech.speak(msg, {
        language: cfg.language,
        pitch: cfg.pitch,
        rate: cfg.rate,
        onStart: () => this._setSpeaking(true),
        onDone: () => this._setSpeaking(false),
        onStopped: () => this._setSpeaking(false),
        onError: () => this._setSpeaking(false),
      });
    } catch (e2) {
      this._setSpeaking(false);
      console.error("Native TTS failed:", e2);
    }
  }

  // Arrête expo-speech ET le son offline
  async stop() {
    try {
      Speech.stop();
    } catch {}
    if (this._offlineSound) {
      try {
        await this._offlineSound.stopAsync();
        await this._offlineSound.unloadAsync();
      } catch {}
      this._offlineSound = null;
    }
    this._setSpeaking(false);
  }

  // Vérifier si une voix est dispo
  // - Pour MG, on considère "disponible" si offline prêt, sinon on dit true
  //   (car fallback expo-speech en EN existe) → tu peux durcir si tu veux.
  async isVoiceAvailable(language = "fr") {
    const lang = (language || "fr").slice(0, 2).toLowerCase();
    if (lang === "mg") {
      return _isOfflineReady() || !!VOICE_CONFIG.mg;
    }
    return !!this._cfgFor(lang);
  }

  // Raccourci MG
  speakMalagasy(text) {
    return this.speak(text, "mg");
  }

  // Parler avec config personnalisée (expo-speech uniquement)
  speakWithVoice(text /* , voiceConfig */) {
    const msg = String(text || "").trim();
    if (!msg) return;

    // Stop avant de relancer
    this.stop();

    try {
      this._setSpeaking(true);
      Speech.speak(msg, {
        // ...voiceConfig, // si tu veux, passe un objet ici
        onStart: () => this._setSpeaking(true),
        onDone: () => this._setSpeaking(false),
        onStopped: () => this._setSpeaking(false),
        onError: () => this._setSpeaking(false),
      });
    } catch (e) {
      this._setSpeaking(false);
      console.error("speakWithVoice failed:", e);
    }
  }
}

export default new VoiceService();
