// src/composables/usePetConfig.js
import { ref } from "vue";

export function usePetConfig() {
  // Zones interdites (les coins de la hitbox)
  const forbiddenZones = [
    { x: 257, y: 197 },
    { x: 493, y: 323 },
    { x: 258, y: 443 },
    { x: 20, y: 323 },
  ];

  // Paramètres généraux
  const spriteWidth = 64;
  const idleRow = 0;

  // Vitesse en pixels par seconde
  const randomSpeed = 50;
  const actionSpeed = 100;

  // Réglages de scale pour chaque état (réactifs pour être modifiables dynamiquement)
  const scaleIdle = ref(0.7);
  const scaleMoving = ref(0.85);
  const scaleActionDefault = ref(0.85);

  // Configuration des animations pour les actions
  const animationConfig = {
    eat: {
      first: 960,
      firstFrames: 5,
      firstFrameDuration: 170,
      firstLoopDuration: 15000,
      firstScale: 0.8,
      second: 128,
      secondFrames: 1,
      secondFrameDuration: 150,
      secondLoopDuration: 10000,
      secondScale: 0.7,
    },
    drink: {
      first: 960,
      firstFrames: 5,
      firstFrameDuration: 170,
      firstLoopDuration: 15000,
      firstScale: 0.8,
      second: 128,
      secondFrames: 1,
      secondFrameDuration: 150,
      secondLoopDuration: 10000,
      secondScale: 0.7,
    },
    sleep: {
      first: 192,
      firstFrames: 4,
      firstFrameDuration: 200,
      firstLoopDuration: 15000,
      firstScale: 0.7,
      second: 704,
      secondFrames: 4,
      secondFrameDuration: 150,
      secondLoopDuration: 4000,
      secondScale: 0.7,
    },
    play: {
      first: 1152,
      firstFrames: 7,
      firstFrameDuration: 150,
      firstLoopDuration: 15000,
      firstScale: 0.8,
      second: 256,
      secondFrames: 4,
      secondFrameDuration: 150,
      secondLoopDuration: 8000,
      secondScale: 0.8,
    },
  };

  return {
    forbiddenZones,
    spriteWidth,
    idleRow,
    randomSpeed,
    actionSpeed,
    scaleIdle,
    scaleMoving,
    scaleActionDefault,
    animationConfig,
  };
}
