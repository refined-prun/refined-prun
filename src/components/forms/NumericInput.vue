<script setup lang="ts">
const model = defineModel<number>();
</script>

<template>
  <div>
    <input
      v-model="model"
      inputmode="numeric"
      autocomplete="off"
      data-1p-ignore="true"
      data-lpignore="true" />
  </div>
</template>
