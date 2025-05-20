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

// Connexion à MongoDB (remplace `<URL_MONGO>` par ton lien de connexion)
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connecté à MongoDB"))
  .catch((error) => console.error("Erreur de connexion à MongoDB", error));

// Modèle Pet
const petSchema = new mongoose.Schema({
  hunger: Number,
  energy: Number,
  cleanliness: Number,
});
const Pet = mongoose.model("Pet", petSchema);

// Initialisation du pet en base
const initPet = async () => {
  const existingPet = await Pet.findOne();
  if (!existingPet) {
    await Pet.create({ hunger: 100, energy: 100, cleanliness: 100 });
    console.log("Pet initialisé dans MongoDB");
  }
};
initPet();

// Récupérer l'état actuel du pet
app.get("/pet", async (req, res) => {
  const pet = await Pet.findOne();
  res.json(pet);
});

// Modifier les jauges et sauvegarder
app.post("/pet", async (req, res) => {
  const { action } = req.body;
  let pet = await Pet.findOne();

  if (action === "feed") pet.hunger = Math.min(pet.hunger + 10, 100);
  if (action === "sleep") pet.energy = Math.min(pet.energy + 10, 100);
  if (action === "clean") pet.cleanliness = Math.min(pet.cleanliness + 10, 100);

  await pet.save(); // Sauvegarde dans MongoDB
  res.json(pet);
});

// Diminution automatique des jauges
app.post("/pet/update", async (req, res) => {
  let pet = await Pet.findOne();

  pet.hunger = Math.max(pet.hunger - 5, 0);
  pet.energy = Math.max(pet.energy - 5, 0);
  pet.cleanliness = Math.max(pet.cleanliness - 5, 0);

  await pet.save(); // Sauvegarde dans MongoDB
  res.json(pet);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});
