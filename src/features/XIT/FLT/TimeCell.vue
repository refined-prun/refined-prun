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
        <div
          :class="[$style.actionBtn, hasItems ? $style.bgOrange : $style.bgBlue]"
          data-tooltip="Open inventory"
          data-tooltip-position="top"
          @click.stop="showBuffer(`SHPI ${ship?.registration}`)">
          <span :class="[$style.actionBtnIcon, fa.solid]">
            {{ hasItems ? '\uf466' : '\uf49e' }}
          </span>
        </div>
        <div
          :class="[$style.actionBtn, $style.bgGreen]"
          data-tooltip="Open flight control"
          data-tooltip-position="top"
          @click.stop="showBuffer(`SFC ${ship?.registration}`)">
          <span :class="[$style.actionBtnIcon, fa.solid]">
            {{ '\uf072' }}
          </span>
        </div>
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
  height: 20px;
  width: 20px;
  cursor: pointer;
}

.actionBtnIcon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 13px;
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
