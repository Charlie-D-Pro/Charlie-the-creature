const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(
  cors({
    origin: "*", // Autorise toutes les requêtes, ou remplacer par "https://pou-game.vercel.app"
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
); // Autorise le frontend Vercel à accéder au backend Render
app.use(bodyParser.json());

// Stockage en mémoire (à remplacer par une base de données)
let pet = {
  hunger: 100,
  energy: 100,
  cleanliness: 100,
};

// Récupérer l'état actuel du pet
app.get("/pet", (req, res) => {
  res.json(pet);
});

// Modifier les jauges du pet
app.post("/pet", (req, res) => {
  const { action } = req.body;
  if (action === "feed") pet.hunger = Math.min(pet.hunger + 10, 100);
  if (action === "sleep") pet.energy = Math.min(pet.energy + 10, 100);
  if (action === "clean") pet.cleanliness = Math.min(pet.cleanliness + 10, 100);
  res.json(pet);
});

// Diminution automatique des jauges
app.post("/pet/update", (req, res) => {
  pet.hunger = Math.max(pet.hunger - 5, 0);
  pet.energy = Math.max(pet.energy - 5, 0);
  pet.cleanliness = Math.max(pet.cleanliness - 5, 0);
  res.json(pet);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});
