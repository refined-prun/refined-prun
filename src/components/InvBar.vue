<script setup lang="ts">
import CargoBar from '@src/components/CargoBar.vue';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { getInboundShipStores } from '@src/core/burn';
import { StorageAlarmLevel } from '@src/core/storage-analysis';

const props = defineProps<{
  storeId: string;
  onClickCmd: string;
  naturalId?: string;
  includeInboundShips?: boolean;
  alarmLevel?: StorageAlarmLevel;
  alarmReason?: string;
}>();

const combinedStore = computed(() => {
  const primary = storagesStore.getById(props.storeId);
  if (primary === undefined) {
    return undefined;
  }

  if (!props.includeInboundShips) {
    return primary;
  }

  const inbound = getInboundShipStores(props.naturalId);
  if (inbound.length === 0) {
    return primary;
  }

  const stores = [primary, ...inbound];
  return {
    ...primary,
    items: stores.flatMap(x => x.items),
    weightLoad: sumBy(stores, x => x.weightLoad),
    volumeLoad: sumBy(stores, x => x.volumeLoad),
  };
});
</script>

<template>
  <CargoBar
    :store="combinedStore"
    disable-overflow
    :data-tooltip="alarmReason"
    :data-tooltip-position="alarmReason ? 'top' : undefined"
    @click="showBuffer(onClickCmd)">
    <template #overlay>
      <div v-if="alarmLevel === 'red'" :class="$style.alarmOverlay" />
    </template>
  </CargoBar>
</template>

<style module>
/* A real element avoids a conflict with the game's tooltip pseudo-elements. */
.alarmOverlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  background-image: repeating-linear-gradient(
    45deg,
    transparent 0,
    transparent 6px,
    rgba(217, 83, 79, 0.8) 6px,
    rgba(217, 83, 79, 0.8) 12px
  );
  outline: 2px solid #000;
  outline-offset: -2px;
}
</style>
