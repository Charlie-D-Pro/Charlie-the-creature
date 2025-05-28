<template>
  <div class="pet-container" :style="petStyle">
    <!-- ✅ Point de référence temporaire pour vérification -->
    <div class="control-point" :style="controlStyle"></div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";

export default defineComponent({
  setup() {
    const petX = ref(256);
    const petY = ref(320);
    const spriteX = ref(0);
    const spriteY = ref(0);
    const totalFrames = 6;
    const spriteWidth = 64;
    const spriteHeight = 64;
    const isMoving = ref(false);

    let hitboxPoints = [];

    const controlOffsetX = ref(20);
    const controlOffsetY = ref(64);

    const getHitboxCoordinates = () => {
      const polygon = document.querySelector(".hitbox polygon");
      if (!polygon) return;

      hitboxPoints = polygon
        .getAttribute("points")
        .split(" ")
        .map((point) => {
          const [x, y] = point.split(",").map(Number);
          return { x, y };
        });

      console.log("📌 Points de la hitbox chargés :", hitboxPoints);
    };

    const controlX = computed(() => petX.value + controlOffsetX.value);
    const controlY = computed(() => petY.value + controlOffsetY.value);
    console.log(
      `📌 Point de contrôle réel : (${controlX.value}, ${controlY.value})`
    );

    const controlStyle = computed(() => ({
      position: "absolute",
      left: `${controlOffsetX.value}px`,
      top: `${controlOffsetY.value}px`,
      transform: "translate(-50%, -50%)",
      backgroundColor: "green",
      width: "5px",
      height: "5px",
      borderRadius: "50%",
    }));

    const isInsideHitbox = (x, y) => {
      if (!hitboxPoints.length) return true;

      let inside = false;
      for (
        let i = 0, j = hitboxPoints.length - 1;
        i < hitboxPoints.length;
        j = i++
      ) {
        const xi = hitboxPoints[i].x,
          yi = hitboxPoints[i].y;
        const xj = hitboxPoints[j].x,
          yj = hitboxPoints[j].y;

        const intersect =
          yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }

      return inside;
    };

    const savePosition = () => {
      localStorage.setItem(
        "petPosition",
        JSON.stringify({ x: petX.value, y: petY.value })
      );
      console.log("💾 Position sauvegardée :", petX.value, petY.value);
    };

    const movePet = () => {
      let newX, newY;
      let attempts = 0;

      do {
        const directionX = Math.random() < 0.5 ? -1 : 1;
        const directionY = Math.random() < 0.5 ? -1 : 1;

        newX = petX.value + (Math.floor(Math.random() * 100) - 50) * directionX;
        newY = petY.value + (Math.floor(Math.random() * 100) - 50) * directionY;
        attempts++;

        if (attempts > 50) {
          console.warn("❌ Impossible de trouver une position valide !");
          return;
        }
      } while (
        !isInsideHitbox(
          newX + controlOffsetX.value,
          newY + controlOffsetY.value
        )
      );

      petX.value = newX;
      petY.value = newY;
      savePosition(); // ✅ Sauvegarde après déplacement

      spriteY.value = 320;
      isMoving.value = true;

      setTimeout(() => {
        isMoving.value = false;
        spriteY.value = 0;
      }, 800);

      setTimeout(movePet, Math.random() * (10000 - 5000) + 5000);
    };

    const animatePet = () => {
      let frame = 0;
      setInterval(() => {
        spriteX.value = frame * spriteWidth;
        frame = (frame + 1) % totalFrames;
      }, 100);
    };

    // ✅ Réinitialisation après 5 minutes d'inactivité
    const resetPosition = () => {
      petX.value = 320; // ✅ Point central du losange
      petY.value = 240;
      savePosition();
      console.log("🔄 Position réinitialisée après 5 minutes d'inactivité.");
    };

    let inactivityTimer;
    const resetAfterTimeout = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(resetPosition, 5 * 60 * 1000); // ✅ 5 minutes
    };

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) resetAfterTimeout();
    });

    onMounted(() => {
      const savedPosition = localStorage.getItem("petPosition");

      if (savedPosition) {
        const { x, y } = JSON.parse(savedPosition);
        petX.value = x;
        petY.value = y;
        console.log("🔄 Position restaurée :", x, y);

        // ✅ Relancer le déplacement après la restauration
        setTimeout(movePet, Math.random() * (10000 - 5000) + 5000);
      } else {
        console.log("ℹ️ Aucune position enregistrée, chargement par défaut.");
        movePet(); // ✅ Le sprite bouge normalement s'il n'a pas de position stockée
      }

      getHitboxCoordinates();
      animatePet();
    });

    const petStyle = computed(() => ({
      position: "absolute",
      left: `${petX.value}px`,
      top: `${petY.value}px`,
      width: "64px",
      height: "64px",
      backgroundImage: "url('/assets/cat_spritesheet.png')",
      backgroundPosition: `-${spriteX.value}px -${spriteY.value}px`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "auto",
      transform: isMoving.value ? "scale(1.0)" : "scale(0.9)",
      transition: "left 1.2s ease, top 1.2s ease",
    }));

    return { petStyle, controlStyle };
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
