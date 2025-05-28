import { ref } from "vue";

const petX = ref(150);
const petY = ref(220);
const spriteX = ref(0);
const spriteY = ref(320);

const executeAction = (type) => {
  let targetX, targetY, actionSprite;

  switch (type) {
    case "hunger":
      targetX = 300;
      targetY = 250;
      actionSprite = 384; // ✅ Animation "Manger"
      break;
    case "thirst":
      targetX = 350;
      targetY = 240;
      actionSprite = 448; // ✅ Animation "Boire"
      break;
    case "energy":
      targetX = 100;
      targetY = 200;
      actionSprite = 512; // ✅ Animation "Dormir"
      break;
    case "health":
      targetX = 200;
      targetY = 220;
      actionSprite = 576; // ✅ Animation "Se soigner"
      break;
  }

  petX.value = targetX;
  petY.value = targetY;
  spriteY.value = actionSprite;

  setTimeout(() => {
    spriteY.value = 320; // ✅ Retour à l’état normal
  }, 2000);
};

export default { executeAction };
