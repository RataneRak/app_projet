# Voix Malgaches - Guide d'utilisation

## Vue d'ensemble

Cette application de communication alternative a été étendue pour supporter les voix malgaches. Le système utilise la synthèse vocale pour aider les utilisateurs malgaches à communiquer plus efficacement.

## Fonctionnalités ajoutées

### 1. Support multilingue
- **Français** : Voix française native
- **Malgache** : Voix malgache avec fallback sur l'anglais
- **Anglais** : Voix anglaise native
- **Arabe** : Voix arabe native
- **Espagnol** : Voix espagnole native

### 2. Pictogrammes malgaches
Les pictogrammes s'adaptent automatiquement à la langue sélectionnée :

#### Catégories en malgache :
- **Sakafo** (Nourriture) : "Noana aho", "Tia ihinana paoma aho", etc.
- **Rano** (Boisson) : "Mangetaheta aho", "Tia isotro rano aho", etc.
- **Ilaina** (Besoins) : "Kabone", "Fanampiana", etc.
- **Trano** (Maison) : "Tia ho any am-piandrasana aho", etc.
- **Fahatsapana** (Émotions) : "Faly aho", "Malahelo aho", etc.
- **Asa** (Activités) : "Tia milalao aho", "Tia mandoko sary aho", etc.
- **Antso** (Appeler) : "Antsoy i Neny", "Antsoy i Dada", etc.

### 3. Service de synthèse vocale
Le `VoiceService` gère :
- Configuration des voix par langue
- Gestion des erreurs et fallbacks
- Contrôle de la vitesse et du pitch
- Vérification de la disponibilité des voix

## Comment utiliser

### 1. Changer de langue
1. Aller dans **Paramètres**
2. Sélectionner **Malagasy** dans la section Langue
3. Les pictogrammes et la synthèse vocale s'adaptent automatiquement

### 2. Tester les voix
1. Aller dans **Paramètres**
2. Cliquer sur **Test des voix**
3. Tester les phrases prédéfinies ou entrer du texte personnalisé

### 3. Utiliser les pictogrammes malgaches
1. Sélectionner la langue malgache
2. Les pictogrammes affichent maintenant le texte en malgache
3. Cliquer sur un pictogramme pour entendre la prononciation

## Configuration technique

### Voix malgache
```javascript
mg: {
  language: "mg-MG",
  pitch: 1.0,
  rate: 0.7, // Plus lent pour le malgache
  voice: "com.apple.ttsbundle.siri_female_en-US_compact" // Fallback
}
```

### Fallback automatique
Si la voix malgache n'est pas disponible sur l'appareil :
1. L'application utilise la voix anglaise
2. Un message d'alerte informe l'utilisateur
3. La vitesse est ajustée pour une meilleure compréhension

## Phrases de test incluses

### Français
- "Bonjour, comment allez-vous ?"
- "J'ai faim et soif"
- "Je veux aller aux toilettes"
- "J'ai besoin d'aide"
- "Merci beaucoup"

### Malgache
- "Salama, manao ahoana ianao?"
- "Noana sy mangetaheta aho"
- "Tia ho any am-pandriana aho"
- "Mila fanampiana aho"
- "Misaotra betsaka"

## Limitations actuelles

1. **Voix malgache native** : Non disponible sur tous les appareils
2. **Fallback** : Utilise la voix anglaise comme alternative
3. **Prononciation** : Peut ne pas être parfaite pour tous les mots malgaches

## Améliorations futures

1. **Intégration de voix malgaches natives** via des API tierces
2. **Base de données de prononciation** malgache
3. **Support de dialectes** régionaux
4. **Voix personnalisées** pour les utilisateurs

## Support technique

Pour toute question ou problème :
- Vérifier que la synthèse vocale est activée sur l'appareil
- Tester avec l'écran "Test des voix"
- Consulter les paramètres de langue dans l'application

## Contribution

Pour ajouter de nouvelles phrases ou améliorer les traductions :
1. Modifier le fichier `i18n.js` pour les traductions
2. Modifier `PictogrammesScreen.js` pour les pictogrammes
3. Tester avec l'écran de test des voix 