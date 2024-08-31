<script setup lang="ts">
import ShipmentIcon from '@src/components/ShipmentIcon.vue';
</script>

<template>
  <ShipmentIcon small :class="$style.icon" />
</template>

<style module>
.icon {
  flex-shrink: 0;
  height: 16px;
}
</style>
