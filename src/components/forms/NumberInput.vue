<script setup lang="ts">
const model = defineModel<number>();
</script>

<template>
  <div>
    <input
      v-model="model"
      :class="$style.input"
      type="number"
      autocomplete="off"
      data-1p-ignore="true"
      data-lpignore="true" />
  </div>
</template>

<style module>
/* Chrome, Safari, Edge, Opera */
.input::-webkit-outer-spin-button,
.input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
.input[type='number'] {
  -moz-appearance: textfield;
}
</style>
