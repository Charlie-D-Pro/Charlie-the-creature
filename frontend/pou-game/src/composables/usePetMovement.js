// src/composables/usePetMovement.js
import { ref, computed } from "vue";
import { usePetConfig } from "./usePetConfig";

export function usePetMovement() {
  const { forbiddenZones, spriteWidth, idleRow, randomSpeed, actionSpeed } =
    usePetConfig();

  // États réactifs du sprite
  const petX = ref(256);
  const petY = ref(320);
  const spriteX = ref(0);
  const spriteY = ref(idleRow);
  const isMoving = ref(false);
  const isPerformingAction = ref(false);

  // Offsets pour le point de contrôle
  const controlOffsetX = ref(20);
  const controlOffsetY = ref(64);

  // Gestion de la hitbox
  let hitboxPoints = [];
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
  };

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

  // Fonctions de déplacement
  let moveToTimeoutId = null;
  const moveTo = (x, y, callback, speed = 200) => {
    const dx = x - petX.value;
    const dy = y - petY.value;
    const distance = Math.hypot(dx, dy);
    const duration = Math.max((distance / speed) * 1000, 400);
    // On met à jour la durée pour la transition (en secondes)
    moveDurationSeconds.value = duration / 1000;
    isMoving.value = true;
    spriteY.value = 320; // Ligne d'animation de marche
    petX.value = x;
    petY.value = y;
    moveToTimeoutId = setTimeout(() => {
      isMoving.value = false;
      spriteY.value = idleRow;
      if (callback) callback();
    }, duration);
    return duration / 1000;
  };

  const movePetRandomly = () => {
    if (isPerformingAction.value) {
      setTimeout(movePetRandomly, 500);
      return;
    }
    let newX,
      newY,
      attempts = 0;
    do {
      const directionX = Math.random() < 0.5 ? -1 : 1;
      const directionY = Math.random() < 0.5 ? -1 : 1;
      newX = petX.value + (Math.floor(Math.random() * 100) - 50) * directionX;
      newY = petY.value + (Math.floor(Math.random() * 100) - 50) * directionY;
      attempts++;
      if (attempts > 50) {
        console.warn("❌ Position non trouvée !");
        return;
      }
    } while (
      !isInsideHitbox(
        newX + controlOffsetX.value,
        newY + controlOffsetY.value
      ) ||
      isTooCloseToForbiddenZone(newX, newY)
    );
    moveTo(
      newX,
      newY,
      () => {
        setTimeout(movePetRandomly, Math.random() * (10000 - 5000) + 5000);
      },
      randomSpeed
    );
  };

  // Timeout réactif de déplacement pour les transitions CSS
  const moveDurationSeconds = ref(0);

  // Style pour le point de contrôle
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

  return {
    petX,
    petY,
    spriteX,
    spriteY,
    isMoving,
    isPerformingAction,
    getHitboxCoordinates,
    isInsideHitbox,
    moveTo,
    movePetRandomly,
    controlOffsetX,
    controlOffsetY,
    controlStyle,
    moveDurationSeconds,
    spriteWidth,
  };

  // Petite fonction utilitaire pour la zone interdite
  function isTooCloseToForbiddenZone(x, y, minDistance = 50) {
    return forbiddenZones.some((zone) => {
      const distance = Math.hypot(x - zone.x, y - zone.y);
      return distance < minDistance;
    });
  }
}
