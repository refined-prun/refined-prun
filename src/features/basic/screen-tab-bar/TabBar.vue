<script setup lang="ts">
import HeadItem from './HeadItem.vue';
import { screensStore } from '@src/infrastructure/prun-api/data/screens';
import { userData } from '@src/store/user-data';
import { vDraggable } from 'vue-draggable-plus';
import { syncState } from '@src/features/basic/screen-tab-bar/sync';

watchEffect(syncState);

const current = computed(() => screensStore.current.value);

function getScreen(id: string) {
  return screensStore.getById(id);
}
</script>

<template>
  <div :class="$style.spacer" />
  <div v-draggable="[userData.tabs.order, { animation: 150 }]" :class="$style.container">
    <template v-for="id in userData.tabs.order" :key="id">
      <a v-show="!userData.tabs.hidden.includes(id)" :href="`#screen=${id}`">
        <HeadItem :label="getScreen(id).name" :active="current === getScreen(id)" />
      </a>
    </template>
  </div>
</template>

<style module>
.spacer {
  display: inline-block;
  width: 5px;
}

.container {
  display: inline-flex;
  flex-wrap: wrap;
  overflow: hidden;
}

.container > * {
  flex-shrink: 0;
}
</style>
