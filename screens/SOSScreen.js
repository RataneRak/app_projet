import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Speech from "expo-speech";
import { SettingsContext } from "../App";

const SOS_MESSAGE = "J’ai besoin d’aide immédiatement !";

export default function SOSScreen() {
  const { texteGrand, contraste } = useContext(SettingsContext);
  const containerStyle = [
    styles.container,
    contraste && { backgroundColor: "#000" },
  ];
  const titleStyle = [
    styles.title,
    texteGrand && { fontSize: 40 },
    contraste && { color: "#FFD600" },
  ];
  const btnStyle = [styles.btn, contraste && { backgroundColor: "#FFD600" }];
  const btnTextStyle = [
    styles.btnText,
    texteGrand && { fontSize: 32 },
    contraste && { color: "#000" },
  ];
  const messageStyle = [
    styles.message,
    texteGrand && { fontSize: 32 },
    contraste && { color: "#FFD600" },
  ];

  const speak = () => {
    Speech.speak(SOS_MESSAGE, { language: "fr-FR" });
  };

  return (
    <View style={containerStyle}>
      <Text style={titleStyle}>🚨 SOS</Text>
      <Text style={messageStyle}>{SOS_MESSAGE}</Text>
      <TouchableOpacity style={btnStyle} onPress={speak}>
        <Text style={btnTextStyle}>🔊 Lire le message</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d32f2f",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 32,
    fontFamily: "Roboto",
  },
  message: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 32,
    fontFamily: "Roboto",
  },
  btn: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 32,
    marginTop: 16,
  },
  btnText: {
    color: "#d32f2f",
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
    fontFamily: "Roboto",
  },
});
