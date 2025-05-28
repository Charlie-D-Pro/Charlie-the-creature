# 🚀 Documentation - Personnage Animé

## 📂 Structure des Fichiers

Voici comment organiser les fichiers :

📂 **Projet (dossier racine)**  
 ├── 📁 `src/` _(Dossier contenant le code source Vue)_  
 ├── 📝 `App.vue` _(Composant principal qui inclut `Pet.vue` et gère les jauges)_  
 ├── 📁 `components/` _(Dossier des composants Vue)_  
 ├── 📝 `Pet.vue` _(Composant du personnage animé avec émotions et jauges)_  
 ├── 📁 `utils/` _(Dossier des scripts utilitaires)_  
 ├── 📝 `EmotionHandler.js` _(Gestion des émotions et états du personnage)_  
 ├── 📁 `assets/` _(Dossier des fichiers statiques, comme les styles et animations)_  
 ├── 🎨 `Animations.css` _(Fichier contenant les animations du personnage)_

---

## 📝 **App.vue**

💡 **Fonction** : Fichier principal qui inclut `Pet.vue` et gère les interactions.  
📌 **À modifier** :

- Ajoute **d'autres jauges** (ex : bonheur, santé)
- Change **les valeurs par défaut** (`hunger`, `energy`, `cleanliness`)
- Ajuste **le style des boutons** pour une meilleure expérience

---

## 🎭 **Pet.vue**

💡 **Fonction** : Affiche **le personnage animé**, ses émotions et ses jauges.  
📌 **À modifier** :

- Ajoute **d'autres états émotionnels** (`happy`, `sick`, `excited`...)
- Améliore **le rendu visuel** en ajustant les tailles et couleurs
- Change **la logique des animations** pour ajouter des transitions plus fluides

---

## 🎨 **Animations.css**

💡 **Fonction** : Contient toutes **les animations du personnage**.  
📌 **À modifier** :

- Ajoute **d'autres effets** (`rebond`, `clignement`, `rotation`...)
- Change **la vitesse des animations** pour un rendu plus naturel
- Teste **différents styles d’animation** pour voir leur impact visuel

---

## 🤖 **EmotionHandler.js**

💡 **Fonction** : Détermine **l'émotion du personnage** en fonction des jauges.  
📌 **À modifier** :

- Ajoute **plus de niveaux d’émotion** (`joyeux`, `fatigué`, `triste`, `énervé`)
- Change **les critères de changement** (ex: une jauge basse doit impacter plus d’émotions)
- Personnalise **les couleurs et expressions faciales**

---

## 🚀 **Améliorations possibles**

✔ Ajouter un **son** quand le personnage effectue une action  
✔ Rendre l’animation **plus fluide** avec des transitions progressives  
✔ Intégrer un **système de réactions** aux clics ou interactions

---

Avec ce fichier README, tu peux **comprendre toute la structure** et **modifier facilement ton projet**. 😊  
Si tu veux **ajouter une autre fonctionnalité**, dis-moi ! 🚀🔥
