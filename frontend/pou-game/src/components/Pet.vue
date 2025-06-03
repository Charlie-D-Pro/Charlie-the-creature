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
    // Récupération des fonctions et données via les composables
    const movement = usePetMovement();
    const config = usePetConfig();
    const animation = usePetAnimation(movement);
    const { animateSprite, executeAction } = animation;
    const { scaleIdle, scaleMoving } = config;
    const { currentActionScale } = animation;

    // Flags pour gérer les flips
    const flipSpriteHorizontal = ref(false);
    const flipSpriteVertical = ref(false);

    // Calcul du scale global en fonction de l'état
    const currentScale = computed(() => {
      if (movement.isPerformingAction.value) return currentActionScale.value;
      if (movement.isMoving.value) return scaleMoving.value;
      return scaleIdle.value;
    });

    // Style réactif du pet
    const petStyle = computed(() => {
      let transformValue = `scale(${currentScale.value})`;
      if (flipSpriteHorizontal.value) transformValue += " scaleX(-1)";
      if (flipSpriteVertical.value) transformValue += " scaleY(-1)";
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

    // Style du point de contrôle (pour debug ou repère visuel)
    const controlStyle = movement.controlStyle;

    onMounted(() => {
      movement.getHitboxCoordinates();
      animateSprite();
      movement.movePetRandomly();
    });

    // Méthode pour restaurer l'état du pet à partir des données du backend
    const restoreState = (data) => {
      if (data.posX !== undefined && data.posY !== undefined) {
        movement.petX.value = data.posX;
        movement.petY.value = data.posY;
      }
      // Vous pouvez étendre cette méthode pour restaurer d'autres états si besoin.
    };

    // Méthode pour obtenir la position actuelle du pet
    const getPosition = () => ({
      x: movement.petX.value,
      y: movement.petY.value,
    });

    return {
      petStyle,
      controlStyle,
      executeAction,
      flipSpriteHorizontal,
      flipSpriteVertical,
      restoreState, // Exposé pour que Room.vue puisse l'appeler
      getPosition, // Exposé pour récupérer la position actuelle
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
  border-radius: 50%;
}
</style>
