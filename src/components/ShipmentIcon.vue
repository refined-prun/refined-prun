<script setup lang="ts">
import ColoredIcon, { ColoredIconSize } from '@src/components/ColoredIcon.vue';
import { contractsStore } from '@src/infrastructure/prun-api/data/contracts';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

const {
  destination,
  shipmentId,
  size = 'large',
} = defineProps<{
  destination?: string;
  shipmentId?: string;
  size?: ColoredIconSize;
}>();

const contract = computed(() => contractsStore.getByShipmentId(shipmentId));
const resolvedDestination = computed(
  () => destination ?? contractsStore.getDestinationByShipmentId(shipmentId),
);

const background = 'linear-gradient(135deg, #030303, #181818)';
const color = '#7f7f7f';

const onClick = () => {
  if (!contract.value) {
    return;
  }
  showBuffer(`CONT ${contract.value?.localId}`);
};
</script>

<template>
  <div :class="[C.MaterialIcon.container, $style.container]">
    <ColoredIcon
      label="SHPT"
      title="Shipment"
      :detail="resolvedDestination"
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
