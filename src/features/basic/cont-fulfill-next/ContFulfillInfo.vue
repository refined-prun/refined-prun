<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';

defineProps<{
  pendingCount: number;
  fulfillableCount: number;
  onFulfillNext: () => void;
}>();
</script>

<template>
  <div :class="$style.container">
    <span :class="$style.info">
      {{ fulfillableCount }}/{{ pendingCount }} conditions fulfillable
    </span>
    <PrunButton v-if="fulfillableCount > 0" success inline @click="onFulfillNext">
      fulfill next
    </PrunButton>
  </div>
</template>

<style module>
.container {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
}

.info {
  color: var(--rp-color-text);
  font-size: 11px;
}
</style>
