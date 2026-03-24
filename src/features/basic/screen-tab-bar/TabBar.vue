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

onMounted(() => {
  const el = container.value!;

  let target = el.scrollLeft;
  let animating = false;

  function step() {
    const diff = target - el.scrollLeft;
    if (Math.abs(diff) < 0.5) {
      el.scrollLeft = target;
      animating = false;
      return;
    }
    el.scrollLeft += diff * 0.3;
    requestAnimationFrame(step);
  }

  el.addEventListener(
    'wheel',
    e => {
      e.preventDefault();
      // Use dominant axis: deltaX for horizontal gestures, deltaY for vertical-to-horizontal mapping.
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      target = Math.max(0, Math.min(target + delta, el.scrollWidth - el.clientWidth));
      if (!animating) {
        animating = true;
        requestAnimationFrame(step);
      }
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
