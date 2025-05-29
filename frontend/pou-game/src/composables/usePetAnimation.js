// src/composables/usePetAnimation.js
import { ref } from "vue";
import { usePetConfig } from "./usePetConfig";

export function usePetAnimation(movement) {
  // Récupération des données de configuration depuis usePetConfig
  const { idleRow, animationConfig, scaleActionDefault, actionSpeed } =
    usePetConfig();

  // Extraction des états et fonctions liés aux déplacements depuis le composable de mouvement
  const {
    spriteX,
    spriteY,
    petX,
    petY,
    isMoving,
    isPerformingAction,
    moveTo,
    movePetRandomly,
    spriteWidth,
  } = movement;

  // Scale utilisé pendant une action (modifiable par phase)
  const currentActionScale = ref(scaleActionDefault.value);
  // Flag d'annulation d'action
  const currentActionCancelled = ref(false);

  // Animation pour l'état idle et déplacement
  const animateSprite = () => {
    let idleFrame = 0;
    let moveFrame = 0;
    const idleTotalFrames = 6;
    const moveTotalFrames = 4;
    setInterval(() => {
      if (isMoving.value) {
        spriteX.value = moveFrame * spriteWidth;
        moveFrame = (moveFrame + 1) % moveTotalFrames;
      } else if (!isPerformingAction.value) {
        spriteX.value = idleFrame * spriteWidth;
        idleFrame = (idleFrame + 1) % idleTotalFrames;
      }
    }, 100);
  };

  // Animation d'une rangée d'action
  const animateActionRow = (
    row,
    numberOfFrames,
    frameDuration,
    loopDuration,
    onComplete
  ) => {
    let currentFrame = 0;
    spriteY.value = row;
    const startTime = Date.now();
    const intervalId = setInterval(() => {
      if (currentActionCancelled.value) {
        clearInterval(intervalId);
        return;
      }
      spriteX.value = currentFrame * spriteWidth;
      currentFrame = (currentFrame + 1) % numberOfFrames;
      if (Date.now() - startTime >= loopDuration) {
        clearInterval(intervalId);
        if (onComplete && !currentActionCancelled.value) onComplete();
      }
    }, frameDuration);
    return intervalId;
  };

  // Pour stocker l'ID de l'intervalle d'animation en cours
  let activeActionIntervalId = null;

  // Exécute une action en deux phases
  const executeAction = (type, targetX, targetY) => {
    // Annule toute action en cours
    currentActionCancelled.value = true;
    if (activeActionIntervalId) {
      clearInterval(activeActionIntervalId);
      activeActionIntervalId = null;
    }
    isPerformingAction.value = true;
    currentActionCancelled.value = false;

    const config = animationConfig[type] || {
      first: 128,
      firstFrames: 4,
      firstFrameDuration: 150,
      firstLoopDuration: 1500,
      firstScale: scaleActionDefault.value,
      second: 64,
      secondFrames: 4,
      secondFrameDuration: 150,
      secondLoopDuration: 1000,
      secondScale: scaleActionDefault.value,
    };

    moveTo(
      targetX,
      targetY,
      () => {
        // Première phase de l'action
        currentActionScale.value =
          config.firstScale || scaleActionDefault.value;
        activeActionIntervalId = animateActionRow(
          config.first,
          config.firstFrames,
          config.firstFrameDuration,
          config.firstLoopDuration,
          () => {
            // Deuxième phase de l'action
            currentActionScale.value =
              config.secondScale || scaleActionDefault.value;
            activeActionIntervalId = animateActionRow(
              config.second,
              config.secondFrames,
              config.secondFrameDuration,
              config.secondLoopDuration,
              () => {
                spriteY.value = idleRow;
                isPerformingAction.value = false;
                currentActionCancelled.value = false;
                activeActionIntervalId = null;
                currentActionScale.value = scaleActionDefault.value;
                movePetRandomly();
              }
            );
          }
        );
      },
      actionSpeed // Ici, actionSpeed est correctement défini
    );
  };

  return {
    animateSprite,
    animateActionRow,
    executeAction,
    currentActionScale,
    currentActionCancelled,
  };
}
