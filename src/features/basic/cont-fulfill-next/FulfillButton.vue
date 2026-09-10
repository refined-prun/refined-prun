<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';

defineProps<{
  count: number;
  onClick: () => void;
}>();
</script>

<template>
  <PrunButton success :class="$style.button" :disabled="count === 0" @click="onClick">
    {{ L.ContractCondition.fulfill() }} <span v-if="count > 0">({{ count }})</span>
  </PrunButton>
</template>

<style module>
.button {
  margin-left: 20px;
}
</style>
