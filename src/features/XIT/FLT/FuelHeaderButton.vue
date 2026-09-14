<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';

const emit = defineEmits<{ refuel: [] }>();
</script>

<template>
  <span :class="$style.container">
    <PrunButton dark inline :class="$style.button" @click.stop="emit('refuel')"> Fuel </PrunButton>
    <slot />
  </span>
</template>

<style module>
.container {
  display: flex;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  gap: 6px;
}

.container .button {
  font-size: inherit;
  line-height: inherit;
}
</style>
