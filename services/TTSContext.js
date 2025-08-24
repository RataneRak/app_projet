// services/TTSContext.js
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Platform } from "react-native";
import * as Linking from "expo-linking";

// ⤵️ AJOUT: offline TTS (100% local)
import {
  initOfflineTTS,
  speakOffline,
  isOfflineReady,
} from "./tts/offline/offlineTTS";

const KEY_VOICE_MAP = "@tts_voice_map"; // { fr: "...", en: "...", mg: "..." }
const KEY_VOLUME = "@tts_volume"; // 0..1
const KEY_WARNED_MG = "@tts_warned_no_mg"; // bool (pour ne pas spammer l’alerte)

const TTSContext = createContext({
  speaking: false,
  voiceMap: {},
  volume: 1,
  offlineReady: false, // ⤵️ AJOUT
  listVoices: async () => /** @type {Promise<Speech.Voice[]>} */ ([]),
  setVoiceForLocale: /** @type {(locale: string, id?: string) => void} */ (
    () => {}
  ),
  setVolume: /** @type {(v: number) => void} */ (() => {}),
  speak: /** @type {(text: string, locale?: string) => Promise<void>} */ (
    async () => {}
  ),
  stop: () => {},
});

export const TTSProvider = ({ children }) => {
  const [speaking, setSpeaking] = useState(false);
  const [voiceMap, setVoiceMap] = useState({}); // { fr, en, mg, ... }
  const [voices, setVoices] = useState([]); // cache des voix dispo
  const [volume, setVolumeState] = useState(1);
  const [offlineReady, setOfflineReady] = useState(false); // ⤵️ AJOUT
  const warnedMissingRef = useRef(false);

  // garde le contrôle sur un son offline en cours
  const offlineSoundRef = useRef(null); // ⤵️ AJOUT

  // Restaurer préférences
  useEffect(() => {
    (async () => {
      try {
        const [vMap, vol, warned] = await Promise.all([
          AsyncStorage.getItem(KEY_VOICE_MAP),
          AsyncStorage.getItem(KEY_VOLUME),
          AsyncStorage.getItem(KEY_WARNED_MG),
        ]);
        if (vMap) setVoiceMap(JSON.parse(vMap));
        if (vol && !Number.isNaN(Number(vol)))
          setVolumeState(Math.max(0, Math.min(1, Number(vol))));
        warnedMissingRef.current = warned === "true";
      } catch {}
    })();
  }, []);

  // Charger la liste des voix dispo (une fois)
  useEffect(() => {
    (async () => {
      try {
        const list = await Speech.getAvailableVoicesAsync();
        // déduplique
        const map = new Map();
        list.forEach((v) =>
          map.set(v.identifier || `${v.name}-${v.language}`, v)
        );
        setVoices(Array.from(map.values()));
      } catch {}
    })();
  }, []);

  // ⤵️ AJOUT: initialiser le TTS offline (chargement modèles plus tard)
  useEffect(() => {
    (async () => {
      try {
        await initOfflineTTS(); // la version "FAKE SYNTH" est instantanée
        setOfflineReady(isOfflineReady());
      } catch (e) {
        console.warn("Offline TTS init failed:", e?.message);
        setOfflineReady(false);
      }
    })();
  }, []);

  const persistVoiceMap = useCallback(async (next) => {
    setVoiceMap(next);
    await AsyncStorage.setItem(KEY_VOICE_MAP, JSON.stringify(next));
  }, []);

  const setVoiceForLocale = useCallback(
    (locale, id) => {
      const lang = (locale || "").slice(0, 2) || "fr";
      const next = { ...voiceMap, [lang]: id };
      persistVoiceMap(next);
    },
    [voiceMap, persistVoiceMap]
  );

  const setVolume = useCallback((v) => {
    const clamped = Math.max(0, Math.min(1, Number(v)));
    setVolumeState(clamped);
    AsyncStorage.setItem(KEY_VOLUME, String(clamped));
  }, []);

  // Sélectionne la "meilleure" voix pour une locale (lang prefix), ex: "mg"
  const pickBestVoiceId = useCallback(
    (targetLocale) => {
      if (!targetLocale) return undefined;
      const lang = targetLocale.slice(0, 2).toLowerCase();
      // Priorité 1 : voix dont v.language commence par "mg"
      const perfect = voices.find((v) =>
        (v.language || "").toLowerCase().startsWith(lang)
      );
      if (perfect) return perfect.identifier;

      // Priorité 2 : voix "multilingue"
      const multi = voices.find((v) => !v.language || v.language === "mul");
      if (multi) return multi.identifier;

      return undefined;
    },
    [voices]
  );

  const maybeWarnToInstallMg = useCallback(async () => {
    if (warnedMissingRef.current) return;
    warnedMissingRef.current = true;
    await AsyncStorage.setItem(KEY_WARNED_MG, "true");
    Alert.alert(
      "Voix malgache indisponible",
      "Aucune voix TTS malgache n'est installée sur cet appareil. Vous pouvez installer un moteur TTS (ex: eSpeak NG) et activer la langue Malagasy dans les réglages TTS.",
      [
        {
          text: "Ouvrir réglages TTS",
          onPress: () => {
            if (Platform.OS === "android") {
              Linking.openSettings(); // fallback générique
            } else {
              Linking.openSettings();
            }
          },
        },
        { text: "OK", style: "cancel" },
      ]
    );
  }, []);

  const listVoices = useCallback(async () => voices, [voices]);

  // ⤵️ MODIF: speak devient async pour gérer le offline proprement
  const speak = useCallback(
    async (text, locale) => {
      const toSay = String(text || "").trim();
      if (!toSay) return;

      const lang = (locale || "").slice(0, 2) || "fr";

      // 1) Chemin préféré: MALGACHE OFFLINE si prêt
      if (lang === "mg" && offlineReady) {
        try {
          // stop any previous
          try {
            if (offlineSoundRef.current) {
              await offlineSoundRef.current.stopAsync();
              await offlineSoundRef.current.unloadAsync();
            }
          } catch {}

          setSpeaking(true);
          const snd = await speakOffline(toSay); // retourne un Audio.Sound
          offlineSoundRef.current = snd;

          // on surveille la fin de lecture pour MAJ speaking
          snd.setOnPlaybackStatusUpdate((st) => {
            if (st?.didJustFinish || (st?.isLoaded && !st.isPlaying)) {
              setSpeaking(false);
              try {
                snd.setOnPlaybackStatusUpdate(null);
              } catch {}
            }
          });
          return;
        } catch (e) {
          console.warn("Offline MG failed, fallback to native:", e?.message);
          // si erreur: on tombera en fallback natif plus bas
        }
      }

      // 2) Fallback TTS natif (expo-speech), inchangé
      try {
        let voiceId = voiceMap[lang];

        // auto-bind si rien n'est mémorisé
        if (!voiceId) {
          const picked = pickBestVoiceId(locale);
          if (picked) {
            voiceId = picked;
            const next = { ...voiceMap, [lang]: voiceId };
            AsyncStorage.setItem(KEY_VOICE_MAP, JSON.stringify(next));
            setVoiceMap(next);
          } else if (lang === "mg") {
            // pas de voix malgache native → prévenir une seule fois
            await maybeWarnToInstallMg();
          }
        }

        // on arrête expo-speech avant de relancer
        try {
          Speech.stop();
        } catch {}

        Speech.speak(toSay, {
          language: locale,
          voice: voiceId, // si undefined, expo-speech choisit un fallback
          volume,
          onStart: () => setSpeaking(true),
          onDone: () => setSpeaking(false),
          onStopped: () => setSpeaking(false),
          onError: () => setSpeaking(false),
        });
      } catch (e2) {
        console.warn("Native TTS failed:", e2?.message);
        setSpeaking(false);
      }
    },
    [voiceMap, volume, pickBestVoiceId, maybeWarnToInstallMg, offlineReady]
  );

  const stop = useCallback(async () => {
    try {
      Speech.stop();
    } catch {}
    try {
      if (offlineSoundRef.current) {
        await offlineSoundRef.current.stopAsync();
        await offlineSoundRef.current.unloadAsync();
        offlineSoundRef.current = null;
      }
    } catch {}
    setSpeaking(false);
  }, []);

  const value = useMemo(
    () => ({
      speaking,
      voiceMap,
      volume,
      offlineReady, // ⤵️ exposé pour ton UI
      listVoices,
      setVoiceForLocale,
      setVolume,
      speak,
      stop,
    }),
    [
      speaking,
      voiceMap,
      volume,
      offlineReady,
      listVoices,
      setVoiceForLocale,
      setVolume,
      speak,
      stop,
    ]
  );

  return <TTSContext.Provider value={value}>{children}</TTSContext.Provider>;
};

export const useTTS = () => useContext(TTSContext);
