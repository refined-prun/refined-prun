<script setup lang="ts">
const model = defineModel<string>();
</script>

<template>
  <div>
    <input
      v-model="model"
      type="text"
      autocomplete="off"
      data-1p-ignore="true"
      data-lpignore="true" />
  </div>
</template>
