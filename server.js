const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let pet = {
  hunger: 100,
  energy: 100,
  cleanliness: 100,
};

app.get("/pet", (req, res) => {
  res.json(pet);
});

app.post("/pet", (req, res) => {
  const { action } = req.body;
  if (action === "feed") pet.hunger = Math.min(pet.hunger + 10, 100);
  if (action === "sleep") pet.energy = Math.min(pet.energy + 10, 100);
  if (action === "clean") pet.cleanliness = Math.min(pet.cleanliness + 10, 100);
  res.json(pet);
});

app.listen(3000, () => {
  console.log("Serveur backend démarré sur http://localhost:3000");
});
