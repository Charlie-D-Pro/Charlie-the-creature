// EmotionHandler.js

export default {
  getEmotion(state) {
    if (state.hunger <= 20 || state.energy <= 20 || state.cleanliness <= 20) {
      return "sad";
    } else if (
      state.hunger >= 80 &&
      state.energy >= 80 &&
      state.cleanliness >= 80
    ) {
      return "happy";
    } else {
      return "neutral";
    }
  },

  getMouth(state) {
    if (state.hunger <= 20 || state.energy <= 20 || state.cleanliness <= 20) {
      return "frown";
    } else if (
      state.hunger >= 80 &&
      state.energy >= 80 &&
      state.cleanliness >= 80
    ) {
      return "smile";
    } else {
      return "normal";
    }
  },

  getEmotionColor(state) {
    if (state.hunger <= 20 || state.energy <= 20 || state.cleanliness <= 20) {
      return "red";
    } else if (
      state.hunger >= 80 &&
      state.energy >= 80 &&
      state.cleanliness >= 80
    ) {
      return "green";
    } else {
      return "yellow";
    }
  },
};
