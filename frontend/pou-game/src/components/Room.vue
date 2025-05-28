<template>
  <div class="room-container">
    <img src="/assets/room.png" alt="Room Background" class="room-bg" />

    <!-- ✅ Losange SVG basé sur tes données -->
    <svg
      class="hitbox"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      <polygon
        points="257,197 493,323 258,443 20,323"
        fill="red"
        opacity="0.3"
        stroke="black"
        stroke-width="2"
      />
    </svg>

    <Pet />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Pet from "./Pet.vue";

export default defineComponent({
  components: { Pet },
});
</script>

<style scoped>
.room-container {
  position: relative;
  width: 512px;
  height: 512px;
}

.room-bg {
  width: 100%;
  height: 100%;
}

.hitbox {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: auto;
}
</style>
