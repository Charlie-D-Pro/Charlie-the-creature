// Chargez les variables d'environnement depuis le fichier .env (pour le développement local)
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// Configuration de CORS pour autoriser les requêtes depuis n'importe quelle origine
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Middleware pour parser les requêtes JSON
app.use(bodyParser.json());

// Récupère l'URL de connexion MongoDB depuis les variables d'environnement
const mongoUrl = process.env.MONGO_URL;

// Connexion à MongoDB avec un timeout augmenté pour donner plus de temps au cluster (30 sec)
mongoose
  .connect(mongoUrl, {
    serverSelectionTimeoutMS: 30000, // 30 secondes
  })
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((error) => {
    console.error("❌ Erreur de connexion à MongoDB", error);
    process.exit(1); // Quitte proprement en cas d'erreur de connexion
  });

// Définition du modèle Pet avec les jauges et la position
const petSchema = new mongoose.Schema({
  hunger: { type: Number, default: 100 }, // Faim (feed)
  energy: { type: Number, default: 100 }, // Énergie (sleep)
  thirst: { type: Number, default: 100 }, // Soif (drink)
  happiness: { type: Number, default: 100 }, // Bonheur (play)
  posX: { type: Number, default: 256 }, // Position X initiale du pet
  posY: { type: Number, default: 320 }, // Position Y initiale du pet
});

const Pet = mongoose.model("Pet", petSchema);

// Initialisation du pet dans la base s'il n'existe pas encore
const initPet = async () => {
  const existingPet = await Pet.findOne();
  if (!existingPet) {
    await Pet.create({
      hunger: 100,
      energy: 100,
      thirst: 100,
      happiness: 100,
      posX: 256,
      posY: 320,
    });
    console.log("🐾 Pet initialisé dans la base !");
  }
};
initPet();

// ✅ Endpoint GET /pet : Récupère l'état complet du pet (jauges et position)
app.get("/pet", async (req, res) => {
  try {
    const pet = await Pet.findOne();
    res.json(pet);
  } catch (error) {
    console.error("❌ Erreur GET /pet", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ Endpoint POST /pet : Met à jour le pet en fonction d'une action et/ou de la position
app.post("/pet", async (req, res) => {
  try {
    const { action, posX, posY } = req.body;
    let pet = await Pet.findOne();

    if (!pet) return res.status(404).json({ message: "Pet introuvable !" });

    // Mise à jour des jauges selon l'action
    if (action === "feed") {
      pet.hunger = Math.min(pet.hunger + 10, 100);
    } else if (action === "sleep") {
      pet.energy = Math.min(pet.energy + 10, 100);
    } else if (action === "drink") {
      pet.thirst = Math.min(pet.thirst + 10, 100);
    } else if (action === "play") {
      pet.happiness = Math.min(pet.happiness + 10, 100);
    }

    // Mise à jour de la position si fournie
    if (posX !== undefined && posY !== undefined) {
      pet.posX = posX;
      pet.posY = posY;
    }

    await pet.save();
    res.json(pet);
  } catch (error) {
    console.error("❌ Erreur POST /pet", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ Endpoint POST /pet/update : Diminue automatiquement les jauges pour simuler la dégradation dans le temps
app.post("/pet/update", async (req, res) => {
  try {
    let pet = await Pet.findOne();
    if (!pet) return res.status(404).json({ message: "Pet introuvable !" });

    // Décrémentation des jauges (sans tomber en dessous de 0)
    pet.hunger = Math.max(pet.hunger - 5, 0);
    pet.energy = Math.max(pet.energy - 5, 0);
    pet.thirst = Math.max(pet.thirst - 5, 0);
    pet.happiness = Math.max(pet.happiness - 5, 0);

    await pet.save();
    res.json(pet);
  } catch (error) {
    console.error("❌ Erreur POST /pet/update", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Démarrage du serveur sur le port défini par Render (ou 3000 par défaut en local)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
});
