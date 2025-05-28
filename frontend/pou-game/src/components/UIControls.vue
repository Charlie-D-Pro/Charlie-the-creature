<template>
  <div class="controls">
    <button @click="triggerAction('hunger')">Manger</button>
    <button @click="triggerAction('thirst')">Boire</button>
    <button @click="triggerAction('energy')">Dormir</button>
    <button @click="triggerAction('health')">Se soigner</button>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import PetActions from "./PetActions.vue"; // ✅ Connexion aux déplacements du chat

export default defineComponent({
  components: { PetActions },
  setup() {
    const triggerAction = (type) => {
      PetActions.executeAction(type);
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
