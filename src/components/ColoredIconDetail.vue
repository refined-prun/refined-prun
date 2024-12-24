<script setup lang="ts">
defineProps<{ detail?: string }>();
</script>

<template>
  <span v-if="detail" :class="$style.detail">{{ detail.substring(0, 7) }}</span>
</template>

<style module>
.detail {
  font-size: 0.65em;
}
</style>
