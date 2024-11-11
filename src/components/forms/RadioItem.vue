<script setup lang="ts">
import { computed } from 'vue';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';

const model = defineModel<boolean>();

const classes = computed(() => [
  PrunCss.RadioItem.indicator,
  {
    [PrunCss.RadioItem.active]: model.value,
    [PrunCss.effects.shadowPrimary]: model.value,
  },
]);

function onClick() {
  model.value = !model.value;
}
</script>

<template>
  <span :class="[PrunCss.RadioItem.container]" @click="onClick">
    <div :class="classes" />
    <div :class="[PrunCss.RadioItem.value, PrunCss.fonts.fontRegular, PrunCss.type.typeSmall]">
      <slot />
    </div>
  </span>
</template>
