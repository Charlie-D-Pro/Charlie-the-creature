// src/services/api.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000", // Assurez-vous que l'URL et le port correspondent à votre serveur Express.
  headers: {
    "Content-Type": "application/json",
  },
});

export default {
  // Récupère l'état complet du pet (jauges et position)
  getState() {
    return apiClient.get("/pet");
  },
  // Met à jour le pet en fonction d'une action et/ou d'une position nouvelle
  updateState(data) {
    return apiClient.post("/pet", data);
  },
  // Diminue automatiquement les jauges (simule l'usure dans le temps)
  updateGauges() {
    return apiClient.post("/pet/update");
  },
};
