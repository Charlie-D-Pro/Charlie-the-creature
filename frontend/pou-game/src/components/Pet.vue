<template>
  <div class="pet-container" :style="petStyle">
    <div class="control-point" :style="controlStyle"></div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import { usePetMovement } from "../composables/usePetMovement";
import { usePetAnimation } from "../composables/usePetAnimation";
import { usePetConfig } from "../composables/usePetConfig";

export default defineComponent({
  name: "Pet",
  setup() {
    // On récupère les données et fonctions relatives au mouvement
    const movement = usePetMovement();
    const config = usePetConfig();
    // On initialise l'animation en passant l'objet de mouvement pour partager les états
    const animation = usePetAnimation(movement);
    const { animateSprite, executeAction } = animation;
    const { scaleIdle, scaleMoving } = config;
    const { currentActionScale } = animation;

    // Nouveaux flags pour le flip horizontal et vertical
    const flipSpriteHorizontal = ref(false);
    const flipSpriteVertical = ref(false);

    // Calcul du scale global selon l'état (action, déplacement, idle)
    const currentScale = computed(() => {
      if (movement.isPerformingAction.value) return currentActionScale.value;
      if (movement.isMoving.value) return scaleMoving.value;
      return scaleIdle.value;
    });

    // Style réactif du pet, intégrant la position, l'animation et les flips
    const petStyle = computed(() => {
      let transformValue = `scale(${currentScale.value})`;
      if (flipSpriteHorizontal.value) {
        transformValue += " scaleX(-1)";
      }
      if (flipSpriteVertical.value) {
        transformValue += " scaleY(-1)";
      }
      return {
        position: "absolute",
        left: `${movement.petX.value}px`,
        top: `${movement.petY.value}px`,
        width: "64px",
        height: "64px",
        backgroundImage: "url('/assets/cats/cat_black.png')",
        backgroundPosition: `-${movement.spriteX.value}px -${movement.spriteY.value}px`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "auto",
        transform: transformValue,
        transition: `left ${movement.moveDurationSeconds.value}s ease, top ${movement.moveDurationSeconds.value}s ease`,
      };
    });

    // On utilise le style défini dans usePetMovement
    const controlStyle = movement.controlStyle;

    onMounted(() => {
      movement.getHitboxCoordinates();
      animateSprite();
      movement.movePetRandomly();
    });

    return {
      petStyle,
      controlStyle,
      executeAction,
      flipSpriteHorizontal,
      flipSpriteVertical,
    };
  },
});
</script>

<style scoped>
.pet-container {
  position: absolute;
  transform: scale(1);
}
.control-point {
  position: absolute;
  width: 5px;
  height: 5px;
  background-color: green;
  border-radius: 50%;
}
</style>
