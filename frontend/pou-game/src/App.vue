<template>
  <div class="app-container">
    <Room />
    <!-- ✅ Affichage de la pièce -->
    <UIControls />
    <!-- ✅ Gestion des jauges et interactions -->
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Room from "./components/Room.vue";
import UIControls from "./components/UIControls.vue";

export default defineComponent({
  components: { Room, UIControls },
});
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
