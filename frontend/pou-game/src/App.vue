<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const pet = ref({ hunger: 100, energy: 100, cleanliness: 100 });
const apiUrl = "https://pou-backend.onrender.com/pet";

// Récupérer les jauges sauvegardées
const fetchPet = async () => {
  try {
    const response = await axios.get(apiUrl);
    pet.value = response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données", error);
  }
};

// Mettre à jour localement et envoyer au backend
const interact = async (action) => {
  pet.value[action] = Math.min(pet.value[action] + 10, 100);

  try {
    await axios.post(apiUrl, { action });
  } catch (error) {
    console.error("Erreur lors de l'interaction", error);
  }
};

// Diminution automatique des jauges toutes les 5 secondes
const decreaseStats = async () => {
  try {
    await axios.post(`${apiUrl}/update`);
    fetchPet(); // Met à jour l'affichage
  } catch (error) {
    console.error("Erreur lors de la diminution des jauges", error);
  }
};

// Charge les données et démarre la diminution
onMounted(() => {
  fetchPet();
  setInterval(decreaseStats, 5000);
});
</script>

<template>
  <div>
    <h1>Mon Petit Animal</h1>
    <p>Faim : {{ pet.hunger }}</p>
    <p>Énergie : {{ pet.energy }}</p>
    <p>Propreté : {{ pet.cleanliness }}</p>

    <button @click="interact('hunger')">Nourrir (+10)</button>
    <button @click="interact('energy')">Dormir (+10)</button>
    <button @click="interact('cleanliness')">Nettoyer (+10)</button>
  </div>
</template>

<style>
button {
  margin: 5px;
  padding: 10px;
}
</style>
