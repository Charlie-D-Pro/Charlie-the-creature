const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Stockage en mémoire (remplace par une base de données si besoin)
let pet = {
  hunger: 100,
  energy: 100,
  cleanliness: 100,
};

// **Endpoint pour récupérer l'état actuel du pet**
app.get("/pet", (req, res) => {
  res.json(pet);
});

// **Endpoint pour ajouter +10 aux jauges quand un bouton est cliqué**
app.post("/pet", (req, res) => {
  const { action } = req.body;
  if (action === "feed") pet.hunger = Math.min(pet.hunger + 10, 100);
  if (action === "sleep") pet.energy = Math.min(pet.energy + 10, 100);
  if (action === "clean") pet.cleanliness = Math.min(pet.cleanliness + 10, 100);
  res.json(pet);
});

// **Endpoint pour diminuer les jauges automatiquement toutes les 5 secondes**
app.post("/pet/update", (req, res) => {
  pet.hunger = Math.max(pet.hunger - 5, 0);
  pet.energy = Math.max(pet.energy - 5, 0);
  pet.cleanliness = Math.max(pet.cleanliness - 5, 0);
  res.json(pet);
});

// **Lancement du serveur**
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});
