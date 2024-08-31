<script setup lang="ts">
import { computed } from 'vue';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { flightsStore } from '@src/infrastructure/prun-api/data/flights';
import { dayjsLive } from '@src/utils/dayjs';
import { hhmm } from '@src/utils/format';

const props = defineProps({
  shipRegistration: {
    type: String,
    required: false,
    default: undefined,
  },
});

const ship = computed(() => shipsStore.getByRegistration(props.shipRegistration));
const flight = computed(() => flightsStore.getById(ship.value?.flightId));
const eta = computed(() => formatEta(flight.value?.arrival.timestamp));

function formatEta(timestamp: number | undefined) {
  if (!timestamp) {
    return undefined;
  }

  let ret = hhmm(timestamp);
  const diffDays = -dayjsLive().diff(timestamp, 'days');
  if (diffDays > 0) {
    ret += ` +${diffDays}d`;
  }
  return ret;
}
</script>

<template>
  <span v-if="eta"> ({{ eta }})</span>
</template>
