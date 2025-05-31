# Charlie-the-creature

**Charlie-the-creature** est une application interactive qui associe un backend Node.js/Express avec MongoDB et un frontend développé en Vue.js avec Vite. Ce projet simule un pet virtuel vivant dans un décor animé, permettant diverses interactions telles que manger, boire, dormir et jouer, avec une synchronisation en temps réel de ses états.

---

## Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Architecture--Structure](#architecture--structure)
- [Technologies utilisées](#technologies-utilisées)
- [Installation](#installation)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Utilisation](#utilisation)
- [Points d'amélioration](#points-damélioration)
- [Contribution](#contribution)
- [Licence](#licence)

---

## Aperçu

**Charlie-the-creature** offre une expérience immersive où un pet virtuel évolue dans une salle interactive. Le backend gère la persistance et la logique de décrémentation des jauges (faim, soif, énergie, bonheur) à l'aide de MongoDB, tandis que le frontend en Vue.js avec Vite présente une interface animée et réactive pour observer et interagir avec le pet.

---

## Fonctionnalités

- **Backend (Node.js + Express & MongoDB) :**

  - Connexion à une base MongoDB pour stocker l'état du pet.
  - Endpoint `GET /pet` qui renvoie l'état actuel du pet avec une décrémentation basée sur le temps écoulé.
  - Endpoint `POST /pet` permettant de mettre à jour des valeurs suite à une action (manger, boire, dormir, jouer).
  - Initialisation automatique du pet dans la base si aucun enregistrement n'est trouvé.

- **Frontend (Vue.js + Vite) :**
  - Interface utilisateur réactive basée sur Vue 3 (Composition API).
  - Composants interactifs pour afficher la salle, le pet, les objets décoratifs et les jauges d'état.
  - Logique d'animation et de déplacement du pet via des composables spécialisés (gestion des mouvements, des animations et de la configuration).
  - Contrôle des actions via des boutons dédiés dans le composant **UIControls.vue**.
  - Synchronisation d'état avec le backend par appels API via Axios.

---

## Architecture--Structure

Le projet est organisé en deux parties principales :

**Backend :**

- `server.js`  
  Configure l'API avec Express, gère la connexion à MongoDB via Mongoose, définit le schéma du pet et implémente la logique de décrémentation en temps réel.

**Frontend (Vue.js) :**

- **Composants principaux** :

  - `App.vue` : Intègre les composants **Room.vue** (affichage de l'environnement), **Gauges.vue** (indicateurs d'état) et **UIControls.vue** (boutons d'action).
  - `Room.vue` : Affiche le décor (image de fond, hitbox SVG, objets décoratifs) et intègre le composant **Pet.vue**.
  - `Pet.vue` : Gère l'affichage, les animations et les déplacements du pet.
  - `Gauges.vue` : Affiche les jauges de faim, soif, énergie et bonheur avec des barres de progression.
  - `UIControls.vue` : Propose des boutons pour déclencher des actions (manger, boire, dormir, jouer).
  - `Objects.vue` : Affiche les objets décoratifs dans la salle.

- **Composables et services** :
  - `src/services/api.js` : Centralise les appels API vers le backend.
  - `usePetState.js` : Gère l'état réactif du pet, la logique de décrémentation locale et le déclenchement des actions.
  - `usePetMovement.js` : Coordonne le déplacement du pet, vérifie les zones interdites et met à jour sa position.
  - `usePetAnimation.js` : Ordonne les animations du pet, notamment lors des actions en deux phases.
  - `usePetConfig.js` : Fournit les configurations et paramètres fixes (vitesse, zones interdites, réglages d'animation).

---

## Technologies utilisées

- **Backend :**

  - Node.js, Express, Mongoose, MongoDB, dotenv, cors

- **Frontend :**
  - Vue.js 3 (Composition API), Vite, Axios, CSS (SFC)

---

## Installation

### Backend

1. **Prérequis :**

   - Node.js (version 14 ou supérieure)
   - Une instance de MongoDB (locale ou distante)

2. **Configuration :**
   Créez un fichier `.env` à la racine du projet backend avec au moins : MONGO_URL=mongodb://localhost:27017/charlieDB PORT=3000

3. **Installation :**

```bash
cd backend
npm install
```

4. **Démarrage :**

```bash
npm start
```

Le serveur démarre sur le port défini (par défaut 3000).

### Frontend

1. **Prérequis :**

   - Node.js, npm

2. **Installation :**

```bash
cd frontend/pou-game
npm install
```

3. **Configuration :**

   Dans un fichier .env à la racine du projet frontend, définissez :

   VITE_API_URL=http://localhost:3000

   Cela permet de pointer le client vers le backend.

4. **Démarrage :**

```bash
npm run dev
```

---

**Bloc 2/2 :**

````markdown
---
## Utilisation

- Accédez à l'interface via votre navigateur.
- Observez le pet évoluer dans une salle décorée, avec des jauges affichant ses états (faim, soif, énergie, bonheur).
- Utilisez les boutons du composant **UIControls.vue** pour déclencher des actions (manger, boire, dormir, jouer) qui modifient les jauges et animent le pet.
- Le pet se déplace aléatoirement dans la salle en respectant des zones interdites, et son état est régulièrement synchronisé avec le backend.
---

## Points d'amélioration

- **Synchronisation des états :**  
  La décrémentation des jauges est appliquée à la fois côté serveur et côté client, ce qui peut entraîner des divergences. Une centralisation de la logique pourrait simplifier la gestion.
- **Nettoyage des intervalles :**  
  Assurez-vous que tous les `setInterval` et autres timers sont correctement arrêtés lors du démontage des composants pour éviter des fuites de mémoire.
- **Optimisation des appels API :**  
  Lors de l'exécution des actions, le nombre d'appels API peut être élevé. Envisagez d'utiliser un mécanisme de debounce ou de regrouper les mises à jour pour réduire la charge.
- **Gestion des valeurs hardcodées :**  
  Pour faciliter la maintenance, certaines valeurs (positions par défaut, offsets, etc.) pourraient être centralisées dans un fichier de configuration.

---

## Contribution

Les contributions à **Charlie-the-creature** sont les bienvenues !

1. **Forkez le dépôt**
2. **Créez une branche pour votre fonctionnalité :**

   ```bash
   git checkout -b feature/ma-fonctionnalite

   ```

3. **Commitez vos modifications avec des messages clairs.**
4. **Poussez votre branche et ouvrez une Pull Request pour soumettre vos modifications.**

**Licence**
Ce projet est distribué sous la licence MIT.
````
