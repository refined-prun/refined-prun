<script setup lang="ts">
import { computed } from 'vue';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { flightsStore } from '@src/infrastructure/prun-api/data/flights';
import { formatDenseEta, hhmm } from '@src/utils/format';
import { timestampEachMinute } from '@src/utils/dayjs';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { getInvStore } from '@src/core/store-id';
import fa from '@src/utils/font-awesome.module.css';

const props = defineProps<{
  shipId: string;
}>();

const ship = computed(() => shipsStore.getById(props.shipId));
const flight = computed(() => flightsStore.getById(ship.value?.flightId));
const inventory = computed(() => getInvStore(ship.value?.idShipStore));

const timeData = computed(() => {
  const arrival = flight.value?.arrival.timestamp;
  if (arrival == null || Number.isNaN(arrival)) {
    return null;
  }
  return {
    relative: formatDenseEta(timestampEachMinute.value, arrival),
    absolute: hhmm(arrival),
  };
});

const hasItems = computed(() => (inventory.value?.items.length ?? 0) > 0);
</script>

<template>
  <div :class="$style.container">
    <template v-if="timeData">
      <div :class="$style.timeColumn" @click.stop="showBuffer(`SFC ${ship?.registration}`)">
        <span :class="$style.relativeTime">{{ timeData.relative }}</span>
        <span :class="$style.absoluteTime">({{ timeData.absolute }})</span>
      </div>
    </template>
    <template v-else>
      <div :class="$style.actions">
        <span
          :class="[$style.actionBtn, hasItems ? $style.bgOrange : $style.bgBlue]"
          data-tooltip="Open inventory"
          @click.stop="showBuffer(`SHPI ${ship?.registration}`)">
          <span :class="fa.solid">{{ hasItems ? '\uf466' : '\uf49e' }}</span>
        </span>
        <span
          :class="[$style.actionBtn, $style.bgGreen]"
          data-tooltip="Open flight control"
          @click.stop="showBuffer(`SFC ${ship?.registration}`)">
          <span :class="fa.solid">{{ '\uf072' }}</span>
        </span>
      </div>
    </template>
  </div>
</template>

<style module>
.container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  cursor: pointer;
}

.timeColumn {
  display: flex;
  flex-direction: column;
}

.relativeTime {
  color: #99d5ff;
}

.absoluteTime {
  color: #888;
}

.actions {
  display: flex;
  flex-direction: row;
  gap: 4px;
}

.actionBtn {
  display: inline-flex;
  font-size: 13px;
  height: 20px;
  width: 20px;
  padding: 2px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  color: white;
}

.bgOrange {
  background-color: #f7a600;
}

.bgBlue {
  background-color: #43a4df;
}

.bgGreen {
  background-color: #5cb85c;
}
</style>
