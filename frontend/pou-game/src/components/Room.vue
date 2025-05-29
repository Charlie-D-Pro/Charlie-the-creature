<template>
  <div class="room-container">
    <img src="/assets/room.png" alt="Room Background" class="room-bg" />

    <!-- Hitbox SVG -->
    <svg
      class="hitbox"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      <polygon
        points="257,197 493,323 258,443 20,323"
        fill="red"
        opacity="0.3"
        stroke="black"
        stroke-width="2"
      />
    </svg>

    <!-- Affichage des objets dans la pièce -->
    <Objects />

    <!-- Le chat affiché dans la room -->
    <Pet ref="petComponent" />
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import Pet from "./Pet.vue";
import Objects from "./Objects.vue";

export default defineComponent({
  name: "Room",
  components: { Pet, Objects },
  setup(_, { expose }) {
    // On crée une référence vers le composant Pet.
    const petComponent = ref(null);

    // Cette méthode relaie l'action vers le chat.
    const executeActionFromOutside = (type, x, y, durationX, durationY) => {
      if (petComponent.value && petComponent.value.executeAction) {
        petComponent.value.executeAction(type, x, y, durationX, durationY);
      }
    };

    // On expose la méthode pour pouvoir l'appeler depuis App.vue.
    expose({ executeActionFromOutside });

    return { petComponent };
  },
});
</script>

<style scoped>
.room-container {
  position: relative;
  width: 512px;
  height: 512px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.room-bg {
  width: 100%;
  height: 100%;
}

.hitbox {
  position: absolute;
  left: 0; /* Ajuster si nécessaire */
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
