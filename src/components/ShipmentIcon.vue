<script setup lang="ts">
import ColoredIcon, { ColoredIconSize } from '@src/components/ColoredIcon.vue';
import { contractsStore } from '@src/infrastructure/prun-api/data/contracts';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import {
  getDestinationFullName,
  getDestinationName,
} from '@src/infrastructure/prun-api/data/addresses';

const { shipmentId, size = 'large' } = defineProps<{
  shipmentId?: string;
  size?: ColoredIconSize;
}>();

const resolvedDestination = computed(() => {
  const destination = contractsStore.getDestinationByShipmentId(shipmentId);
  return size === 'large' ? getDestinationFullName(destination) : getDestinationName(destination);
});

const background = 'linear-gradient(135deg, #030303, #181818)';
const color = '#7f7f7f';

const onClick = () => {
  const contract = contractsStore.getByShipmentId(shipmentId);
  if (contract) {
    showBuffer(`CONT ${contract.localId}`);
  }
};
</script>

<template>
  <div :class="[C.MaterialIcon.container, $style.container]">
    <ColoredIcon
      :data-prun-id="shipmentId"
      label="SHPT"
      title="Shipment"
      :sub-label="resolvedDestination"
      :background="background"
      :color="color"
      :size="size"
      :class="$style.icon"
      @click="onClick" />
  </div>
</template>

<style module>
.container {
  cursor: pointer;
}
</style>
