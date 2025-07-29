import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { SettingsContext } from "../App";

export default function ParametresScreen() {
  const {
    theme,
    setTheme,
    langue,
    setLangue,
    texteGrand,
    setTexteGrand,
    modeEnfant,
    setModeEnfant,
    contraste,
    setContraste,
  } = useContext(SettingsContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paramètres</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Thème :</Text>
        <TouchableOpacity
          style={[styles.btn, theme === "clair" && styles.selected]}
          onPress={() => setTheme("clair")}
        >
          <Text>Clair</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, theme === "sombre" && styles.selected]}
          onPress={() => setTheme("sombre")}
        >
          <Text>Sombre</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Langue :</Text>
        <TouchableOpacity
          style={[styles.btn, langue === "fr" && styles.selected]}
          onPress={() => setLangue("fr")}
        >
          <Text>Français</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, langue === "en" && styles.selected]}
          onPress={() => setLangue("en")}
        >
          <Text>English</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Texte grand :</Text>
        <Switch value={texteGrand} onValueChange={setTexteGrand} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Contraste élevé :</Text>
        <Switch value={contraste} onValueChange={setContraste} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Mode enfant :</Text>
        <Switch value={modeEnfant} onValueChange={setModeEnfant} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 16,
    alignSelf: "center",
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  label: { fontSize: 18, flex: 1 },
  btn: {
    backgroundColor: "#eee",
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 4,
  },
  selected: { backgroundColor: "#1976d2", color: "#fff" },
});
