<script setup lang="ts">
import { computed } from 'vue';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { flightsStore } from '@src/infrastructure/prun-api/data/flights';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { getShipStatusIcon, stationaryShipStatusIcon } from '@src/core/ship-status-icons';
import {
  getEntityNameFromAddress,
  getLocationLineFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';

const props = defineProps<{
  shipId: string;
}>();

const ship = computed(() => shipsStore.getById(props.shipId));
const flight = computed(() => flightsStore.getById(ship.value?.flightId));

const statusIcon = computed(() => {
  if (!ship.value) {
    return '';
  }
  if (!flight.value) {
    return stationaryShipStatusIcon;
  }
  const segment = flight.value.segments[flight.value.currentSegmentIndex];
  return segment != null ? getShipStatusIcon(segment.type) : stationaryShipStatusIcon;
});

const posData = computed(() => {
  const address = flight.value?.destination ?? ship.value?.address ?? undefined;
  const location = getLocationLineFromAddress(address);
  const prefix = location?.type === 'STATION' ? 'STNS' : 'PLI';
  return {
    name: getEntityNameFromAddress(address) || address?.lines[0]?.entity?.naturalId || '',
    command: `${prefix} ${location?.entity.naturalId}`,
    invCommand: `INV ${location?.entity.naturalId}`,
  };
});
</script>

<template>
  <div :class="$style.container">
    <div :class="$style.icons">
      <span :class="C.Link.link" style="color: #3fa2de" @click.stop="showBuffer(posData.invCommand)"
        >☒</span
      >
      <span
        style="color: #3fa2de; cursor: pointer"
        @click.stop="showBuffer(`SFC ${ship?.registration}`)"
        >{{ statusIcon }}</span
      >
    </div>
    <div :class="C.Link.link" style="color: #3fa2de" @click.stop="showBuffer(posData.command)">
      {{ posData.name }}
    </div>
  </div>
</template>

<style module>
.container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  cursor: pointer;
}

.icons {
  display: flex;
  gap: 4px;
}
</style>
