<script>
import { ref } from "vue";

const petX = ref(150);
const petY = ref(220);
const spriteX = ref(0);
const spriteY = ref(320);

const executeAction = (type) => {
  let targetX, targetY;

  switch (type) {
    case "hunger":
      targetX = 300; // ✅ Position de la gamelle
      targetY = 250;
      spriteY.value = 384; // ✅ Animation "Manger"
      break;
    case "thirst":
      targetX = 350; // ✅ Position de l’eau
      targetY = 240;
      spriteY.value = 448; // ✅ Animation "Boire"
      break;
    case "energy":
      targetX = 100; // ✅ Position du lit
      targetY = 200;
      spriteY.value = 512; // ✅ Animation "Dormir"
      break;
    case "health":
      targetX = 200; // ✅ Position des soins
      targetY = 220;
      spriteY.value = 576; // ✅ Animation "Se soigner"
      break;
  }

  petX.value = targetX;
  petY.value = targetY;

  setTimeout(() => {
    spriteY.value = 320; // ✅ Retour à l’état normal
  }, 2000);
};

export default { executeAction };
</script>
