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
        x: 400,
        y: 320,
        width: 64,
        height: 64,
        image: "foodbowls/foodbowl_blue.png",
        scale: 0.6,
      },
      {
        id: "waterBowl",
        x: 470,
        y: 360,
        width: 64,
        height: 64,
        image: "waterbowls/waterbowl_blue.png",
        scale: 0.6,
      },
      {
        id: "catToy",
        x: 300,
        y: 250,
        width: 64,
        height: 64,
        image: "toytrees/CatToy.gif",
        scale: 0.7,
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
        x: 200,
        y: 270,
        width: 128,
        height: 64,
        image: "beds/bed_blue.png",
        scale: 0.8,
      },
      {
        id: "windowWhite1",
        x: 77,
        y: 167,
        width: 64,
        height: 64,
        image: "windows/window_white.png",
        scale: 1.5,
      },
      {
        id: "windowWhite2",
        x: 155,
        y: 125,
        width: 64,
        height: 64,
        image: "windows/window_white.png",
        scale: 1.5,
      },
      {
        id: "decotreeBlue",
        x: 255,
        y: 150,
        width: 64,
        height: 64,
        image: "decotrees/decotree_blue.png",
        scale: 1.4,
      },
      {
        id: "shelfBlue",
        x: 160,
        y: 260,
        width: 64,
        height: 64,
        image: "shelves/shelf_blue.png",
        scale: 1,
      },
      {
        id: "catfoodBig",
        x: 165,
        y: 270,
        width: 64,
        height: 64,
        image: "catfoodbags/catfood_big.png",
        scale: 1,
        flipHorizontal: true,
      },
      {
        id: "catPerch",
        x: 30,
        y: 255,
        width: 64,
        height: 64,
        image: "toytrees/catPerch.png",
        scale: 1.5,
      },
      {
        id: "decoCat",
        x: 85,
        y: 255,
        width: 64,
        height: 64,
        image: "decocats/decoCatSleep.png",
        scale: 0.75,
        flipHorizontal: true,
      },
    ]);

    const offsetX = -20;
    const offsetY = -50;

    const getObjectStyle = (obj) => {
      // Transformation de base avec le scale
      let transformValue = `scale(${obj.scale})`;

      // Retourne verticalement si spécifié
      if (obj.flipVertical) {
        transformValue += " scaleY(-1)";
      }

      // Retourne horizontalement si spécifié
      if (obj.flipHorizontal) {
        transformValue += " scaleX(-1)";
      }

      return {
        position: "absolute",
        left: `${obj.x + offsetX}px`,
        top: `${obj.y + offsetY}px`,
        width: `${obj.width * obj.scale}px`,
        height: `${obj.height * obj.scale}px`,
        backgroundImage: `url('/assets/objects/${obj.image}')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        transform: transformValue,
        transformOrigin: "top left",
      };
    };

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
