<template>
  <div class="gauges-container">
    <div class="gauge" v-for="key in gaugeKeys" :key="key">
      <label class="gauge-label">{{ key }}</label>
      <div class="progress-bar">
        <div
          class="progress"
          :style="{
            width: gauges[key] + '%',
            backgroundColor: getGaugeColor(gauges[key]),
          }"
        ></div>
      </div>
      <span class="gauge-value">{{ Math.round(gauges[key]) }}%</span>
    </div>
    <div class="position">
      <p>PosX: {{ gauges.posX }}, PosY: {{ gauges.posY }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Gauges",
  props: {
    gauges: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      // On affiche uniquement les gauges souhaitées
      gaugeKeys: ["hunger", "thirst", "energy", "happiness"],
    };
  },
  methods: {
    // Fonction qui interpole linéairement entre deux couleurs c1 et c2
    interpolateColor(c1, c2, factor) {
      const r = Math.round(c1.r + (c2.r - c1.r) * factor);
      const g = Math.round(c1.g + (c2.g - c1.g) * factor);
      const b = Math.round(c1.b + (c2.b - c1.b) * factor);
      return `rgb(${r}, ${g}, ${b})`;
    },
    // Renvoie la couleur interpolée en fonction de la valeur
    getGaugeColor(value) {
      if (value >= 55) {
        return "#00ff00"; // vert
      } else if (value >= 50 && value < 55) {
        // Interpolation de vert (#00ff00) à jaune (#ffff00)
        let factor = (55 - value) / 5; // factor varie de 0 (value=55) à 1 (value=50)
        return this.interpolateColor(
          { r: 0, g: 255, b: 0 },
          { r: 255, g: 255, b: 0 },
          factor
        );
      } else if (value >= 35 && value < 50) {
        // Interpolation de jaune (#ffff00) à orange (#ff8000)
        let factor = (50 - value) / 15; // factor varie de 0 (value=50) à 1 (value=35)
        return this.interpolateColor(
          { r: 255, g: 255, b: 0 },
          { r: 255, g: 128, b: 0 },
          factor
        );
      } else if (value >= 20 && value < 35) {
        // Interpolation d'orange (#ff8000) à rouge (#ff0000)
        let factor = (35 - value) / 15; // factor varie de 0 (value=35) à 1 (value=20)
        return this.interpolateColor(
          { r: 255, g: 128, b: 0 },
          { r: 255, g: 0, b: 0 },
          factor
        );
      } else {
        return "#ff0000"; // rouge
      }
    },
  },
};
</script>

<style scoped>
.gauges-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 90%;
  max-width: 512px;
}

.gauge {
  display: flex;
  align-items: center;
  gap: 10px;
}

.gauge-label {
  flex-basis: 80px;
  text-align: right;
  font-weight: bold;
}

.progress-bar {
  flex: 1;
  height: 10px;
  background-color: #ddd;
  border-radius: 5px;
  overflow: hidden;
}

.progress {
  height: 100%;
  transition: width 0.1s linear;
}

.gauge-value {
  width: 40px;
  text-align: left;
}

.position {
  font-size: 0.9em;
  color: #555;
}
</style>
