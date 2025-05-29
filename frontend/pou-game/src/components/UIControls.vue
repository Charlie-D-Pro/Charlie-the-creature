<template>
  <div class="controls">
    <button @click="triggerAction('eat', 340, 230)">Manger</button>
    <button @click="triggerAction('drink', 408, 268)">Boire</button>
    <button @click="triggerAction('sleep', 178, 195)">Dormir</button>
    <button @click="triggerAction('play', 250, 200)">Jouer</button>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "UIControls",
  emits: ["actionTriggered"],
  setup(_, { emit }) {
    const triggerAction = (type, x, y, durationX, durationY) => {
      // Émet un objet avec toutes les infos nécessaires à l'action.
      emit("actionTriggered", { type, x, y, durationX, durationY });
    };

    return { triggerAction };
  },
});
</script>

<style scoped>
.controls {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
</style>
