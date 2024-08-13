<script setup lang="ts">
import { computed } from 'vue';
import { shipsStore } from '@src/prun-api/data/ships';
import { flightsStore } from '@src/prun-api/data/flights';
import { hourFormatter } from '@src/util';

const props = defineProps({
  shipRegistration: {
    type: String,
    required: false,
    default: undefined,
  },
});

const ship = computed(() => shipsStore.getByRegistration(props.shipRegistration));
const flight = computed(() => flightsStore.getById(ship.value?.flightId));
const eta = computed(() => calculateEta(flight.value?.arrival.timestamp));

function calculateEta(timestamp: number | undefined) {
  if (!timestamp) {
    return undefined;
  }
  const eta = new Date(timestamp);
  const now = new Date();
  const diffTime = Math.abs(eta.getTime() - now.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let ret = hourFormatter.format(eta);
  if (diffDays > 0) {
    ret += ` +${diffDays}d`;
  }
  return ret;
}
</script>

<template>
  <span v-if="eta"> ({{ eta }})</span>
</template>
