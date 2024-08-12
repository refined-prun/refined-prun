<script setup lang="ts">
import { computed, PropType } from 'vue';
import { PlanetBurn } from '@src/burn';
import PlanetHeader from '@src/XIT/BURN/PlanetHeader.vue';
import MaterialList from '@src/XIT/BURN/MaterialList.vue';

const props = defineProps({
  isMultiplanet: Boolean,
  burn: {
    type: Object as PropType<PlanetBurn>,
    required: true,
  },
  dispSettings: {
    type: Object,
    required: true,
  },
});

const dispSettings = computed(() => props.dispSettings);

const isMinimized = computed(
  () => dispSettings.value.minimized && dispSettings.value.minimized[props.burn.planetName],
);

const onHeaderClick = () => {
  if (props.dispSettings.minimized[props.burn.planetName]) {
    delete dispSettings.value.minimized[props.burn.planetName];
  } else {
    dispSettings.value.minimized[props.burn.planetName] = true;
  }

  //setSettings(pmmgSettings);
};
</script>

<template>
  <tbody>
    <PlanetHeader :burn="burn" :minimized="isMinimized" :on-click="onHeaderClick" />
    <MaterialList
      v-if="!isMinimized"
      :is-multiplanet="isMultiplanet"
      :burn="burn"
      :disp-settings="dispSettings" />
  </tbody>
</template>
