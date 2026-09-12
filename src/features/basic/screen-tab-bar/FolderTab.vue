<script setup lang="ts">
import { screensStore } from '@src/infrastructure/prun-api/data/screens';
import { userData } from '@src/store/user-data';
import removeArrayElement from '@src/utils/remove-array-element';
import TabDropdown from './TabDropdown.vue';
import $style from './folder-menu.module.css';

const { folder } = defineProps<{
  folder: UserData.TabFolder;
}>();

const currentScreenId = computed(() => screensStore.current.value?.id);
const isActive = computed(
  () => currentScreenId.value !== undefined && folder.screenIds.includes(currentScreenId.value),
);

const indicatorClasses = computed(() => ({
  [C.HeadItem.indicator]: true,
  [C.HeadItem.indicatorPrimary]: true,
  [C.HeadItem.indicatorPrimaryActive]: isActive.value,
  [C.effects.shadowPrimary]: isActive.value,
}));

function rename() {
  const name = window.prompt('Folder name:', folder.name);
  if (name?.trim()) {
    folder.name = name.trim().toUpperCase();
  }
}

function removeScreen(screenId: string) {
  removeArrayElement(folder.screenIds, screenId);
  userData.tabs.order.push(screenId);
}

function getScreen(id: string) {
  return screensStore.getById(id);
}
</script>

<template>
  <TabDropdown
    :has-items="folder.screenIds.length > 0"
    :class="$style.tab"
    @dblclick.prevent="rename">
    <div :class="[C.HeadItem.container, C.fonts.fontRegular, C.type.typeRegular]">
      <span :class="[C.HeadItem.label, $style.name]">{{ folder.name }}</span>
      <div :class="indicatorClasses" />
    </div>
    <template #dropdown>
      <div v-for="screenId in folder.screenIds" :key="screenId" :class="C.ScreenControls.screen">
        <a
          :href="`#screen=${screenId}`"
          :class="[C.ScreenControls.name, screenId === currentScreenId && $style.name]">
          {{ getScreen(screenId)?.name ?? screenId }}
        </a>
        <div
          :class="[C.ScreenControls.delete, C.type.typeSmall, $style.action]"
          @click.stop.prevent="removeScreen(screenId)">
          rmv
        </div>
      </div>
    </template>
  </TabDropdown>
</template>
