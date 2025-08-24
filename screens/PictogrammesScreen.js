// screens/PictogrammesScreen.js
import React, { useState, useContext, useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  ScrollView,
  SafeAreaView,
  Animated,
  Easing,
  Platform,
  useWindowDimensions,
  PixelRatio,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { colors, typography } from "../theme";
import AppButton from "../components/AppButton";
import { SettingsContext } from "../services/SettingsContext";
import { getTTSLang } from "../i18n";

/** 🔊 TTS + historique + suggestions */
import { useTTS } from "../services/TTSContext";
import { addToHistory } from "../services/HistoryService";
import { learnSequence, suggestAfter } from "../services/Suggestions";

/* ===========================================================
 *  Traductions EN par id pour les pictos FR
 * =========================================================== */
const TRANSLATIONS = {
  1: { en: "I'm hungry" },
  9: { en: "I want an apple" },
  10: { en: "I want bread" },
  11: { en: "I want cheese" },
  12: { en: "I want a banana" },
  13: { en: "I want rice" },
  14: { en: "I want soup" },
  38: { en: "I want chicken" },
  39: { en: "I want pasta" },
  40: { en: "I want cake" },
  2: { en: "I'm thirsty" },
  15: { en: "I want water" },
  16: { en: "I want juice" },
  17: { en: "I want milk" },
  18: { en: "I want tea" },
  41: { en: "I want coffee" },
  42: { en: "I want soda" },
  3: { en: "Toilet" },
  4: { en: "Help" },
  19: { en: "I'm tired" },
  20: { en: "I'm cold" },
  21: { en: "I'm hot" },
  43: { en: "I need a hug" },
  44: { en: "I need to rest" },
  22: { en: "I want to go to my room" },
  23: { en: "I want to watch TV" },
  24: { en: "I want to go out" },
  45: { en: "I want to go to the kitchen" },
  46: { en: "I want to go to the living room" },
  7: { en: "I am in pain" },
  8: { en: "Thank you" },
  25: { en: "I am happy" },
  26: { en: "I am sad" },
  27: { en: "I am scared" },
  28: { en: "I am angry" },
  47: { en: "I am surprised" },
  48: { en: "I am calm" },
  29: { en: "I want to play" },
  30: { en: "I want to draw" },
  31: { en: "I want to listen to music" },
  32: { en: "I want to read" },
  49: { en: "I want to do sport" },
  50: { en: "I want to dance" },
  33: { en: "Call mom" },
  34: { en: "Call dad" },
  35: { en: "Call emergency" },
  36: { en: "Call a friend" },
  37: { en: "Call the doctor" },
};

function getDisplayLabelForPicto(picto, langue) {
  const lang = (langue || "fr").slice(0, 2).toLowerCase();
  if (lang === "mg") return picto.label;
  if (lang === "en") {
    const tr = TRANSLATIONS[String(picto.id)];
    if (tr?.en) return tr.en;
  }
  return picto.label;
}

/* =======================
 *  Pictos multilingues
 * ======================= */
const PICTOS_BY_LANG = {
  fr: [
    { id: "1", label: "J'ai faim", emoji: "🍽️", category: "nourriture" },
    {
      id: "9",
      label: "Je veux une pomme",
      emoji: "🍏",
      category: "nourriture",
    },
    { id: "10", label: "Je veux du pain", emoji: "🍞", category: "nourriture" },
    {
      id: "11",
      label: "Je veux du fromage",
      emoji: "🧀",
      category: "nourriture",
    },
    {
      id: "12",
      label: "Je veux une banane",
      emoji: "🍌",
      category: "nourriture",
    },
    { id: "13", label: "Je veux du riz", emoji: "🍚", category: "nourriture" },
    {
      id: "14",
      label: "Je veux une soupe",
      emoji: "🥣",
      category: "nourriture",
    },
    {
      id: "38",
      label: "Je veux du poulet",
      emoji: "🍗",
      category: "nourriture",
    },
    {
      id: "39",
      label: "Je veux des pâtes",
      emoji: "🍝",
      category: "nourriture",
    },
    {
      id: "40",
      label: "Je veux un gâteau",
      emoji: "🍰",
      category: "nourriture",
    },
    { id: "2", label: "J'ai soif", emoji: "🥤", category: "boisson" },
    { id: "15", label: "Je veux de l'eau", emoji: "💧", category: "boisson" },
    { id: "16", label: "Je veux du jus", emoji: "🧃", category: "boisson" },
    { id: "17", label: "Je veux du lait", emoji: "🥛", category: "boisson" },
    { id: "18", label: "Je veux du thé", emoji: "🍵", category: "boisson" },
    { id: "41", label: "Je veux du café", emoji: "☕", category: "boisson" },
    { id: "42", label: "Je veux un soda", emoji: "🥤", category: "boisson" },
    { id: "3", label: "Toilettes", emoji: "🚻", category: "besoins" },
    { id: "4", label: "Aide", emoji: "🆘", category: "besoins" },
    { id: "19", label: "Je suis fatigué(e)", emoji: "😴", category: "besoins" },
    { id: "20", label: "J'ai froid", emoji: "🥶", category: "besoins" },
    { id: "21", label: "J'ai chaud", emoji: "🥵", category: "besoins" },
    {
      id: "43",
      label: "J'ai besoin d'un câlin",
      emoji: "🤗",
      category: "besoins",
    },
    {
      id: "44",
      label: "J'ai besoin de repos",
      emoji: "🛌",
      category: "besoins",
    },
    {
      id: "22",
      label: "Je veux aller dans ma chambre",
      emoji: "🛏️",
      category: "maison",
    },
    {
      id: "23",
      label: "Je veux regarder la télé",
      emoji: "📺",
      category: "maison",
    },
    { id: "24", label: "Je veux sortir", emoji: "🚪", category: "maison" },
    {
      id: "45",
      label: "Je veux aller à la cuisine",
      emoji: "🍳",
      category: "maison",
    },
    {
      id: "46",
      label: "Je veux aller au salon",
      emoji: "🛋️",
      category: "maison",
    },
    { id: "7", label: "J'ai mal", emoji: "🤕", category: "emotions" },
    { id: "8", label: "Merci", emoji: "🙏", category: "emotions" },
    {
      id: "25",
      label: "Je suis content(e)",
      emoji: "😃",
      category: "emotions",
    },
    { id: "26", label: "Je suis triste", emoji: "😢", category: "emotions" },
    { id: "27", label: "J'ai peur", emoji: "😨", category: "emotions" },
    { id: "28", label: "Je suis en colère", emoji: "😡", category: "emotions" },
    {
      id: "47",
      label: "Je suis surpris(e)",
      emoji: "😲",
      category: "emotions",
    },
    { id: "48", label: "Je suis calme", emoji: "😌", category: "emotions" },
    { id: "29", label: "Je veux jouer", emoji: "🧸", category: "activites" },
    { id: "30", label: "Je veux dessiner", emoji: "🎨", category: "activites" },
    {
      id: "31",
      label: "Je veux écouter de la musique",
      emoji: "🎵",
      category: "activites",
    },
    { id: "32", label: "Je veux lire", emoji: "📚", category: "activites" },
    {
      id: "49",
      label: "Je veux faire du sport",
      emoji: "⚽",
      category: "activites",
    },
    { id: "50", label: "Je veux danser", emoji: "💃", category: "activites" },
    { id: "33", label: "Appeler maman", emoji: "👩", category: "appeler" },
    { id: "34", label: "Appeler papa", emoji: "👨", category: "appeler" },
    {
      id: "35",
      label: "Appeler les urgences",
      emoji: "🚑",
      category: "appeler",
    },
    { id: "36", label: "Appeler un ami", emoji: "👥", category: "appeler" },
    { id: "37", label: "Appeler le médecin", emoji: "👨‍⚕️", category: "appeler" },
  ],
  mg: [
    { id: "1", label: "Noana aho", emoji: "🍽️", category: "sakafo" },
    {
      id: "9",
      label: "Tia ihinana paoma aho",
      emoji: "🍏",
      category: "sakafo",
    },
    {
      id: "10",
      label: "Tia ihinana mofo aho",
      emoji: "🍞",
      category: "sakafo",
    },
    {
      id: "11",
      label: "Tia ihinana fromazy aho",
      emoji: "🧀",
      category: "saka",
    },
    {
      id: "12",
      label: "Tia ihinana akondro aho",
      emoji: "🍌",
      category: "sakafo",
    },
    {
      id: "13",
      label: "Tia ihinana vary aho",
      emoji: "🍚",
      category: "sakafo",
    },
    {
      id: "14",
      label: "Tia ihinana lasopy aho",
      emoji: "🥣",
      category: "sakafo",
    },
    {
      id: "38",
      label: "Tia ihinana akoho aho",
      emoji: "🍗",
      category: "sakafo",
    },
    {
      id: "39",
      label: "Tia ihinana paty aho",
      emoji: "🍝",
      category: "sakafo",
    },
    {
      id: "40",
      label: "Tia ihinana gato aho",
      emoji: "🍰",
      category: "sakafo",
    },
    { id: "2", label: "Mangetaheta aho", emoji: "🥤", category: "rano" },
    { id: "15", label: "Tia isotro rano aho", emoji: "💧", category: "rano" },
    {
      id: "16",
      label: "Tia isotro ranom-boankazo aho",
      emoji: "🧃",
      category: "rano",
    },
    { id: "17", label: "Tia isotro ronono aho", emoji: "🥛", category: "rano" },
    { id: "18", label: "Tia isotro dite aho", emoji: "🍵", category: "rano" },
    { id: "41", label: "Tia isotro kafe aho", emoji: "☕", category: "rano" },
    { id: "42", label: "Tia isotro soda aho", emoji: "🥤", category: "rano" },
    { id: "3", label: "Kabone", emoji: "🚻", category: "ilaina" },
    { id: "4", label: "Fanampiana", emoji: "🆘", category: "ilaina" },
    { id: "19", label: "Reraka aho", emoji: "😴", category: "ilaina" },
    { id: "20", label: "Mangatsiaka aho", emoji: "🥶", category: "ilaina" },
    { id: "21", label: "Mafana aho", emoji: "🥵", category: "ilaina" },
    { id: "43", label: "Mila famorana aho", emoji: "🤗", category: "ilaina" },
    {
      id: "44",
      label: "Mila fialan-tsasatra aho",
      emoji: "🛌",
      category: "ilaina",
    },
    {
      id: "22",
      label: "Tia ho any am-piandrasana aho",
      emoji: "🛏️",
      category: "trano",
    },
    {
      id: "23",
      label: "Tia mijery fahitalavitra aho",
      emoji: "📺",
      category: "trano",
    },
    { id: "24", label: "Tia mivoaka aho", emoji: "🚪", category: "trano" },
    {
      id: "45",
      label: "Tia ho any am-pahandroana aho",
      emoji: "🍳",
      category: "trano",
    },
    {
      id: "46",
      label: "Tia ho any am-pivarotana aho",
      emoji: "🛋️",
      category: "trano",
    },
    { id: "7", label: "Marary aho", emoji: "🤕", category: "fahatsapana" },
    { id: "8", label: "Misaotra", emoji: "🙏", category: "fahatsapana" },
    { id: "25", label: "Faly aho", emoji: "😃", category: "fahatsapana" },
    { id: "26", label: "Malahelo aho", emoji: "😢", category: "fahatsapana" },
    { id: "27", label: "Matahotra aho", emoji: "😨", category: "fahatsapana" },
    { id: "28", label: "Tezitra aho", emoji: "😡", category: "fahatsapana" },
    { id: "47", label: "Gaga aho", emoji: "😲", category: "fahatsapana" },
    { id: "48", label: "Tony aho", emoji: "😌", category: "fahatsapana" },
    { id: "29", label: "Tia milalao aho", emoji: "🧸", category: "asa" },
    { id: "30", label: "Tia mandoko sary aho", emoji: "🎨", category: "asa" },
    { id: "31", label: "Tia mihaino mozika aho", emoji: "🎵", category: "asa" },
    { id: "32", label: "Tia mamaky boky aho", emoji: "📚", category: "asa" },
    {
      id: "49",
      label: "Tia manao fanatanjahan-tena aho",
      emoji: "⚽",
      category: "asa",
    },
    { id: "50", label: "Tia mandihy aho", emoji: "💃", category: "asa" },
    { id: "33", label: "Antsoy i Neny", emoji: "👩", category: "antso" },
    { id: "34", label: "Antsoy i Dada", emoji: "👨", category: "antso" },
    { id: "35", label: "Antso ny vonjy maika", emoji: "🚑", category: "antso" },
    { id: "36", label: "Antso ny namako", emoji: "👥", category: "antso" },
    { id: "37", label: "Antso ny dokotera", emoji: "👨‍⚕️", category: "antso" },
  ],
};

/* Couleurs d’accent par catégorie (clair & pro) */
const CAT_ACCENT = {
  nourriture: ["#FFF8EC", "#FFEED2"],
  boisson: ["#F3FAFF", "#E2F1FF"],
  besoins: ["#FFF0F3", "#FFE0E7"],
  maison: ["#F7F6FF", "#ECEAFF"],
  emotions: ["#FBF1FF", "#F2E6FF"],
  activites: ["#F3FFF7", "#E6FFEE"],
  appeler: ["#FFF8F0", "#FFEAD4"],
  // MG
  sakafo: ["#FFF8EC", "#FFEED2"],
  rano: ["#F3FAFF", "#E2F1FF"],
  ilaina: ["#FFF0F3", "#FFE0E7"],
  trano: ["#F7F6FF", "#ECEAFF"],
  fahatsapana: ["#FBF1FF", "#F2E6FF"],
  asa: ["#F3FFF7", "#E6FFEE"],
  antso: ["#FFF8F0", "#FFEAD4"],
};

const FAV_KEY = "@pictos_favorites_ids_v1";
const CUSTOM_PICTOS_KEY = "@custom_pictos_images_v1";
const CATEGORY_OPTIONS = [
  { key: "nourriture", label: "Nourriture" },
  { key: "boisson", label: "Boisson" },
  { key: "besoins", label: "Besoins" },
  { key: "maison", label: "Maison" },
  { key: "emotions", label: "Émotions" },
  { key: "activites", label: "Activités" },
  { key: "appeler", label: "Appeler" },
  { key: "autre", label: "Autre" },
];

export default function PictogrammesScreen({ route }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { texteGrand, contraste, modeEnfant, langue } =
    useContext(SettingsContext);
  const tts = useTTS();

  const currentLang = (langue || "fr").slice(0, 2).toLowerCase();
  const basePictos = PICTOS_BY_LANG[currentLang] || PICTOS_BY_LANG.fr;

  const [favorites, setFavorites] = useState([]);
  const [query, setQuery] = useState("");

  // ======= Custom pictos (avec image/emoji) =======
  const [customPictos, setCustomPictos] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [addLabel, setAddLabel] = useState("");
  const [addCategory, setAddCategory] = useState("autre");
  const [addEmoji, setAddEmoji] = useState("🔤");
  const [addImageUri, setAddImageUri] = useState(null);

  // ======= Sheet fiche picto =======
  const [pressedId, setPressedId] = useState(null);
  const [selectedPicto, setSelectedPicto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const sheetY = useRef(new Animated.Value(0)).current;
  const [suggestions, setSuggestions] = useState([]);

  // ======= Phrase =======
  const [phrase, setPhrase] = useState([]);

  const categoryParam = route?.params?.category || null;

  /* === Favoris persistés === */
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(FAV_KEY);
        if (raw) setFavorites(JSON.parse(raw));
      } catch {}
    })();
  }, []);
  const toggleFav = async (id) => {
    setFavorites((prev) => {
      const has = prev.includes(id);
      const next = has ? prev.filter((x) => x !== id) : [...prev, id];
      AsyncStorage.setItem(FAV_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  };

  /* === Charger les customs (persistants) === */
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(CUSTOM_PICTOS_KEY);
        if (raw) {
          const arr = JSON.parse(raw);
          if (Array.isArray(arr)) setCustomPictos(arr);
        }
      } catch {}
    })();
  }, []);

  async function persistCustom(next) {
    setCustomPictos(next);
    try {
      await AsyncStorage.setItem(CUSTOM_PICTOS_KEY, JSON.stringify(next));
    } catch {}
  }

  /* === Grille alignée === */
  const H_PADDING = 14;
  const GAP = 12;
  const numColumns = width >= 680 ? 3 : 2;
  const rawW = (width - H_PADDING * 2 - GAP * (numColumns - 1)) / numColumns;
  const cardW = PixelRatio.roundToNearestPixel(rawW);
  const cardH = Math.round(cardW * 1.06);
  const imgSide = Math.round(cardW * 0.62);
  const emojiSize = Math.max(48, Math.min(84, Math.round(cardW * 0.52)));
  const labelFont = texteGrand ? 18 : Math.max(14, Math.round(cardW * 0.11));
  const lineH = 20;
  const labelBlockH = lineH * 2 + 2;

  /* === Prépare la liste courante === */
  let allPictos = modeEnfant ? basePictos : [...basePictos, ...customPictos];
  if (categoryParam)
    allPictos = allPictos.filter((p) => p.category === categoryParam);

  /* === Recherche === */
  const q = query.trim().toLowerCase();
  if (q) {
    allPictos = allPictos.filter((p) =>
      getDisplayLabelForPicto(p, langue).toLowerCase().includes(q)
    );
  }

  /* === Utilitaires === */
  function norm(s) {
    return (s || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  async function updateSuggestionsForLast(arr) {
    if (!arr || arr.length === 0) return setSuggestions([]);
    const lastId = arr[arr.length - 1]?.id;
    if (!lastId) return setSuggestions([]);
    const nextIds = await suggestAfter(lastId);
    setSuggestions(nextIds);
  }

  function handleAddToPhrase(picto) {
    setPhrase((prev) => {
      const next = [
        ...prev,
        { ...picto, label: getDisplayLabelForPicto(picto, langue) },
      ];
      updateSuggestionsForLast(next);
      return next;
    });
    closeSheet();
  }

  function handleAddFromSuggestion(id) {
    const pic = basePictos
      .concat(customPictos)
      .find((p) => String(p.id) === String(id));
    if (!pic) return;
    handleAddToPhrase(pic);
  }

  function handleListenPhrase() {
    if (!phrase?.length) return;
    const text = phrase
      .map((p) => p.label || getDisplayLabelForPicto(p, langue))
      .join(" ");
    const locale = getTTSLang(langue);
    try {
      tts.speak(text, locale);
      addToHistory(text, langue);
      learnSequence(phrase.map((p) => p.id));
    } catch {
      Alert.alert("Erreur", "Impossible de lire la phrase.");
    }
  }

  function handleClearPhrase() {
    setPhrase([]);
    setSuggestions([]);
  }

  /* === Panneau “Nouveau pictogramme” === */
  function openAdd() {
    setAddOpen(true);
  }
  function closeAdd() {
    setAddOpen(false);
    setAddLabel("");
    setAddEmoji("🔤");
    setAddCategory("autre");
    setAddImageUri(null);
  }

  async function ensureDir(dir) {
    const info = await FileSystem.getInfoAsync(dir);
    if (!info.exists)
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }

  async function pickFromLibrary() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      return Alert.alert("Permission", "Accès à la galerie refusé.");
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: false,
      aspect: [1, 1],
    });
    if (!res.canceled && res.assets?.[0]?.uri) {
      setAddImageUri(res.assets[0].uri);
    }
  }

  async function captureFromCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      return Alert.alert("Permission", "Accès à la caméra refusé.");
    }
    const res = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
      base64: false,
      aspect: [1, 1],
    });
    if (!res.canceled && res.assets?.[0]?.uri) {
      setAddImageUri(res.assets[0].uri);
    }
  }

  async function saveLocalCopyIfNeeded(uri) {
    if (!uri) return null;
    try {
      const ext = uri.split(".").pop()?.toLowerCase() || "jpg";
      const dir = FileSystem.documentDirectory + "pictos/";
      await ensureDir(dir);
      const dest = dir + `picto_${Date.now()}.${ext}`;
      await FileSystem.copyAsync({ from: uri, to: dest });
      return dest; // persistent local uri
    } catch {
      return uri; // au cas où, on garde l’original (non garanti persistant)
    }
  }

  async function addPictoWithImage() {
    const labelClean = norm(addLabel);
    if (!labelClean)
      return Alert.alert("Oups", "Écris le libellé du pictogramme.");
    const exists = [...basePictos, ...customPictos].some(
      (p) => norm(getDisplayLabelForPicto(p, langue)) === labelClean
    );
    if (exists)
      return Alert.alert(
        "Déjà là",
        "Un pictogramme avec ce libellé existe déjà."
      );

    let storedUri = null;
    if (addImageUri) storedUri = await saveLocalCopyIfNeeded(addImageUri);

    const newPic = {
      id: String(Date.now()),
      label: addLabel.trim(),
      emoji: storedUri ? undefined : addEmoji || "🔤",
      imageUri: storedUri || null,
      category: addCategory || "autre",
    };

    const next = [newPic, ...customPictos];
    await persistCustom(next);
    closeAdd();
  }

  function removeCustomPicto(id) {
    const next = customPictos.filter((p) => p.id !== id);
    persistCustom(next);
  }

  /* === Fiche picto (bottom sheet) === */
  function openSheet(picto) {
    setSelectedPicto(picto);
    setModalVisible(true);
    sheetY.setValue(0);
    Animated.timing(sheetY, {
      toValue: 1,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }
  function closeSheet() {
    Animated.timing(sheetY, {
      toValue: 0,
      duration: 220,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedPicto(null);
    });
  }
  const sheetTranslate = sheetY.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });
  const backdropOpacity = sheetY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.35],
  });

  const titleStyle = [
    styles.title,
    texteGrand && { fontSize: typography.fontSizeXL },
    contraste && { color: colors.contrastText },
    { marginTop: insets.top + 6 },
  ];

  /* === Carte Picto === */
  const PictoCard = ({ item }) => {
    const pressed = pressedId === item.id;
    const displayLabel = getDisplayLabelForPicto(item, langue);
    const [g1, g2] = CAT_ACCENT[item.category] || ["#F8F9FB", "#EFF2F7"];
    const isFav = favorites.includes(item.id);
    const isCustom = customPictos.some((p) => p.id === item.id);

    return (
      <Animated.View
        style={{
          transform: [{ scale: pressed ? 0.965 : 1 }],
          opacity: pressed ? 0.9 : 1,
          width: cardW,
          height: cardH,
          marginBottom: GAP,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={() => setPressedId(item.id)}
          onPressOut={() => setPressedId(null)}
          onPress={() => openSheet(item)}
          onLongPress={() => {
            if (isCustom) {
              Alert.alert(
                "Supprimer",
                "Retirer ce pictogramme personnalisé ?",
                [
                  { text: "Annuler", style: "cancel" },
                  {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: () => removeCustomPicto(item.id),
                  },
                ]
              );
            }
          }}
          style={[styles.card, { width: cardW, height: cardH }]}
          accessibilityRole="button"
          accessibilityLabel={displayLabel}
        >
          {/* Favori */}
          <Pressable
            onPress={() => toggleFav(item.id)}
            style={styles.favBtn}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={
              isFav ? "Retirer des favoris" : "Ajouter aux favoris"
            }
          >
            <MaterialCommunityIcons
              name={isFav ? "star" : "star-outline"}
              size={22}
              color={isFav ? "#F5A524" : "rgba(0,0,0,0.35)"}
            />
          </Pressable>

          {/* Média */}
          <View style={styles.mediaWrap}>
            <View
              style={[
                styles.mediaBG,
                {
                  backgroundColor: g1,
                  borderColor: g2,
                  width: imgSide,
                  height: imgSide,
                  borderRadius: Math.round(cardW * 0.18),
                },
              ]}
            >
              {item.imageUri ? (
                <Image
                  source={{ uri: item.imageUri }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: Math.round(cardW * 0.18),
                  }}
                  resizeMode="cover"
                />
              ) : (
                <Text style={{ fontSize: emojiSize }}>{item.emoji}</Text>
              )}
            </View>
          </View>

          {/* Libellé */}
          <View
            style={{
              height: labelBlockH,
              justifyContent: "center",
              paddingHorizontal: 8,
            }}
          >
            <Text
              numberOfLines={2}
              style={{
                textAlign: "center",
                color: colors.text,
                fontWeight: "800",
                fontSize: labelFont,
                lineHeight: lineH,
              }}
            >
              {displayLabel}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F6F7FB",
        paddingBottom: insets.bottom,
      }}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={titleStyle}>Pictogrammes</Text>
      </View>

      {/* Recherche + bouton “Nouveau” */}
      <View style={styles.searchRow}>
        <MaterialCommunityIcons name="magnify" size={20} color="#9aa0a6" />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Rechercher un pictogramme…"
          placeholderTextColor="#9aa0a6"
        />
        <Pressable style={styles.newBtn} onPress={openAdd}>
          <MaterialCommunityIcons name="plus" size={20} color="#fff" />
          <Text style={styles.newBtnText}>Nouveau</Text>
        </Pressable>
      </View>

      {/* Grille */}
      <FlatList
        data={allPictos}
        key={numColumns}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PictoCard item={item} />}
        contentContainerStyle={{
          paddingTop: 8,
          paddingBottom: phrase?.length ? 132 : 24,
          paddingHorizontal: H_PADDING,
        }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        style={{ flex: 1 }}
      />

      {/* Fiche picto (bottom sheet) */}
      <Modal
        transparent
        visible={modalVisible}
        onRequestClose={closeSheet}
        animationType="none"
      >
        <Pressable style={styles.backdrop} onPress={closeSheet}>
          <Animated.View
            style={[styles.backdropTint, { opacity: backdropOpacity }]}
          />
        </Pressable>

        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY: sheetTranslate }],
              paddingBottom: Math.max(12, insets.bottom + 8),
            },
          ]}
        >
          <View style={styles.handleBarWrap}>
            <View style={styles.handleBar} />
          </View>

          {selectedPicto && (
            <View style={{ alignItems: "center", width: "100%" }}>
              <View style={styles.sheetMedia}>
                {selectedPicto.imageUri ? (
                  <Image
                    source={{ uri: selectedPicto.imageUri }}
                    style={styles.sheetImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={{ fontSize: 68 }}>{selectedPicto.emoji}</Text>
                )}
              </View>

              <Text style={styles.sheetTitle}>
                {getDisplayLabelForPicto(selectedPicto, langue)}
              </Text>

              <View style={styles.sheetActions}>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: "#2563eb" }]}
                  onPress={() =>
                    tts.speak(
                      getDisplayLabelForPicto(selectedPicto, langue),
                      getTTSLang(langue)
                    )
                  }
                >
                  <MaterialCommunityIcons
                    name="volume-high"
                    size={20}
                    color="#fff"
                  />
                  <Text style={styles.actionText}>Écouter</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: "#10b981" }]}
                  onPress={() => handleAddToPhrase(selectedPicto)}
                >
                  <MaterialCommunityIcons name="plus" size={20} color="#fff" />
                  <Text style={styles.actionText}>Ajouter</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: "#f59e0b" }]}
                  onPress={() => toggleFav(selectedPicto.id)}
                >
                  <MaterialCommunityIcons
                    name={
                      favorites.includes(selectedPicto.id)
                        ? "star"
                        : "star-outline"
                    }
                    size={20}
                    color="#fff"
                  />
                  <Text style={styles.actionText}>Favori</Text>
                </TouchableOpacity>
              </View>

              <Pressable
                onPress={closeSheet}
                style={{ marginTop: 8, padding: 8 }}
              >
                <Text style={{ color: "#6b7280" }}>Fermer</Text>
              </Pressable>
            </View>
          )}
        </Animated.View>
      </Modal>

      {/* Barre phrase */}
      {phrase.length > 0 && (
        <View style={styles.phraseBar}>
          <View style={styles.phraseGlass} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={{ alignItems: "center" }}
          >
            {phrase.map((p, idx) => (
              <View key={idx} style={styles.phraseChip}>
                {p.imageUri ? (
                  <Image
                    source={{ uri: p.imageUri }}
                    style={{ width: 22, height: 22, borderRadius: 6 }}
                  />
                ) : (
                  <Text style={{ fontSize: 20 }}>{p.emoji}</Text>
                )}
                <Text style={styles.phraseText}>{p.label}</Text>
              </View>
            ))}
          </ScrollView>
          <AppButton
            title="Écouter"
            onPress={handleListenPhrase}
            color="primary"
            style={styles.phraseBtn}
          />
          <AppButton
            title="Effacer"
            onPress={handleClearPhrase}
            color="secondary"
            style={styles.phraseBtnSmall}
          />
        </View>
      )}

      {/* MODAL : Nouveau pictogramme */}
      <Modal
        visible={addOpen}
        transparent
        animationType="fade"
        onRequestClose={closeAdd}
      >
        <Pressable style={styles.addBackdrop} onPress={closeAdd}>
          <View
            style={[
              styles.addPanel,
              { paddingBottom: Math.max(12, insets.bottom) },
            ]}
          >
            <Text style={styles.addTitle}>Nouveau pictogramme</Text>

            {/* Libellé */}
            <View style={styles.addRow}>
              <MaterialCommunityIcons
                name="pencil-outline"
                size={18}
                color="#9aa0a6"
              />
              <TextInput
                style={styles.addInput}
                value={addLabel}
                onChangeText={setAddLabel}
                placeholder="Libellé (ex : Je veux du chocolat)"
                placeholderTextColor="#9aa0a6"
              />
            </View>

            {/* Catégories */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 6 }}
            >
              {CATEGORY_OPTIONS.map((c) => {
                const active = addCategory === c.key;
                return (
                  <Pressable
                    key={c.key}
                    onPress={() => setAddCategory(c.key)}
                    style={[styles.catChip, active && styles.catChipActive]}
                  >
                    <Text
                      style={[
                        styles.catChipText,
                        active && styles.catChipTextActive,
                      ]}
                    >
                      {c.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Image + Emoji fallback */}
            <View style={styles.mediaPickRow}>
              <View style={styles.mediaPreview}>
                {addImageUri ? (
                  <Image
                    source={{ uri: addImageUri }}
                    style={{ width: "100%", height: "100%", borderRadius: 12 }}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={{ fontSize: 32 }}>{addEmoji}</Text>
                )}
              </View>

              <View style={{ flex: 1, marginLeft: 10 }}>
                <Pressable style={styles.pickBtn} onPress={pickFromLibrary}>
                  <MaterialCommunityIcons
                    name="image-outline"
                    size={18}
                    color="#2563eb"
                  />
                  <Text style={styles.pickBtnText}>Galerie</Text>
                </Pressable>
                <Pressable style={styles.pickBtn} onPress={captureFromCamera}>
                  <MaterialCommunityIcons
                    name="camera-outline"
                    size={18}
                    color="#2563eb"
                  />
                  <Text style={styles.pickBtnText}>Caméra</Text>
                </Pressable>
                <Pressable
                  style={[styles.pickBtn, { borderColor: "#ef4444" }]}
                  onPress={() => {
                    setAddImageUri(null);
                    setAddEmoji("🔤");
                  }}
                >
                  <MaterialCommunityIcons
                    name="close-circle-outline"
                    size={18}
                    color="#ef4444"
                  />
                  <Text style={[styles.pickBtnText, { color: "#ef4444" }]}>
                    Retirer l’image
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Emoji fallback quand pas d’image */}
            {!addImageUri && (
              <View style={{ alignItems: "center", marginTop: 6 }}>
                <Text style={{ color: "#6b7280", marginBottom: 6 }}>
                  Pas d’image ? Choisis un emoji :
                </Text>
                <View style={styles.quickEmojiRow}>
                  {[
                    "😀",
                    "🍫",
                    "🍔",
                    "🍟",
                    "🍕",
                    "🥤",
                    "🛏️",
                    "📺",
                    "🚪",
                    "🆘",
                  ].map((e) => (
                    <Pressable
                      key={e}
                      style={styles.quickEmoji}
                      onPress={() => setAddEmoji(e)}
                    >
                      <Text style={{ fontSize: 22 }}>{e}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* Actions */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 12,
              }}
            >
              <Pressable style={styles.cancelBtn} onPress={closeAdd}>
                <Text style={styles.cancelText}>Annuler</Text>
              </Pressable>
              <Pressable style={styles.saveBtn} onPress={addPictoWithImage}>
                <MaterialCommunityIcons
                  name="content-save"
                  size={18}
                  color="#fff"
                />
                <Text style={styles.saveText}>Enregistrer</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

PictogrammesScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({ category: PropTypes.string }),
  }),
};

/* ===================== Styles ===================== */
const styles = StyleSheet.create({
  header: { paddingTop: 6, paddingBottom: 4, alignItems: "center" },
  title: {
    fontSize: typography.fontSizeLarge,
    fontWeight: "800",
    textAlign: "center",
    color: colors.text,
    letterSpacing: 0.3,
  },

  /* Recherche + nouveau */
  searchRow: {
    marginTop: 6,
    marginHorizontal: 14,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    paddingVertical: 2,
  },
  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  newBtnText: { color: "#fff", fontWeight: "800" },

  /* Carte */
  card: {
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  favBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 2,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  mediaWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 14,
  },
  mediaBG: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  /* Bottom sheet */
  backdrop: { ...StyleSheet.absoluteFillObject },
  backdropTint: { flex: 1, backgroundColor: "#000" },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -8 },
    elevation: 12,
  },
  handleBarWrap: { width: "100%", alignItems: "center", paddingVertical: 6 },
  handleBar: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(0,0,0,0.12)",
  },
  sheetMedia: {
    width: 128,
    height: 128,
    borderRadius: 28,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginTop: 6,
  },
  sheetImage: { width: "100%", height: "100%" },
  sheetTitle: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 20,
    color: colors.primary,
    fontWeight: "800",
  },
  sheetActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    width: "100%",
    justifyContent: "center",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  actionText: { color: "#fff", fontWeight: "800" },

  /* Barre de phrase */
  phraseBar: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    padding: 10,
    borderRadius: 16,
    overflow: "hidden",
  },
  phraseGlass: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  phraseChip: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  phraseText: { marginLeft: 6, color: colors.text, fontWeight: "800" },
  phraseBtn: {
    marginLeft: 8,
    minWidth: 110,
    borderRadius: 10,
    paddingVertical: 10,
  },
  phraseBtnSmall: {
    marginLeft: 6,
    minWidth: 88,
    borderRadius: 10,
    paddingVertical: 10,
  },

  /* Ajout pictogramme (modal) */
  addBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    padding: 16,
    justifyContent: "flex-end",
  },
  addPanel: {
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    padding: 14,
  },
  addTitle: {
    fontWeight: "800",
    color: colors.text,
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
  },
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: "100%",
    marginBottom: 8,
  },
  addInput: { flex: 1, color: colors.text, fontSize: 14, paddingVertical: 0 },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.12)",
    marginRight: 8,
    marginVertical: 2,
  },
  catChipActive: { backgroundColor: "#EAF2FF", borderColor: "#2563eb" },
  catChipText: { color: "#334155", fontWeight: "700" },
  catChipTextActive: { color: "#2563eb" },

  mediaPickRow: { flexDirection: "row", marginTop: 8, alignItems: "center" },
  mediaPreview: {
    width: 92,
    height: 92,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  pickBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#2563eb",
    borderRadius: 10,
    marginBottom: 8,
  },
  pickBtnText: { color: "#2563eb", fontWeight: "800" },

  quickEmojiRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  quickEmoji: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
    marginHorizontal: 4,
    marginVertical: 4,
  },

  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
  },
  cancelText: { color: "#334155", fontWeight: "800" },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#2563eb",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  saveText: { color: "#fff", fontWeight: "800" },
});
