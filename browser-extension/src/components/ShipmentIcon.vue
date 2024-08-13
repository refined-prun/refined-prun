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

const containerClasses = computed(() => [
  PrunCss.MaterialIcon.container,
  $style.container,
  {
    [$style.small]: props.small,
    [$style.large]: !props.small,
  },
]);

const onClick = () => showBuffer(`CONT ${contract.value?.localId}`);
</script>

<template>
  <div :class="containerClasses">
    <ColoredIcon ticker="SHPT" :on-click="onClick" />
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

.large div.ColoredIcon__container___djaR4r2 {
  height: 48px;
  width: 48px;
  font-size: 15.84px;
  cursor: pointer;
}

.small {
  height: 32px;
  width: 32px;
}
</style>
