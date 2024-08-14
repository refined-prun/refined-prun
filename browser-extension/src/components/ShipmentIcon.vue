<script setup lang="ts">
import ColoredIcon from '@src/components/ColoredIcon.vue';
import { contractsStore } from '@src/prun-api/data/contracts';
import PrunCss from '@src/prun-ui/prun-css';
import { showBuffer } from '@src/util';
import { computed, useCssModule } from 'vue';

const props = defineProps({
  contractId: {
    type: String,
    required: true,
  },
  small: Boolean,
});

const $style = useCssModule();
const contract = computed(() => contractsStore.getById(props.contractId));

const destination = computed(() => {
  const deliveryCondition = contract.value?.conditions.find(x => x.type === 'DELIVERY_SHIPMENT');
  const destination = deliveryCondition?.destination?.lines[1];
  if (!destination) {
    return undefined;
  }

  return destination.type === 'PLANET' ? destination.entity.name : destination.entity.naturalId;
});

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

const onClick = () => showBuffer(`CONT ${contract.value?.localId}`);
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
