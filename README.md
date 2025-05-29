# 🚀 Documentation - Personnage Animé Interactive

Ce projet est une application Vue.js interactive qui met en scène un personnage animé évoluant dans une pièce.  
La logique a été entièrement refactorisée pour séparer le frontend (affichage, animations, interactions) du backend (gestion de l'état, persistance via MongoDB).  
Le projet utilise désormais Node.js avec Express pour le backend et Vue 3 pour le frontend.

---

## 📂 Structure des Fichiers

Voici l'organisation complète du projet :

📂 **Projet (dossier racine)**  
├── 📁 **backend/**  
│ └── 📝 `server.js`  
│ _Contient le serveur Express connecté à MongoDB (via Mongoose) et gère les endpoints pour récupérer et mettre à jour l'état du personnage._  
├── 📁 **src/**  
│ ├── 📁 `assets/`  
│ │ └── _Images et spritesheets (ex. `room.png`, `cat_black.png`, `decoCatSleep.png`, etc.)_  
│ ├── 📁 `components/`  
│ │ ├── 📝 `Pet.vue`  
│ │ _Affiche le personnage animé (gestion des animations, mouvement et flips)._  
│ │ ├── 📝 `Objects.vue`  
│ │ _Affiche les objets décoratifs présents dans la pièce (positionnement, scale, flip)._  
│ │ ├── 📝 `Room.vue`  
│ │ _Vue principale qui affiche le background, la hitbox (SVG) et intègre `Pet.vue` et `Objects.vue`._  
│ │ └── 📝 `UIControls.vue`  
│ │ _Interface utilisateur pour déclencher des actions (manger, boire, dormir, jouer)._  
│ ├── 📁 `composables/`  
│ │ ├── 📝 `usePetConfig.js`  
│ │ _Centralise la configuration globale (zones interdites, vitesses, scales, animation)._  
│ │ ├── 📝 `usePetMovement.js`  
│ │ _Gère les déplacements du personnage, la gestion de la hitbox et le mouvement aléatoire._  
│ │ └── 📝 `usePetAnimation.js`  
│ │ _Supervise les animations du personnage (idle, déplacement et actions en deux phases)._  
│ └── 📝 `App.vue`  
│ _Composant principal du frontend, qui intègre `Room.vue` et `UIControls.vue`._  
├── 📝 `package.json`  
└── ... (autres fichiers de configuration)

---

## 📜 Description des Composants

### **App.vue**

💡 **Fonction** :  
Le point d'entrée de l'application frontend.  
Intègre la vue globale via `Room.vue` et gère la transmission des actions depuis `UIControls.vue`.

📌 **À modifier** :

- Ajuster le style global.
- Ajouter d’éventuelles interactions globales.

---

### **Pet.vue**

💡 **Fonction** :  
Affiche le personnage animé et gère ses animations, ses déplacements et ses transformations (scale, flip).

📌 **À modifier** :

- Ajouter de nouveaux états ou animations.
- Modifier le rendu visuel et affiner les transitions.

---

### **Objects.vue**

💡 **Fonction** :  
Affiche les objets décoratifs dans la pièce.  
Chaque objet est défini par ses propriétés (position, dimensions, image, scale, flip).

📌 **À modifier** :

- Ajouter ou modifier des objets.
- Intégrer des animations pour certains objets (ex. via GIF ou spritesheet).

---

### **Room.vue**

💡 **Fonction** :  
Vue principale de la pièce.  
Affiche le background (`room.png`), la hitbox (SVG) et regroupe `Pet.vue` et `Objects.vue`.

📌 **À modifier** :

- Personnaliser l’agencement de la pièce.
- Modifier la hitbox ou ajouter de nouveaux éléments d’environnement.

---

### **UIControls.vue**

💡 **Fonction** :  
Interface utilisateur pour déclencher des actions sur le personnage (manger, boire, dormir, jouer).

📌 **À modifier** :

- Personnaliser l’apparence et le style des boutons.
- Ajouter de nouvelles actions ou modifier la configuration des actions émises.

---

## 💾 Les Composables

Pour une meilleure modularité, la logique métier est extraite dans des fichiers dédiés :

### **usePetConfig.js**

💡 **Fonction** :  
Centralise toute la configuration globale du personnage et de son environnement.

📌 **Points Clés** :

- Zones interdites utilisées pour la gestion de la hitbox.
- Paramètres généraux (`spriteWidth`, `idleRow`).
- Vitesses de déplacement (`randomSpeed`, `actionSpeed`) et réglages de scale (`scaleIdle`, `scaleMoving`, `scaleActionDefault`).
- Configuration détaillée des animations pour chaque action (eat, drink, sleep, play).

---

### **usePetMovement.js**

💡 **Fonction** :  
Gère les déplacements et la position du personnage.

📌 **Points Clés** :

- États réactifs de position (`petX`, `petY`) et d’animation (`spriteX`, `spriteY`).
- Fonction `moveTo(x, y, callback, speed)` qui déplace le personnage avec une transition CSS fluide.
- Logique de déplacement aléatoire avec prise en charge de la hitbox et des zones interdites.
- Expose un style calculé pour le point de contrôle (pour le débogage).

---

### **usePetAnimation.js**

💡 **Fonction** :  
Supervise toutes les animations du personnage, que ce soit en état idle, lors de déplacements ou lors d’actions spécifiques.

📌 **Points Clés** :

- `animateSprite()` pour animer le personnage en state idle ou en mouvement.
- `animateActionRow()` qui gère la séquence d'animation en deux phases pour les actions.
- `executeAction(type, targetX, targetY)` pour déclencher une action spécifique et appliquer dynamiquement un scale différent.

---

## 🚀 Backend - server.js

Le backend est développé avec Node.js et Express, et utilise MongoDB (via Mongoose) pour la persistance de l’état du personnage.

### **Points Clés :**

- **Connexion à MongoDB :**  
  Le serveur se connecte à MongoDB via une URL sécurisée fournie dans la variable d'environnement `MONGO_URL`.

- **Modèle Pet :**  
  Défini via Mongoose pour stocker les jauges du personnage (hunger, energy, cleanliness).  
  Un initialiseur vérifie et crée un document initial si aucun n’existe.

- **Endpoints :**

  - `GET /pet` : Récupère l'état actuel du personnage.
  - `POST /pet` : Met à jour les jauges du personnage selon l’action (ex. feed, sleep, clean).
  - `POST /pet/update` : Diminue automatiquement les jauges (simulation d'une usure).

- **Sécurité et CORS :**  
  Le backend utilise le middleware `cors` pour autoriser les requêtes cross-origin.  
  Les requêtes JSON sont traitées via `body-parser`.

📌 **À modifier** :

- Étendre ou ajouter des endpoints pour de nouvelles fonctionnalités.
- Intégrer une gestion d’authentification si nécessaire.
- Optimiser la persistance en fonction de l’évolution des besoins.

---
