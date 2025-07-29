import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  SafeAreaView,
} from "react-native";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsContext } from "../App";
import { LinearGradient } from "expo-linear-gradient";
import { Animated } from "react-native";
import colors from "../theme/colors";
import typography from "../theme/typography";
import AppButton from "../components/AppButton";

const BASE_PICTOS = [
  // Nourriture
  { id: "1", label: "J’ai faim", emoji: "🍽️", category: "nourriture" },
  { id: "9", label: "Je veux une pomme", emoji: "🍏", category: "nourriture" },
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
  { id: "14", label: "Je veux une soupe", emoji: "🥣", category: "nourriture" },
  { id: "38", label: "Je veux du poulet", emoji: "🍗", category: "nourriture" },
  { id: "39", label: "Je veux des pâtes", emoji: "🍝", category: "nourriture" },
  { id: "40", label: "Je veux un gâteau", emoji: "🍰", category: "nourriture" },
  // Boisson
  { id: "2", label: "J’ai soif", emoji: "🥤", category: "boisson" },
  { id: "15", label: "Je veux de l’eau", emoji: "💧", category: "boisson" },
  { id: "16", label: "Je veux du jus", emoji: "🧃", category: "boisson" },
  { id: "17", label: "Je veux du lait", emoji: "🥛", category: "boisson" },
  { id: "18", label: "Je veux du thé", emoji: "🍵", category: "boisson" },
  { id: "41", label: "Je veux du café", emoji: "☕", category: "boisson" },
  { id: "42", label: "Je veux un soda", emoji: "🥤", category: "boisson" },
  // Besoins
  { id: "3", label: "Toilettes", emoji: "🚻", category: "besoins" },
  { id: "4", label: "Aide", emoji: "🆘", category: "besoins" },
  { id: "19", label: "Je suis fatigué(e)", emoji: "😴", category: "besoins" },
  { id: "20", label: "J’ai froid", emoji: "🥶", category: "besoins" },
  { id: "21", label: "J’ai chaud", emoji: "🥵", category: "besoins" },
  {
    id: "43",
    label: "J’ai besoin d’un câlin",
    emoji: "🤗",
    category: "besoins",
  },
  { id: "44", label: "J’ai besoin de repos", emoji: "🛌", category: "besoins" },
  // Maison
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
  // Emotions
  { id: "7", label: "J’ai mal", emoji: "🤕", category: "emotions" },
  { id: "8", label: "Merci", emoji: "🙏", category: "emotions" },
  { id: "25", label: "Je suis content(e)", emoji: "😃", category: "emotions" },
  { id: "26", label: "Je suis triste", emoji: "😢", category: "emotions" },
  { id: "27", label: "J’ai peur", emoji: "😨", category: "emotions" },
  { id: "28", label: "Je suis en colère", emoji: "😡", category: "emotions" },
  { id: "47", label: "Je suis surpris(e)", emoji: "😲", category: "emotions" },
  { id: "48", label: "Je suis calme", emoji: "😌", category: "emotions" },
  // Activités
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
  // Appeler
  { id: "33", label: "Appeler maman", emoji: "👩", category: "appeler" },
  { id: "34", label: "Appeler papa", emoji: "👨", category: "appeler" },
  {
    id: "35",
    label: "Appeler l’enseignant(e)",
    emoji: "🧑‍🏫",
    category: "appeler",
  },
  { id: "51", label: "Appeler un ami", emoji: "🧑‍🤝‍🧑", category: "appeler" },
  // Autre
  { id: "5", label: "Oui", emoji: "👍", category: "autre" },
  { id: "6", label: "Non", emoji: "👎", category: "autre" },
  { id: "36", label: "Je ne sais pas", emoji: "🤷", category: "autre" },
  {
    id: "37",
    label: "Répéter, s’il vous plaît",
    emoji: "🔁",
    category: "autre",
  },
  { id: "52", label: "C’est urgent", emoji: "🚨", category: "autre" },
];

const STORAGE_KEY = "@history";

export default function PictogrammesScreen({ route, navigation }) {
  const [customPictos, setCustomPictos] = useState([]);
  const [input, setInput] = useState("");
  const category = route?.params?.category;
  const { texteGrand, contraste, modeEnfant } = useContext(SettingsContext);

  let allPictos = modeEnfant ? BASE_PICTOS : [...BASE_PICTOS, ...customPictos];
  // Activer le filtrage par catégorie pour afficher uniquement les pictogrammes adaptés
  if (category) allPictos = allPictos.filter((p) => p.category === category);

  const speakAndSave = async (text) => {
    Speech.speak(text, { language: "fr-FR" });
    // Ajout à l'historique persistant
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      let history = stored ? JSON.parse(stored) : [];
      const newItem = { text, date: new Date().toISOString() };
      history = [newItem, ...history].slice(0, 50);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {}
  };

  const addPicto = () => {
    if (!input.trim()) return;
    setCustomPictos([
      ...customPictos,
      {
        id: Date.now().toString(),
        label: input.trim(),
        emoji: "🔤",
        category: "autre",
      },
    ]);
    setInput("");
  };

  const screenWidth = Dimensions.get("window").width;
  const numColumns = screenWidth > 600 ? 3 : 2;
  const pictoSize = screenWidth > 600 ? 160 : screenWidth > 400 ? 130 : 110;
  const pictoMargin = screenWidth > 600 ? 18 : 10;
  const fontSizeLabel = screenWidth > 600 ? 28 : screenWidth > 400 ? 20 : 16;
  const fontSizeEmoji = screenWidth > 600 ? 90 : screenWidth > 400 ? 60 : 40;

  const containerStyle = [
    styles.container,
    contraste && { backgroundColor: colors.contrastBackground },
  ];
  const titleStyle = [
    styles.title,
    texteGrand && { fontSize: typography.fontSizeXL },
    contraste && { color: colors.contrastText },
  ];
  const gridStyle = [
    styles.grid,
    {
      flexWrap: "wrap",
      justifyContent: "center",
      width: "100%",
      paddingBottom: phrase && phrase.length > 0 ? 90 : 24,
    },
  ];
  const pictoStyle = [
    styles.picto,
    {
      minWidth: pictoSize,
      minHeight: pictoSize,
      margin: pictoMargin,
      borderRadius: pictoSize / 4.5,
      elevation: 5,
      backgroundColor: colors.surface,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 12,
      borderWidth: 2,
      borderColor: colors.border,
    },
    contraste && {
      backgroundColor: colors.contrastBackground,
      borderColor: colors.contrastText,
      borderWidth: 2,
    },
  ];
  const labelStyle = [
    styles.label,
    {
      fontSize: fontSizeLabel,
      textAlign: "center",
      flexWrap: "wrap",
      marginTop: 10,
      color: colors.primary,
      fontWeight: typography.fontWeightBold,
      letterSpacing: 1,
      fontFamily: typography.fontFamily,
    },
    contraste && { color: colors.contrastText },
  ];
  const emojiStyle = [
    styles.emoji,
    { fontSize: fontSizeEmoji, textAlign: "center", marginBottom: 6 },
  ];
  const inputStyle = [
    styles.input,
    contraste && {
      backgroundColor: colors.contrastBackground,
      color: colors.contrastText,
      borderColor: colors.contrastText,
    },
  ];

  // Animation d'appui sur les pictogrammes
  const [pressedId, setPressedId] = useState(null);
  const [selectedPicto, setSelectedPicto] = useState(null);
  const [phrase, setPhrase] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handlePictoPress = (picto) => {
    setSelectedPicto(picto);
    setModalVisible(true);
  };
  const handleAddToPhrase = (picto) => {
    setPhrase([...phrase, picto]);
    setModalVisible(false);
  };
  const handleListenPhrase = () => {
    if (phrase && phrase.length > 0) {
      const text = phrase.map((p) => p.label).join(" ");
      Speech.speak(text, { language: "fr-FR" });
    }
  };
  const handleClearPhrase = () => setPhrase([]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={[colors.background, colors.surface, "#fbefff"]}
        style={styles.gradientBg}
      >
        <Text style={titleStyle}>
          <Text style={{ color: colors.primary, letterSpacing: 2 }}>
            Tableau de pictogrammes
          </Text>
        </Text>
        <FlatList
          data={allPictos}
          numColumns={numColumns}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Animated.View
              style={{
                transform: [{ scale: pressedId === item.id ? 0.96 : 1 }],
                opacity: pressedId === item.id ? 0.7 : 1,
              }}
            >
              <TouchableOpacity
                style={pictoStyle}
                onPressIn={() => setPressedId(item.id)}
                onPressOut={() => setPressedId(null)}
                onPress={() => handlePictoPress(item)}
                accessibilityLabel={item.label}
                activeOpacity={0.8}
              >
                <Text style={emojiStyle}>{item.emoji}</Text>
                <Text style={labelStyle}>{item.label}</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
          contentContainerStyle={gridStyle}
          style={{ marginBottom: phrase && phrase.length > 0 ? 90 : 0 }}
        />
        {/* Modal fiche pictogramme */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
          >
            <View
              style={{
                backgroundColor: colors.surface,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                padding: 24,
                alignItems: "center",
                minHeight: 260,
              }}
            >
              {selectedPicto && (
                <>
                  <Text
                    style={[
                      emojiStyle,
                      { fontSize: fontSizeEmoji * 1.3, marginBottom: 12 },
                    ]}
                  >
                    {selectedPicto.emoji}
                  </Text>
                  <Text
                    style={[
                      labelStyle,
                      {
                        fontSize: fontSizeLabel * 1.1,
                        color: colors.primary,
                        marginBottom: 18,
                      },
                    ]}
                  >
                    {selectedPicto.label}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      marginBottom: 10,
                    }}
                  >
                    <AppButton
                      title="Écouter"
                      onPress={() =>
                        Speech.speak(selectedPicto.label, { language: "fr-FR" })
                      }
                      color="primary"
                      style={{
                        marginHorizontal: 8,
                        minWidth: 110,
                        paddingVertical: 10,
                        borderRadius: 8,
                      }}
                      accessibilityLabel="Écouter le pictogramme"
                    />
                    <AppButton
                      title="Ajouter à la phrase"
                      onPress={() => handleAddToPhrase(selectedPicto)}
                      color="secondary"
                      style={{
                        marginHorizontal: 8,
                        minWidth: 110,
                        paddingVertical: 10,
                        borderRadius: 8,
                      }}
                      accessibilityLabel="Ajouter à la phrase"
                    />
                  </View>
                  <Pressable
                    onPress={() => setModalVisible(false)}
                    style={{ marginTop: 8, padding: 8 }}
                  >
                    <Text style={{ color: colors.text, fontSize: 16 }}>
                      Fermer
                    </Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        </Modal>
        {/* Barre de phrase en bas */}
        {phrase && phrase.length > 0 && (
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: colors.background,
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              padding: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              elevation: 8,
              shadowColor: colors.primary,
              shadowOpacity: 0.12,
              shadowRadius: 8,
            }}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ flex: 1 }}
              contentContainerStyle={{ alignItems: "center" }}
            >
              {phrase.map((p, idx) => (
                <View
                  key={idx}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 8,
                  }}
                >
                  <Text style={{ fontSize: fontSizeEmoji * 0.7 }}>
                    {p.emoji}
                  </Text>
                  <Text
                    style={{
                      fontSize: fontSizeLabel * 0.8,
                      color: colors.primary,
                      marginLeft: 2,
                    }}
                  >
                    {p.label}
                  </Text>
                </View>
              ))}
            </ScrollView>
            <AppButton
              title="Écouter la phrase"
              onPress={handleListenPhrase}
              color="primary"
              style={{
                marginLeft: 8,
                minWidth: 110,
                paddingVertical: 10,
                borderRadius: 8,
              }}
              accessibilityLabel="Écouter la phrase"
            />
            <AppButton
              title="Effacer"
              onPress={handleClearPhrase}
              color="secondary"
              style={{
                marginLeft: 8,
                minWidth: 90,
                paddingVertical: 10,
                borderRadius: 8,
              }}
              accessibilityLabel="Effacer la phrase"
            />
          </View>
        )}
        {!modeEnfant && (
          <View
            style={{ alignItems: "center", width: "100%", paddingBottom: 12 }}
          >
            <TextInput
              style={inputStyle}
              value={input}
              onChangeText={setInput}
              placeholder="Ajouter un pictogramme..."
              placeholderTextColor={colors.text}
            />
            <AppButton
              title="Ajouter"
              onPress={addPicto}
              color="primary"
              style={{ marginTop: 8, minWidth: 120, borderRadius: 8 }}
              accessibilityLabel="Ajouter un pictogramme personnalisé"
            />
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
    padding: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: typography.fontSizeLarge,
    fontWeight: typography.fontWeightBold,
    marginBottom: 18,
    textAlign: "center",
    color: colors.primary,
    letterSpacing: 2,
    textShadowColor: "#e3f0ff",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    fontFamily: typography.fontFamily,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 28,
  },
  picto: {
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
    minHeight: 120,
    margin: 8,
    borderRadius: 20,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  label: {
    fontSize: typography.fontSizeRegular,
    marginTop: 8,
    textAlign: "center",
    flexWrap: "wrap",
    fontFamily: typography.fontFamily,
  },
  emoji: {
    fontSize: 48,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 8,
    marginVertical: 12,
    width: 220,
    backgroundColor: colors.surface,
    fontSize: typography.fontSizeRegular,
    color: colors.text,
    fontFamily: typography.fontFamily,
  },
});
