<script setup lang="ts">
import HeadItem from './HeadItem.vue';
import { screensStore } from '@src/infrastructure/prun-api/data/screens';
import { userData } from '@src/store/user-data';
import { vDraggable } from 'vue-draggable-plus';
import { syncState } from '@src/features/basic/screen-tab-bar/sync';
import { useTemplateRef } from 'vue';

watchEffect(syncState);

const current = computed(() => screensStore.current.value);

function getScreen(id: string) {
  return screensStore.getById(id);
}

const container = useTemplateRef('container');

// Trackpads emit small pixel deltas; mouse wheels emit larger discrete steps.
const TRACKPAD_DELTA_THRESHOLD = 50;

onMounted(() => {
  container.value?.addEventListener(
    'wheel',
    e => {
      e.preventDefault();
      // Prefer deltaX for horizontal gestures, fall back to deltaY for vertical-to-horizontal mapping.
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      // Trackpads fire many small events; smooth scroll queues up and causes jitter.
      // Mouse wheels fire fewer, larger deltas where smooth scrolling feels natural.
      const isTrackpad = Math.abs(delta) < TRACKPAD_DELTA_THRESHOLD;
      container.value?.scrollBy({
        left: delta,
        behavior: isTrackpad ? 'instant' : 'smooth',
      });
    },
    { passive: false },
  );
});
</script>

<template>
  <div :class="$style.spacer" />
  <div
    ref="container"
    v-draggable="[userData.tabs.order, { animation: 150 }]"
    :class="$style.container">
    <template v-for="id in userData.tabs.order" :key="id">
      <a v-show="!userData.tabs.hidden.includes(id)" :href="`#screen=${id}`" :class="$style.item">
        <HeadItem :label="getScreen(id).name" :active="current === getScreen(id)" />
      </a>
    </template>
  </div>
  <div :class="$style.spacer" />
</template>

<style module>
.spacer {
  display: inline-block;
  width: 5px;
}

.container {
  display: flex;
  flex-direction: row;
  flex: 1 1 auto;
  min-width: 50px;
  contain: inline-size;
  overflow: hidden;

  > .item {
    flex-shrink: 0;
  }
}
</style>
