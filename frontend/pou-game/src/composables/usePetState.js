import { ref, onMounted, onUnmounted } from "vue";
import apiService from "../services/api";

export function usePetState() {
  // État réactif initial
  const gauges = ref({
    hunger: 100,
    thirst: 100,
    energy: 100,
    happiness: 100,
    posX: 256,
    posY: 320,
  });
  const currentAction = ref(null);
  const actionInterval = ref(null);
  let stateInterval = null;

  // Configuration indépendante de décrémentation
  const decrementSettings = {
    hunger: { interval: 15000, amount: 1 },
    thirst: { interval: 10000, amount: 1 },
    energy: { interval: 20000, amount: 1 },
    happiness: { interval: 30000, amount: 1 },
  };
  const decrementIntervals = {};

  // Démarre la décrémentation pour chaque gauge
  const startDecrement = () => {
    Object.keys(decrementSettings).forEach((gaugeKey) => {
      if (!decrementIntervals[gaugeKey]) {
        decrementIntervals[gaugeKey] = setInterval(() => {
          if (!currentAction.value) {
            gauges.value[gaugeKey] = Math.max(
              0,
              gauges.value[gaugeKey] - decrementSettings[gaugeKey].amount
            );
            apiService
              .updateState({ [gaugeKey]: gauges.value[gaugeKey] })
              .then(() => {
                console.log(
                  `⏳ Décrément de ${gaugeKey} appliqué, nouvelle valeur = ${gauges.value[gaugeKey]}`
                );
              });
          }
        }, decrementSettings[gaugeKey].interval);
      }
    });
  };

  const stopDecrement = () => {
    Object.keys(decrementIntervals).forEach((gaugeKey) => {
      if (decrementIntervals[gaugeKey]) {
        clearInterval(decrementIntervals[gaugeKey]);
        decrementIntervals[gaugeKey] = null;
        console.log(`⏹ Décrément de ${gaugeKey} arrêté`);
      }
    });
  };

  // Récupère l'état depuis le backend
  const fetchState = async () => {
    const data = await apiService.getState();
    if (data) {
      gauges.value = { ...data };
      console.log("✅ État mis à jour depuis le backend :", gauges.value);
    }
  };

  // Polling toutes les 60 sec pour synchroniser l'état
  const startStateUpdates = () => {
    stateInterval = setInterval(fetchState, 60000);
  };

  onMounted(() => {
    fetchState();
    startStateUpdates();
    startDecrement();
  });

  onUnmounted(() => {
    if (stateInterval) clearInterval(stateInterval);
    stopDecrement();
    if (actionInterval.value) clearInterval(actionInterval.value);
  });

  /*  
    triggerAction : lance une action (ex. 'eat', 'drink', 'sleep', 'play').
    Pendant l'action, la décrémentation est suspendue.
    L'incrémentation progressive fait monter la gauge jusqu'à 100 sur 10 sec (200ms/tick).
    Grâce à un clamp, dès que la valeur atteint ou dépasse 100, on la fixe à 100 et on arrête l'action.
  */
  function triggerAction({ type, x, y }) {
    // Annuler toute action en cours pour éviter le spam et les actions concurrentes
    if (actionInterval.value) {
      clearInterval(actionInterval.value);
      actionInterval.value = null;
    }
    currentAction.value = type;

    // Mise à jour des coordonnées pour le déplacement (utilisé par Room et envoyé au backend)
    if (typeof x === "number" && typeof y === "number") {
      gauges.value.posX = x;
      gauges.value.posY = y;
    }

    const gaugeMap = {
      eat: "hunger",
      drink: "thirst",
      sleep: "energy",
      play: "happiness",
    };
    const gaugeKey = gaugeMap[type];
    if (!gaugeKey) return;

    const targetValue = 100;
    const startValue = gauges.value[gaugeKey];

    // Si la valeur est déjà à 100, aucune animation n'est lancée
    if (startValue >= targetValue) return;

    const totalDuration = 10000; // 10 secondes pour l'action
    const tickInterval = 200; // mise à jour toutes les 200 ms
    const totalTicks = totalDuration / tickInterval;
    const incrementStep = (targetValue - startValue) / totalTicks;
    let lastPersistedValue = startValue;

    actionInterval.value = setInterval(() => {
      // Incrémente seulement si la valeur est strictement en dessous de targetValue
      if (gauges.value[gaugeKey] < targetValue) {
        gauges.value[gaugeKey] += incrementStep;
        if (gauges.value[gaugeKey] > targetValue) {
          gauges.value[gaugeKey] = targetValue;
        }
      }
      // Envoi une mise à jour dès qu'une augmentation cumulée d'au moins 5 points est réalisée
      if (gauges.value[gaugeKey] - lastPersistedValue >= 5) {
        lastPersistedValue = gauges.value[gaugeKey];
        apiService
          .updateState({
            [gaugeKey]: gauges.value[gaugeKey],
            posX: gauges.value.posX,
            posY: gauges.value.posY,
          })
          .then((updated) => {
            console.log(
              `✅ Mise à jour envoyée : ${gaugeKey} = ${gauges.value[gaugeKey]}, posX = ${gauges.value.posX}, posY = ${gauges.value.posY}`
            );
          })
          .catch((err) => {
            console.error(
              "Erreur lors de l'update intermédiaire :",
              err.message
            );
          });
      }
      // Si la gauge atteint 100, on arrête l'action, on envoie la mise à jour finale et on redémarre la décrémentation
      if (gauges.value[gaugeKey] >= targetValue) {
        clearInterval(actionInterval.value);
        actionInterval.value = null;
        apiService
          .updateState({
            [gaugeKey]: targetValue,
            posX: gauges.value.posX,
            posY: gauges.value.posY,
          })
          .then((updated) => {
            console.log(
              `✅ Valeur finale persistée : ${gaugeKey} = ${targetValue}`,
              updated
            );
            fetchState();
            currentAction.value = null;
            startDecrement();
          })
          .catch((err) => {
            console.error("Erreur lors de l'update final :", err.message);
          });
      }
    }, tickInterval);
  }

  return { gauges, triggerAction };
}
