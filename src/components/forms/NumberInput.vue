<script setup lang="ts">
const model = defineModel<number>();

const inputModel = computed({
  get: () => model.value,
  set: (value: string) => (model.value = parseInt(value || '0', 10)),
});
</script>

<template>
  <div>
    <input
      v-model="inputModel"
      type="number"
      autocomplete="off"
      data-1p-ignore="true"
      data-lpignore="true" />
  </div>
</template>
