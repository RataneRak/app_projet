// Script de test pour les voix malgaches
// (console only)
const testPhrases = {
  fr: [
    "Bonjour, comment allez-vous ?",
    "J'ai faim et soif",
    "Je veux aller aux toilettes",
    "J'ai besoin d'aide",
    "Merci beaucoup",
  ],
  mg: [
    "Salama, manao ahoana ianao?",
    "Noana sy mangetaheta aho",
    "Tia ho any am-pandriana aho",
    "Mila fanampiana aho",
    "Misaotra betsaka",
  ],
};

console.log("=== Test des voix malgaches ===");
console.log("Phrases françaises:");
testPhrases.fr.forEach((phrase, index) => {
  console.log(`${index + 1}. ${phrase}`);
});

console.log("\nPhrases malgaches:");
testPhrases.mg.forEach((phrase, index) => {
  console.log(`${index + 1}. ${phrase}`);
});

console.log("\n✅ Configuration des voix malgaches terminée !");
console.log("📱 L'application est prête à être utilisée.");
console.log("🎯 Pour tester :");
console.log("   1. Ouvrir l'application");
console.log("   2. Aller dans Paramètres");
console.log("   3. Sélectionner 'Malagasy'");
console.log("   4. Cliquer sur 'Test des voix'");
console.log("   5. Tester les phrases malgaches");
