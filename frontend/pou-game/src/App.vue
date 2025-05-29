<template>
  <div class="app-container">
    <!-- On affiche Room (contenant déjà Pet) et on lui associe un ref -->
    <Room ref="roomComponent" />
    <!-- UIControls émettra un événement "actionTriggered" -->
    <UIControls @actionTriggered="handleAction" />
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import Room from "./components/Room.vue";
import UIControls from "./components/UIControls.vue";
import apiService from "./services/api";

export default defineComponent({
  name: "App",
  components: { Room, UIControls },
  setup() {
    const roomComponent = ref(null);

    // Au démarrage, on récupère l'état sauvegardé du pet
    onMounted(() => {
      apiService
        .getState()
        .then((response) => {
          console.log("État récupéré :", response.data);
          // Si Room expose une méthode pour restaurer l'état, on l'appelle ici.
          if (roomComponent.value && roomComponent.value.restoreState) {
            roomComponent.value.restoreState(response.data);
          }
        })
        .catch((error) =>
          console.error("Erreur lors de la récupération de l'état :", error)
        );
    });

    // Fonction gérant les actions déclenchées depuis UIControls
    const handleAction = ({ type, x, y, durationX, durationY }) => {
      if (roomComponent.value && roomComponent.value.executeActionFromOutside) {
        roomComponent.value.executeActionFromOutside(
          type,
          x,
          y,
          durationX,
          durationY
        );
      }
      // Mise à jour de l'état du pet en transmettant l'action et la position actuelle
      if (roomComponent.value && roomComponent.value.getPetPosition) {
        const position = roomComponent.value.getPetPosition();
        apiService
          .updateState({ action: type, posX: position.x, posY: position.y })
          .then((response) =>
            console.log("État mis à jour suite à l'action :", response.data)
          )
          .catch((error) =>
            console.error("Erreur lors de la mise à jour de l'état :", error)
          );
      }
    };

    // Mise à jour périodique de la position (par exemple toutes les 5 secondes)
    setInterval(() => {
      if (roomComponent.value && roomComponent.value.getPetPosition) {
        const position = roomComponent.value.getPetPosition();
        apiService
          .updateState({ posX: position.x, posY: position.y })
          .then((response) =>
            console.log("Position sauvegardée :", response.data)
          )
          .catch((error) =>
            console.error(
              "Erreur lors de la sauvegarde de la position :",
              error
            )
          );
      }
    }, 5000);

    // Mise à jour périodique des jauges (toutes les 10 secondes)
    setInterval(() => {
      apiService
        .updateGauges()
        .then((response) =>
          console.log("Jauges mises à jour automatiquement :", response.data)
        )
        .catch((error) =>
          console.error("Erreur lors de la mise à jour des jauges :", error)
        );
    }, 10000);

    return { handleAction, roomComponent };
  },
});
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
