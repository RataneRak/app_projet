// i18n.js
import * as Localization from "expo-localization";
import i18n from "i18n-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const LANG_KEY = "@lang";

/* Traduction */

export const translations = {
  fr: {
    eat: "Manger",
    drink: "Boire",
    toilet: "Toilettes",
    help: "Aide",
    home: "Accueil",
    customMessages: "Messages personnalisés",
    addMessage: "+ Message",
    history: "Historique",
    settings: "Paramètres",
    language: "Langue de l'application",
    french: "Français",
    english: "English",
    arabic: "العربية",
    spanish: "Español",
    malagasy: "Malagasy",
    add: "Ajouter",
    delete: "Supprimer",
    noCustom: "Aucun message personnalisé",
    noHistory: "Aucun message utilisé",
    clear: "Effacer",
    confirmClear: "Effacer tout l'historique ?",
    cancel: "Annuler",
    yes: "Oui",
    pickImage: "Choisir une image",
    imageSelected: "Image sélectionnée",
    selectedImage: "Image sélectionnée",
    speak: "Parler",
    sos: "SOS",
    favorites: "Favoris",
    keyboard: "Clavier",
    pictograms: "Pictogrammes",
    settingsTitle: "Paramètres",
    appearance: "Apparence",
    themeLight: "Clair",
    themeDark: "Sombre",
    accessibility: "Accessibilité",
    largeText: "Texte grand",
    highContrast: "Contraste élevé",
    childMode: "Mode enfant",
    specialMode: "Mode spécialisé",
    resetSettings: "Réinitialiser les paramètres",
    testVoices: "Test des voix",
    customMessagesLong: "Messages personnalisés",
  },
  en: {
    eat: "Eat",
    drink: "Drink",
    toilet: "Toilet",
    help: "Help",
    home: "Home",
    customMessages: "Custom Messages",
    addMessage: "+ Message",
    history: "History",
    settings: "Settings",
    language: "App language",
    french: "Français",
    english: "English",
    arabic: "العربية",
    spanish: "Español",
    malagasy: "Malagasy",
    add: "Add",
    delete: "Delete",
    noCustom: "No custom message",
    noHistory: "No message used",
    clear: "Clear",
    confirmClear: "Clear all history?",
    cancel: "Cancel",
    yes: "Yes",
    pickImage: "Pick an image",
    imageSelected: "Image selected",
    selectedImage: "Selected image",
    speak: "Speak",
    sos: "SOS",
    favorites: "Favorites",
    keyboard: "Keyboard",
    pictograms: "Pictograms",
    settingsTitle: "Settings",
    appearance: "Appearance",
    themeLight: "Light",
    themeDark: "Dark",
    accessibility: "Accessibility",
    largeText: "Large text",
    highContrast: "High contrast",
    childMode: "Child mode",
    specialMode: "Specialized mode",
    resetSettings: "Reset settings",
    testVoices: "Test voices",
    customMessagesLong: "Custom messages",
  },
  ar: {
    eat: "يأكل",
    drink: "يشرب",
    toilet: "مرحاض",
    help: "مساعدة",
    home: "الرئيسية",
    customMessages: "رسائل مخصصة",
    addMessage: "+ رسالة",
    history: "السجل",
    settings: "الإعدادات",
    language: "لغة التطبيق",
    french: "فرنسي",
    english: "إنجليزي",
    arabic: "العربية",
    spanish: "الإسبانية",
    add: "إضافة",
    delete: "حذف",
    noCustom: "لا توجد رسائل مخصصة",
    noHistory: "لا يوجد سجل",
    clear: "مسح",
    confirmClear: "مسح كل السجل؟",
    cancel: "إلغاء",
    yes: "نعم",
    pickImage: "اختر صورة",
    imageSelected: "تم اختيار صورة",
    selectedImage: "الصورة المختارة",
  },
  es: {
    eat: "Comer",
    drink: "Beber",
    toilet: "Baño",
    help: "Ayuda",
    home: "Inicio",
    customMessages: "Mensajes personalizados",
    addMessage: "+ Mensaje",
    history: "Historial",
    settings: "Configuración",
    language: "Idioma de la aplicación",
    french: "Francés",
    english: "Inglés",
    arabic: "Árabe",
    spanish: "Español",
    add: "Agregar",
    delete: "Eliminar",
    noCustom: "Ningún mensaje personalizado",
    noHistory: "Ningún mensaje usado",
    clear: "Borrar",
    confirmClear: "¿Borrar todo el historial?",
    cancel: "Cancelar",
    yes: "Sí",
    pickImage: "Elegir una imagen",
    imageSelected: "Imagen seleccionada",
    selectedImage: "Imagen seleccionada",
  },
  de: {
    eat: "Essen",
    drink: "Trinken",
    toilet: "Toilette",
    help: "Hilfe",
    home: "Startseite",
    customMessages: "Benutzerdefinierte Nachrichten",
    addMessage: "+ Nachricht",
    history: "Verlauf",
    settings: "Einstellungen",
    language: "App-Sprache",
    french: "Französisch",
    english: "Englisch",
    arabic: "Arabisch",
    spanish: "Spanisch",
    german: "Deutsch",
    italian: "Italienisch",
    portuguese: "Portugiesisch",
    chinese: "Chinois",
    russian: "Russisch",
    turkish: "Türkisch",
    add: "Hinzufügen",
    delete: "Löschen",
    noCustom: "Keine benutzerdefinierte Nachricht",
    noHistory: "Keine verwendete Nachricht",
    clear: "Löschen",
    confirmClear: "Gesamten Verlauf löschen?",
    cancel: "Abbrechen",
    yes: "Ja",
    pickImage: "Bild auswählen",
    imageSelected: "Bild ausgewählt",
    selectedImage: "Ausgewähltes Bild",
  },
  it: {
    eat: "Mangiare",
    drink: "Bere",
    toilet: "Bagno",
    help: "Aiuto",
    home: "Home",
    customMessages: "Messaggi personalizzati",
    addMessage: "+ Messaggio",
    history: "Cronologia",
    settings: "Impostazioni",
    language: "Lingua dell'app",
    french: "Francese",
    english: "Inglese",
    arabic: "Arabo",
    spanish: "Spagnolo",
    german: "Tedesco",
    italian: "Italiano",
    portuguese: "Portoghese",
    chinese: "Cinese",
    russian: "Russo",
    turkish: "Turco",
    add: "Aggiungi",
    delete: "Elimina",
    noCustom: "Nessun messaggio personalizzato",
    noHistory: "Nessun messaggio usato",
    clear: "Cancella",
    confirmClear: "Cancellare tutta la cronologia?",
    cancel: "Annulla",
    yes: "Sì",
    pickImage: "Scegli un'immagine",
    imageSelected: "Immagine selezionata",
    selectedImage: "Immagine selezionata",
  },
  pt: {
    eat: "Comer",
    drink: "Beber",
    toilet: "Banheiro",
    help: "Ajuda",
    home: "Início",
    customMessages: "Mensagens personalizadas",
    addMessage: "+ Mensagem",
    history: "Histórico",
    settings: "Configurações",
    language: "Idioma do aplicativo",
    french: "Francês",
    english: "Inglês",
    arabic: "Árabe",
    spanish: "Espanhol",
    german: "Alemão",
    italian: "Italiano",
    portuguese: "Português",
    chinese: "Chinês",
    russian: "Russo",
    turkish: "Turco",
    add: "Adicionar",
    delete: "Excluir",
    noCustom: "Nenhuma mensagem personalizada",
    noHistory: "Nenhuma mensagem usada",
    clear: "Limpar",
    confirmClear: "Limpar todo o histórico?",
    cancel: "Cancelar",
    yes: "Sim",
    pickImage: "Escolher uma imagem",
    imageSelected: "Imagem selecionada",
    selectedImage: "Imagem selecionada",
  },
  zh: {
    eat: "吃",
    drink: "喝",
    toilet: "厕所",
    help: "帮助",
    home: "首页",
    customMessages: "自定义消息",
    addMessage: "+ 消息",
    history: "历史",
    settings: "设置",
    language: "应用语言",
    french: "法语",
    english: "英语",
    arabic: "阿拉伯语",
    spanish: "西班牙语",
    german: "德语",
    italian: "意大利语",
    portuguese: "葡萄牙语",
    chinese: "中文",
    russian: "俄语",
    turkish: "土耳其语",
    add: "添加",
    delete: "删除",
    noCustom: "没有自定义消息",
    noHistory: "没有使用的消息",
    clear: "清除",
    confirmClear: "清除所有历史记录？",
    cancel: "取消",
    yes: "是",
    pickImage: "选择图片",
    imageSelected: "已选择图片",
    selectedImage: "已选择的图片",
  },
  ru: {
    eat: "Есть",
    drink: "Пить",
    toilet: "Туалет",
    help: "Помощь",
    home: "Главная",
    customMessages: "Пользовательские сообщения",
    addMessage: "+ Сообщение",
    history: "История",
    settings: "Настройки",
    language: "Язык приложения",
    french: "Французский",
    english: "Английский",
    arabic: "Арабский",
    spanish: "Испанский",
    german: "Немецкий",
    italian: "Итальянский",
    portuguese: "Португальский",
    chinese: "Китайский",
    russian: "Русский",
    turkish: "Турецкий",
    add: "Добавить",
    delete: "Удалить",
    noCustom: "Нет пользовательских сообщений",
    noHistory: "Нет использованных сообщений",
    clear: "Очистить",
    confirmClear: "Очистить всю историю?",
    cancel: "Отмена",
    yes: "Да",
    downloadVoice: "Загрузите голос в настройках телефона.",
  },
  tr: {
    eat: "Yemek",
    drink: "İçmek",
    toilet: "Tuvalet",
    help: "Yardım",
    home: "Ana Sayfa",
    customMessages: "Özel Mesajlar",
    addMessage: "+ Mesaj",
    history: "Geçmiş",
    settings: "Ayarlar",
    language: "Uygulama Dili",
    french: "Fransızca",
    english: "İngilizce",
    arabic: "Arapça",
    spanish: "İspanyolca",
    malagasy: "Malagasy",
    german: "Almanca",
    italian: "İtalyanca",
    portuguese: "Portekizce",
    chinese: "Çince",
    russian: "Rusça",
    turkish: "Türkçe",
    add: "Ekle",
    delete: "Sil",
    noCustom: "Özel mesaj yok",
    noHistory: "Kullanılan mesaj yok",
    clear: "Temizle",
    confirmClear: "Tüm geçmişi temizle?",
    cancel: "İptal",
    yes: "Evet",
    downloadVoice: "Telefon ayarlarından sesi indirin.",
  },
  mg: {
    eat: "Mihinana",
    drink: "Misotro",
    toilet: "Kabone",
    help: "Fanampiana",
    home: "Fandraisana",
    customMessages: "Hafatra manokana",
    addMessage: "+ Hafatra",
    history: "Tantara",
    settings: "Safidy",
    language: "Fiteny amin'ny app",
    french: "Frantsay",
    english: "Anglisy",
    arabic: "Arabo",
    spanish: "Espaniola",
    malagasy: "Malagasy",
    add: "Ampidiro",
    delete: "Fafao",
    noCustom: "Tsy misy hafatra manokana",
    noHistory: "Tsy misy hafatra nampiasaina",
    clear: "Fafao",
    confirmClear: "Fafao ny tantara rehetra?",
    cancel: "Aoka ihany",
    yes: "Eny",
    pickImage: "Mifidy sary",
    imageSelected: "Voafidy ny sary",
    selectedImage: "Sary voafidy",
    downloadVoice: "Ampidiro ny feo ao amin'ny safidy ny téléphone.",
  },
};

i18n.translations = translations;

/* Normalisation et Config */
// ⚠️ On désactive les fallbacks implicites (sinon i18n saute vers une autre langue)
i18n.fallbacks = false;

/** Normalise n'importe quelle locale en {fr|en|mg|ar|es}, sinon "en" par défaut */
export const normalizeLocale = (raw) => {
  const s = String(raw || "").toLowerCase();
  if (s.startsWith("fr")) return "fr";
  if (s.startsWith("mg")) return "mg";
  if (s.startsWith("ar")) return "ar";
  if (s.startsWith("es")) return "es";
  if (s.startsWith("en")) return "en";
  // langues non prises en charge → EN (ou FR si tu préfères)
  return "en";
};

/** Meilleure détection par défaut (compat Expo v14+ et anciennes versions) */
const detectDeviceLang = () => {
  try {
    // Expo 49+: Localization.getLocales()
    const locales =
      (Localization.getLocales && Localization.getLocales()) || [];
    if (locales.length > 0) {
      const { languageCode = "", regionCode = "" } = locales[0] || {};
      const tag = [languageCode, regionCode].filter(Boolean).join("-");
      return normalizeLocale(tag || languageCode);
    }
  } catch {}
  // Ancienne API
  if (Localization.locale) return normalizeLocale(Localization.locale);
  if (Localization.locales && Localization.locales[0])
    return normalizeLocale(Localization.locales[0]);
  return "en";
};

export const getDefaultLang = () => detectDeviceLang();

/** Langue persistée (ou défaut) — toujours normalisée */
export const getLang = async () => {
  const stored = await AsyncStorage.getItem(LANG_KEY);
  return normalizeLocale(stored || getDefaultLang());
};

/** Applique la langue dans i18n (toujours normalisée) */
export const setI18nConfig = (lang) => {
  const normalized = normalizeLocale(lang);
  i18n.locale = normalized;
};

/** Helper pratique : set + persist + applique tout de suite */
export const setAndPersistLang = async (lang) => {
  const normalized = normalizeLocale(lang);
  await AsyncStorage.setItem(LANG_KEY, normalized);
  i18n.locale = normalized;
  return normalized;
};

/* Mapping TTS */

/** Codes TTS préférés; mg n'est pas garanti côté OS → on tente FR en fallback */
export const ttsLangMap = {
  fr: "fr-FR",
  en: "en-US",
  ar: "ar-SA",
  es: "es-ES",
  mg: "mg", // certains OS ne l'ont pas; expo-speech fera un fallback si absent
};

export function getTTSLang(langue) {
  const n = normalizeLocale(langue); // fr | en | mg | ...
  const map = { fr: "fr-FR", en: "en-US", ar: "ar-SA", es: "es-ES", mg: "mg" };
  return map[n] || "en-US";
}

export default i18n;
