<template>
  <div class="objects-container">
    <div
      v-for="obj in objects"
      :key="obj.id"
      class="object"
      :style="getObjectStyle(obj)"
    ></div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const objects = ref([
      {
        id: "foodBowl",
        x: 200,
        y: 275,
        width: 64,
        height: 64,
        image: "foodbowls/foodbowl_blue.png",
        scale: 0.6,
      },
      {
        id: "waterBowl",
        x: 175,
        y: 290,
        width: 64,
        height: 64,
        image: "waterbowls/waterbowl_blue.png",
        scale: 0.6,
      },
      {
        id: "toyTree",
        x: 320,
        y: 240,
        width: 64,
        height: 64,
        image: "toytrees/toytree_blue.png",
        scale: 1.0,
      },
      {
        id: "bed",
        x: 248,
        y: 238,
        width: 128,
        height: 64,
        image: "beds/bed_blue.png",
        scale: 0.8,
      },
    ]);

    const offsetX = -20;
    const offsetY = -50;

    const getObjectStyle = (obj) => ({
      position: "absolute",
      left: `${obj.x + offsetX}px`,
      top: `${obj.y + offsetY}px`,
      width: `${obj.width * obj.scale}px`, // ✅ Taille ajustée avec `scale`
      height: `${obj.height * obj.scale}px`, // ✅ Taille ajustée avec `scale`
      backgroundImage: `url('/assets/objects/${obj.image}')`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
      transform: `scale(${obj.scale})`, // ✅ Transformation appliquée
      transformOrigin: "top left", // ✅ Évite les décalages lors du scale
    });

    return { objects, getObjectStyle };
  },
});
</script>

<style scoped>
.objects-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.object {
  position: absolute;
}
</style>
