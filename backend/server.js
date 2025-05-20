const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(bodyParser.json());

// Connexion sécurisée à MongoDB via Render
const mongoUrl = process.env.MONGO_URL; // Récupère l'URL de la base stockée sur Render

mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((error) => {
    console.error("❌ Erreur de connexion à MongoDB", error);
    process.exit(1); // Quitte proprement en cas d'erreur
  });

// Définition du modèle Pet
const petSchema = new mongoose.Schema({
  hunger: { type: Number, default: 100 },
  energy: { type: Number, default: 100 },
  cleanliness: { type: Number, default: 100 },
});

const Pet = mongoose.model("Pet", petSchema);

// Initialisation du pet dans MongoDB
const initPet = async () => {
  const existingPet = await Pet.findOne();
  if (!existingPet) {
    await Pet.create({ hunger: 100, energy: 100, cleanliness: 100 });
    console.log("🐾 Pet initialisé en base !");
  }
};
initPet();

// ✅ **Endpoint pour récupérer l'état actuel du pet**
app.get("/pet", async (req, res) => {
  try {
    const pet = await Pet.findOne();
    res.json(pet);
  } catch (error) {
    console.error("❌ Erreur GET /pet", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ **Endpoint pour mettre à jour les jauges**
app.post("/pet", async (req, res) => {
  try {
    const { action } = req.body;
    let pet = await Pet.findOne();

    if (!pet) return res.status(404).json({ message: "Pet introuvable !" });

    if (action === "feed") pet.hunger = Math.min(pet.hunger + 10, 100);
    if (action === "sleep") pet.energy = Math.min(pet.energy + 10, 100);
    if (action === "clean")
      pet.cleanliness = Math.min(pet.cleanliness + 10, 100);

    await pet.save();
    res.json(pet);
  } catch (error) {
    console.error("❌ Erreur POST /pet", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ **Endpoint pour diminuer les jauges automatiquement**
app.post("/pet/update", async (req, res) => {
  try {
    let pet = await Pet.findOne();

    if (!pet) return res.status(404).json({ message: "Pet introuvable !" });

    pet.hunger = Math.max(pet.hunger - 5, 0);
    pet.energy = Math.max(pet.energy - 5, 0);
    pet.cleanliness = Math.max(pet.cleanliness - 5, 0);

    await pet.save();
    res.json(pet);
  } catch (error) {
    console.error("❌ Erreur POST /pet/update", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ **Démarrage du serveur**
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
});
