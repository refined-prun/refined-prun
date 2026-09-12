<script setup lang="ts">
import HeadItem from './HeadItem.vue';
import FolderTab from './FolderTab.vue';
import { screensStore } from '@src/infrastructure/prun-api/data/screens';
import { userData } from '@src/store/user-data';
import { vDraggable } from 'vue-draggable-plus';
import { syncState } from '@src/features/basic/screen-tab-bar/sync';
import { useTemplateRef } from 'vue';
import removeArrayElement from '@src/utils/remove-array-element';

watchEffect(syncState);

const current = computed(() => screensStore.current.value);

function getScreen(id: string) {
  return screensStore.getById(id);
}

const folderMap = computed(() => {
  const map = new Map<string, UserData.TabFolder>();
  for (const folder of userData.tabs.folders) {
    map.set(folder.id, folder);
  }
  return map;
});

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

const pendingFolderDrop = ref<string | null>(null);
let activeDragId: string | null = null;

function onDragStart(evt: { item: Element }) {
  activeDragId = (evt.item as HTMLElement).dataset.itemId ?? null;
}

function onDragMove(evt: { dragged: Element; related: Element }) {
  const relatedId = (evt.related as HTMLElement).dataset.itemId;
  const draggedId = (evt.dragged as HTMLElement).dataset.itemId;
  if (relatedId && draggedId && folderMap.value.has(relatedId) && !folderMap.value.has(draggedId)) {
    pendingFolderDrop.value = relatedId;
    return false;
  }
  pendingFolderDrop.value = null;
  return true;
}

function onDragEnd(evt: { originalEvent?: Event }) {
  let targetFolderId: string | undefined;

  // The last hovered folder may no longer be under the cursor at drop time.
  if (evt.originalEvent !== undefined && 'clientX' in evt.originalEvent) {
    const { clientX, clientY } = evt.originalEvent as MouseEvent;
    for (const el of document.elementsFromPoint(clientX, clientY)) {
      const itemId = (el as HTMLElement).dataset?.itemId;
      if (itemId && folderMap.value.has(itemId)) {
        targetFolderId = itemId;
        break;
      }
    }
  }

  if (targetFolderId && activeDragId && !folderMap.value.has(activeDragId)) {
    const folder = folderMap.value.get(targetFolderId);
    const screenId = activeDragId;
    if (folder !== undefined) {
      folder.screenIds.push(screenId);
      // Defer removal until after vue-draggable-plus's own model update (nextTick)
      // so it doesn't re-insert the screen after we remove it.
      nextTick(() => {
        removeArrayElement(userData.tabs.order, screenId);
      });
    }
  }
  pendingFolderDrop.value = null;
  activeDragId = null;
}

const draggableOptions = {
  animation: 150,
  onStart: onDragStart,
  onMove: onDragMove,
  onEnd: onDragEnd,
};
</script>

<template>
  <div :class="$style.spacer" />
  <div
    ref="container"
    v-draggable="[userData.tabs.order, draggableOptions]"
    :class="$style.container">
    <!-- Keep each draggable item in one element so dragging preserves Vue's fragment markers. -->
    <div
      v-for="id in userData.tabs.order"
      v-show="folderMap.has(id) || !userData.tabs.hidden.includes(id)"
      :key="id"
      :class="$style.item"
      :data-item-id="id">
      <FolderTab
        v-if="folderMap.get(id)"
        :folder="folderMap.get(id)!"
        :class="pendingFolderDrop === id ? $style.folderHovered : undefined" />
      <a v-else :href="`#screen=${id}`">
        <HeadItem :label="getScreen(id)?.name ?? ''" :active="current === getScreen(id)" />
      </a>
    </div>
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

.folderHovered {
  outline: 1px solid #7fa8e0;
  outline-offset: -1px;
}
</style>
