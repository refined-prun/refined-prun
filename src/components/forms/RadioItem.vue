<script setup lang="ts">
const model = defineModel<boolean>();

const classes = computed(() => [
  C.RadioItem.indicator,
  {
    [C.RadioItem.active]: model.value,
    [C.effects.shadowPrimary]: model.value,
  },
]);

function onClick() {
  model.value = !model.value;
}
</script>

<template>
  <span :class="[C.RadioItem.container]" @click="onClick">
    <div :class="classes" />
    <div :class="[C.RadioItem.value, C.fonts.fontRegular, C.type.typeSmall]">
      <slot />
    </div>
  </span>
</template>
