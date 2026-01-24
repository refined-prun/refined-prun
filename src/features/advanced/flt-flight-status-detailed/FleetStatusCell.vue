<script setup lang="ts">
import { computed } from 'vue';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { flightsStore } from '@src/infrastructure/prun-api/data/flights';
import { displaytimeBetween, hhmm } from '@src/utils/format';
import { timestampEachMinute } from '@src/utils/dayjs';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { getInvStore } from '@src/core/store-id';
import {
  getEntityNameFromAddress,
  getLocationLineFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';

const props = defineProps<{
  shipId: string;
  rowElement: HTMLTableRowElement;
}>();

const STATUS_ICONS: Record<string, string> = {
  TAKE_OFF: '↑',
  DEPARTURE: '↗',
  TRANSIT: '⟶',
  CHARGE: '±',
  JUMP: '➾',
  FLOAT: '↑',
  APPROACH: '↘',
  LANDING: '↓',
  LOCK: '⟴',
  DECAY: '⟴',
  JUMP_GATEWAY: '⟴',
};

const ship = computed(() => shipsStore.getById(props.shipId));
const flight = computed(() => flightsStore.getById(ship.value?.flightId));
const inventory = computed(() => getInvStore(ship.value?.idShipStore));

const statusIcon = computed(() => {
  if (!ship.value) return '';
  if (!flight.value) return '⦁';
  const segment = flight.value.segments[flight.value.currentSegmentIndex];
  return segment ? STATUS_ICONS[segment.type] || '?' : '⦁';
});

const posData = computed(() => {
  const address = flight.value?.destination ?? ship.value?.address ?? undefined;
  const location = getLocationLineFromAddress(address);
  const prefix = location?.type === 'STATION' ? 'STNS' : 'PLI';
  return {
    name: getEntityNameFromAddress(address) || address?.lines[0]?.entity.naturalId || '',
    command: `${prefix} ${location?.entity.naturalId}`,
    invCommand: `INV ${location?.entity.naturalId}`,
  };
});

const timeData = computed(() => {
  const arrival = flight.value?.arrival.timestamp;
  if (!arrival || Number.isNaN(arrival)) return null;
  return {
    relative: displaytimeBetween(timestampEachMinute.value, arrival),
    absolute: hhmm(arrival),
  };
});

const hasItems = computed(() => (inventory.value?.items.length ?? 0) > 0);

const handleUnloadAction = () => {
  const buttons = props.rowElement.children[8]?.querySelectorAll(
    'button, .button, [role="button"]',
  );
  const unloadButton = buttons?.[3] as HTMLElement;
  if (unloadButton && hasItems.value) {
    unloadButton.click();
  } else {
    showBuffer(`SHPI ${ship.value?.registration}`);
  }
};
</script>

<template>
  <div :class="$style.mainContainer">
    <div :class="[$style.columnContainer, $style.alignLeft]">
      <div :class="$style.gapContainer">
        <span
          @click.stop="showBuffer(posData.invCommand)"
          :class="C.Link.link"
          style="color: #3fa2de"
          >☒</span
        >
        <span
          @click.stop="showBuffer(`SFC ${ship?.registration}`)"
          style="color: #3fa2de; cursor: pointer"
          >{{ statusIcon }}</span
        >
      </div>
      <div @click.stop="showBuffer(posData.command)" :class="C.Link.link" style="color: #3fa2de">
        {{ posData.name }}
      </div>
    </div>

    <div :class="[$style.columnContainer, $style.alignRight]">
      <template v-if="timeData">
        <div @click.stop="showBuffer(`SFC ${ship?.registration}`)" :class="$style.columnContainer">
          <span style="color: #99d5ff">{{ timeData.relative }}</span>
          <span style="color: #888">({{ timeData.absolute }})</span>
        </div>
      </template>
      <template v-else>
        <div :class="[$style.gapContainer, $style.rowContainer]">
          <span
            :class="[$style.actionBtn, hasItems ? $style.bgOrange : $style.bgBlue]"
            :style="{ paddingRight: '5px' }"
            @click.stop="handleUnloadAction">
            {{ hasItems ? '⭱' : '⭳' }}
          </span>
          <span
            :class="[$style.actionBtn, $style.bgGreen]"
            @click.stop="showBuffer(`SFC ${ship?.registration}`)">
            ✈
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<style module>
.mainContainer {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.columnContainer {
  display: flex;
  flex-direction: column;
  cursor: pointer;
}
.rowContainer {
  display: flex;
  flex-direction: row;
}
.alignLeft {
  align-items: flex-start;
}
.alignRight {
  align-items: flex-end;
  text-align: right;
}
.gapContainer {
  display: flex;
  gap: 4px;
}
.actionBtn {
  font-size: 15px;
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
