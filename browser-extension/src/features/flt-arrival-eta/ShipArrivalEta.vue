<script setup lang="ts">
import usePrunSelector from '@src/hooks/use-prun-selector';
import { selectShipByRegistration } from '@src/prun-api/data/ships';
import { computed } from 'vue';
import { selectFlightById } from '@src/prun-api/data/flights';
import { hourFormatter } from '@src/util';

const props = defineProps({
  shipRegistration: {
    type: String,
    required: false,
    default: undefined,
  },
});

const ship = usePrunSelector(s =>
  props.shipRegistration ? selectShipByRegistration(s, props.shipRegistration) : undefined,
);
const flight = usePrunSelector(s =>
  ship.value?.flightId ? selectFlightById(s, ship.value?.flightId) : undefined,
);

const eta = computed(() =>
  flight.value ? calculateEta(flight.value.arrival.timestamp) : undefined,
);

function calculateEta(timestamp: number) {
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
