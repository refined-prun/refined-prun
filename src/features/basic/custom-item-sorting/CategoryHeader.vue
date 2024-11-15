<script setup lang="ts">
import SectionHeader from '@src/components/SectionHeader.vue';

defineProps({
  label: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <SectionHeader :style="{ width: '100%' }">{{ label }}</SectionHeader>
</template>
