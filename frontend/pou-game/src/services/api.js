// src/services/api.js
import axios from "axios";

// Utilise la variable d'environnement VUE_APP_API_URL si définie, sinon l'URL locale par défaut
const baseURL = process.env.VUE_APP_API_URL || "http://localhost:3000";

const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 5000,
});

export default {
  async getState() {
    try {
      const response = await apiClient.get("/pet");
      return response.data;
    } catch (error) {
      console.error("Erreur API - getState :", error);
      return null;
    }
  },

  async updateState(data) {
    try {
      const response = await apiClient.post("/pet", data);
      return response.data;
    } catch (error) {
      console.error("Erreur API - updateState :", error);
      return null;
    }
  },

  // Ne jamais appeler updateGauges() depuis le client
  async updateGauges() {
    try {
      const response = await apiClient.post("/pet/update");
      return response.data;
    } catch (error) {
      console.error("Erreur API - updateGauges :", error);
      return null;
    }
  },
};
