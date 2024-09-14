<script setup lang="ts">
import ColoredIcon from '@src/components/ColoredIcon.vue';
import { contractsStore } from '@src/infrastructure/prun-api/data/contracts';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { computed, PropType } from 'vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

const props = defineProps({
  shipmentId: {
    type: String,
    default: undefined,
  },
  destination: {
    type: String,
    default: undefined,
  },
  size: {
    type: String as PropType<'large' | 'medium' | 'small'>,
    default: 'large',
  },
});

const contract = computed(() => contractsStore.getByShipmentId(props.shipmentId));
const destination = computed(
  () => props.destination ?? contractsStore.getDestinationByShipmentId(props.shipmentId),
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
  <div :class="[PrunCss.MaterialIcon.container, $style.container]">
    <ColoredIcon
      label="SHPT"
      title="Shipment"
      :detail="destination"
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
