<script setup lang="ts">
import { computed } from 'vue';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { flightsStore } from '@src/infrastructure/prun-api/data/flights';
import { timestampLive } from '@src/utils/dayjs';
import { formatEta } from '@src/utils/format';

const props = defineProps({
  shipRegistration: {
    type: String,
    required: false,
    default: undefined,
  },
});

const ship = computed(() => shipsStore.getByRegistration(props.shipRegistration));
const flight = computed(() => flightsStore.getById(ship.value?.flightId));
const eta = computed(() =>
  flight.value ? formatEta(timestampLive(), flight.value.arrival.timestamp) : undefined,
);
</script>

<template>
  <span v-if="eta"> ({{ eta }})</span>
</template>
