<template>
  <div class="app-container">
    <!-- On affiche Room (contenant déjà Pet) et on lui associe un ref -->
    <Room ref="roomComponent" />
    <!-- UIControls émettra un événement "actionTriggered" -->
    <UIControls @actionTriggered="handleAction" />
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import Room from "./components/Room.vue";
import UIControls from "./components/UIControls.vue";

export default defineComponent({
  name: "App",
  components: { Room, UIControls },
  setup() {
    const roomComponent = ref(null);

    const handleAction = ({ type, x, y, durationX, durationY }) => {
      // On transmet l'action à Room, qui relaiera l'action à Pet.
      if (roomComponent.value && roomComponent.value.executeActionFromOutside) {
        roomComponent.value.executeActionFromOutside(
          type,
          x,
          y,
          durationX,
          durationY
        );
      }
    };

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
