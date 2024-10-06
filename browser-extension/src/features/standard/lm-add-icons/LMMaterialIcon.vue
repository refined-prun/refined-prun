<script setup lang="ts">
import MaterialIcon from '@src/components/MaterialIcon.vue';

defineProps({
  ticker: {
    type: String,
    default: undefined,
  },
  amount: {
    type: Number,
    default: undefined,
  },
});
</script>

<template>
  <MaterialIcon v-if="ticker" :ticker="ticker" :amount="amount" size="inline" :class="$style.icon" />
</template>

<style module>
.icon {
  flex-shrink: 0;
}
</style>
