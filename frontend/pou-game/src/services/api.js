// src/services/api.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000", // Vérifiez que cette URL correspond à votre backend local
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
