<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';
</script>

<template>
  <PrunButton primary :class="$style.button"><slot /></PrunButton>
</template>

<style module>
.button {
  display: block;
  margin-left: 4px;
  margin-bottom: 4px;
}
</style>
