<script setup lang="ts">
import { userData } from '@src/store/user-data';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import removeArrayElement from '@src/utils/remove-array-element';
import TabDropdown from './TabDropdown.vue';
import $style from './folder-menu.module.css';

function onClick() {
  void showBuffer('XIT FLDR');
}

function deleteFolder(folderId: string) {
  const folder = userData.tabs.folders.find(x => x.id === folderId);
  if (folder === undefined) {
    return;
  }
  for (const screenId of folder.screenIds) {
    userData.tabs.order.push(screenId);
  }
  removeArrayElement(userData.tabs.folders, folder);
  removeArrayElement(userData.tabs.order, folderId);
}
</script>

<template>
  <TabDropdown
    :has-items="userData.tabs.folders.length > 0"
    :class="[C.HeadItem.container, C.fonts.fontRegular, C.type.typeRegular, C.HeadItem.link]"
    @click="onClick">
    <span :class="C.HeadItem.label">FLDR</span>
    <div :class="[C.HeadItem.indicator, C.HeadItem.indicatorPrimary]" />
    <template #dropdown>
      <div
        v-for="folder in userData.tabs.folders"
        :key="folder.id"
        :class="C.ScreenControls.screen">
        <span :class="[C.ScreenControls.name, $style.name]">{{ folder.name }}</span>
        <div
          :class="[C.ScreenControls.delete, C.type.typeSmall, $style.action]"
          @click.stop.prevent="deleteFolder(folder.id)">
          del
        </div>
      </div>
    </template>
  </TabDropdown>
</template>
