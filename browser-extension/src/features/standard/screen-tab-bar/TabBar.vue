<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue';
import HeadItem from '@src/features/standard/screen-tab-bar/HeadItem.vue';
import { screensStore } from '@src/infrastructure/prun-api/data/screens';

const screens = computed(() =>
  screensStore.all.value
    .filter(x => !x.hidden)
    .sort((a, b) => (a.name === b.name ? 0 : a.name < b.name ? -1 : 1)),
);

const hash = ref(undefined as string | undefined);

const current = computed(() => hash.value ?? screens.value[0]?.id ?? '');

function updateCurrent() {
  hash.value = location.hash.match(/screen=([^&]*)/)?.[1];
}
updateCurrent();

window.addEventListener('locationchange', updateCurrent);
window.addEventListener('hashchange', updateCurrent);

onUnmounted(() => {
  window.removeEventListener('locationchange', updateCurrent);
  window.removeEventListener('hashchange', updateCurrent);
});
</script>

<template>
  <div :class="$style.spacer" />
  <a v-for="screen in screens" :key="screen.id" :href="`#screen=${screen.id}`">
    <HeadItem :label="screen.name" :active="current === screen.id" />
  </a>
</template>

<style module>
.spacer {
  display: inline-block;
  width: 5px;
}
</style>
