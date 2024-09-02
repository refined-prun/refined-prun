<script setup lang="ts">
import { computed } from 'vue';
import HeadItem from '@src/features/standard/screen-tab-bar/HeadItem.vue';
import { screensStore } from '@src/infrastructure/prun-api/data/screens';
import { currentScreen } from '@src/infrastructure/prun-api/data/ui-data';

const screens = computed(() =>
  screensStore.all.value
    .filter(x => !x.hidden)
    .sort((a, b) => (a.name === b.name ? 0 : a.name < b.name ? -1 : 1)),
);
</script>

<template>
  <div :class="$style.spacer" />
  <a v-for="screen in screens" :key="screen.id" :href="`#screen=${screen.id}`">
    <HeadItem :label="screen.name" :active="currentScreen === screen" />
  </a>
</template>

<style module>
.spacer {
  display: inline-block;
  width: 5px;
}
</style>
