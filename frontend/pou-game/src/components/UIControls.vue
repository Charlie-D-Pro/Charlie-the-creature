<template>
  <div class="controls">
    <button type="button" @click="triggerAction('eat', 340, 230)">
      Manger
    </button>
    <button type="button" @click="triggerAction('drink', 408, 268)">
      Boire
    </button>
    <button type="button" @click="triggerAction('sleep', 178, 195)">
      Dormir
    </button>
    <button type="button" @click="triggerAction('play', 250, 200)">
      Jouer
    </button>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "UIControls",
  emits: ["actionTriggered"],
  setup(_, { emit }) {
    const triggerAction = (type, x, y) => {
      emit("actionTriggered", { type, x, y });
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
