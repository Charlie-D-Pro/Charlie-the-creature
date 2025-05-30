<template>
  <div class="app-container">
    <!-- Composant affichant la pièce et le pet -->
    <Room ref="roomComponent" />
    <!-- Le HUD (par exemple, Gauges.vue) affiche uniquement les gauges -->
    <Gauges :gauges="gauges" />
    <!-- UIControls pour déclencher l'action -->
    <UIControls @actionTriggered="handleAction" />
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import Room from "./components/Room.vue";
import Gauges from "./components/Gauges.vue";
import UIControls from "./components/UIControls.vue";
import { usePetState } from "./composables/usePetState";

export default defineComponent({
  name: "App",
  components: { Room, Gauges, UIControls },
  setup() {
    const roomComponent = ref(null);
    const { gauges, triggerAction } = usePetState();

    function handleAction(actionData) {
      console.log("📢 Action reçue :", actionData);
      // Lance l'incrémentation / action dans le state
      triggerAction(actionData);
      // Si le composant Room expose bien la méthode, on lui transmet les coordonnées
      if (
        roomComponent.value &&
        typeof roomComponent.value.executeActionFromOutside === "function"
      ) {
        roomComponent.value.executeActionFromOutside(
          actionData.type,
          actionData.x,
          actionData.y,
          actionData.durationX,
          actionData.durationY
        );
      }
    }

    return { gauges, handleAction, roomComponent };
  },
});
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 20px;
}
</style>
