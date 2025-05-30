// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

const mongoUrl = process.env.MONGO_URL;
mongoose
  .connect(mongoUrl, { serverSelectionTimeoutMS: 30000 })
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((error) => {
    console.error("❌ Erreur de connexion à MongoDB", error);
    process.exit(1);
  });

// Ajout du champ 'lastUpdate' pour le suivi du temps
const petSchema = new mongoose.Schema({
  hunger: { type: Number, default: 100 },
  energy: { type: Number, default: 100 },
  thirst: { type: Number, default: 100 },
  happiness: { type: Number, default: 100 },
  posX: { type: Number, default: 256 },
  posY: { type: Number, default: 320 },
  lastUpdate: { type: Date, default: Date.now }, // nouvelle propriété
});
const Pet = mongoose.model("Pet", petSchema);

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
      lastUpdate: Date.now(),
    });
    console.log("🐾 Pet initialisé dans la base !");
  }
};
initPet();

// Paramètres de décrémentation identiques à ceux utilisés côté client
const decrementSettingsServer = {
  hunger: { interval: 15000, amount: 1 }, // toutes les 15 sec, -1 point
  thirst: { interval: 10000, amount: 1 }, // toutes les 10 sec, -1 point
  energy: { interval: 20000, amount: 1 }, // toutes les 20 sec, -1 point
  happiness: { interval: 30000, amount: 1 }, // toutes les 30 sec, -1 point
};

// GET /pet : renvoie l'état du pet en calculant la décrémentation "en temps réel"
app.get("/pet", async (req, res) => {
  try {
    const pet = await Pet.findOne();
    if (!pet) return res.status(404).json({ message: "Pet introuvable." });

    const now = Date.now();
    const elapsed = now - pet.lastUpdate.getTime(); // Temps écoulé en ms
    console.log(
      `🕒 Temps écoulé depuis la dernière mise à jour : ${elapsed} ms`
    );

    let updated = false;
    for (const gauge in decrementSettingsServer) {
      const settings = decrementSettingsServer[gauge];
      const pointsToDecrement =
        Math.floor(elapsed / settings.interval) * settings.amount;

      if (pointsToDecrement > 0) {
        const newValue = Math.max(0, pet[gauge] - pointsToDecrement);
        if (newValue !== pet[gauge]) {
          pet[gauge] = newValue;
          updated = true;
          console.log(
            `🔄 Décrémentation appliquée : ${gauge} -${pointsToDecrement} (nouvelle valeur = ${newValue})`
          );
        }
      }
    }

    // Si une jauge a été modifiée, on met à jour `lastUpdate`
    if (updated) {
      pet.lastUpdate = new Date(now); // Mise à jour
      await pet.save();
      console.log(`✅ lastUpdate mis à jour : ${pet.lastUpdate}`);
    } else {
      console.log("🔄 Aucun changement nécessaire sur les jauges.");
    }

    res.json(pet.toObject()); // Renvoyer un objet JavaScript simple
  } catch (error) {
    console.error("❌ Erreur GET /pet :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /pet : met à jour les valeurs (par exemple pour une action) et remet lastUpdate au moment de la mise à jour
app.post("/pet", async (req, res) => {
  try {
    console.log("🔄 POST /pet - Requête reçue :", req.body);
    const { hunger, thirst, energy, happiness, posX, posY } = req.body;
    let pet = await Pet.findOne();
    if (!pet) return res.status(404).json({ message: "Pet introuvable!" });

    if (hunger !== undefined) {
      const newHunger = Math.max(0, Math.min(100, Number(hunger)));
      console.log(`Mise à jour de hunger : ${pet.hunger} -> ${newHunger}`);
      pet.hunger = newHunger;
    }
    if (thirst !== undefined) {
      const newThirst = Math.max(0, Math.min(100, Number(thirst)));
      console.log(`Mise à jour de thirst : ${pet.thirst} -> ${newThirst}`);
      pet.thirst = newThirst;
    }
    if (energy !== undefined) {
      const newEnergy = Math.max(0, Math.min(100, Number(energy)));
      console.log(`Mise à jour de energy : ${pet.energy} -> ${newEnergy}`);
      pet.energy = newEnergy;
    }
    if (happiness !== undefined) {
      const newHappiness = Math.max(0, Math.min(100, Number(happiness)));
      console.log(
        `Mise à jour de happiness : ${pet.happiness} -> ${newHappiness}`
      );
      pet.happiness = newHappiness;
    }
    if (posX !== undefined) {
      const newPosX = Number(posX);
      console.log(`Mise à jour de posX : ${pet.posX} -> ${newPosX}`);
      pet.posX = newPosX;
    }
    if (posY !== undefined) {
      const newPosY = Number(posY);
      console.log(`Mise à jour de posY : ${pet.posY} -> ${newPosY}`);
      pet.posY = newPosY;
    }

    // Met à jour lastUpdate à chaque requête POST
    pet.lastUpdate = new Date();
    await pet.save();
    const updatedPet = await Pet.findById(pet._id).lean();
    console.log("✅ Sauvegarde réussie, document mis à jour :", updatedPet);
    res.json(updatedPet);
  } catch (error) {
    console.error("❌ Erreur POST /pet :", error.message, error.stack);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /pet/update désactivé pour éviter de remettre à zéro automatiquement
app.post("/pet/update", async (req, res) => {
  res.status(403).json({ message: "Décrémentation automatique désactivée." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
});
