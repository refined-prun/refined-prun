<script setup lang="ts">
import ColoredIcon from '@src/components/ColoredIcon.vue';
import { contractsStore } from '@src/prun-api/data/contracts';
import PrunCss from '@src/prun-ui/prun-css';
import { showBuffer } from '@src/util';
import { computed, useCssModule } from 'vue';

const props = defineProps({
  shipmentId: {
    type: String,
    default: undefined,
  },
  destination: {
    type: String,
    default: undefined,
  },
  small: Boolean,
});

const $style = useCssModule();
const contract = computed(() => contractsStore.getByShipmentId(props.shipmentId));
const destination = computed(
  () => props.destination ?? contractsStore.getDestinationByShipmentId(props.shipmentId),
);

const containerClasses = computed(() => [
  PrunCss.MaterialIcon.container,
  $style.container,
  {
    [$style.small]: props.small,
    [$style.large]: !props.small,
  },
]);

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
  <div :class="containerClasses">
    <ColoredIcon
      label="SHPT"
      title="Shipment"
      :detail="destination"
      :background="background"
      :color="color"
      :class="$style.icon"
      @click="onClick" />
  </div>
</template>

<style module>
.container {
  cursor: pointer;
}

.large {
  height: 48px;
  width: 48px;
}

.large div.icon {
  height: 48px;
  width: 48px;
  font-size: 16px;
  cursor: pointer;
}

.small {
  height: 32px;
  width: 32px;
}
</style>
