<script setup lang="ts">
import { computed } from 'vue';
import { shipsStore } from '@src/prun-api/data/ships';
import { flightsStore } from '@src/prun-api/data/flights';

const props = defineProps({
  shipRegistration: {
    type: String,
    required: false,
    default: undefined,
  },
});

const ship = computed(() => shipsStore.getByRegistration(props.shipRegistration));
const flight = computed(() => flightsStore.getById(ship.value?.flightId));

const status = computed(() => {
  if (!flight.value) {
    return '⦁';
  }

  const segment = flight.value.segments[flight.value.currentSegmentIndex];
  if (!segment) {
    return '???';
  }

  return labels[segment.type] ?? '???';
});

const labels = {
  TAKE_OFF: '↑',
  DEPARTURE: '↗',
  CHARGE: '±',
  JUMP: '⟿',
  APPROACH: '↘',
  LANDING: '↓',
};
</script>

<template>
  <div :class="$style.label">{{ status }}</div>
</template>

<style module>
.label {
  text-align: center;
}
</style>
