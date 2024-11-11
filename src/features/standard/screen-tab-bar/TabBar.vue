<script setup lang="ts">
import HeadItem from '@src/features/standard/screen-tab-bar/HeadItem.vue';
import { screensStore } from '@src/infrastructure/prun-api/data/screens';
import { computed } from 'vue';

const sorted = computed(() => screensStore.sorted.value);
const current = computed(() => screensStore.current.value);
</script>

<template>
  <div :class="$style.spacer" />
  <a v-for="screen in sorted" :key="screen.id" :href="`#screen=${screen.id}`">
    <HeadItem :label="screen.name" :active="current === screen" />
  </a>
</template>

<style module>
.spacer {
  display: inline-block;
  width: 5px;
}
</style>
