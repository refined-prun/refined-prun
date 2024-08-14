<script setup lang="ts">
defineProps({
  detail: {
    type: String,
    required: false,
    default: undefined,
  },
});
</script>

<template>
  <span v-if="detail" :class="$style.detail">{{ detail.substring(0, 7) }}</span>
</template>

<style module>
.detail {
  font-size: 0.65em;
}
</style>
