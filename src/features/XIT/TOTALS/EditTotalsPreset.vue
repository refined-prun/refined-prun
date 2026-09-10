<script setup lang="ts">
import Header from '@src/components/Header.vue';
import SectionHeader from '@src/components/SectionHeader.vue';
import Commands from '@src/components/forms/Commands.vue';
import Active from '@src/components/forms/Active.vue';
import TextInput from '@src/components/forms/TextInput.vue';
import PrunButton from '@src/components/PrunButton.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { showTileOverlay } from '@src/infrastructure/prun-ui/tile-overlay';
import RenameTotalsPreset from '@src/features/XIT/TOTALS/RenameTotalsPreset.vue';
import removeArrayElement from '@src/utils/remove-array-element';
import { objectId } from '@src/utils/object-id';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { toParamName } from '@src/features/XIT/TOTALS/utils';

const { preset } = defineProps<{ preset: UserData.ItemTotalsPresetData }>();

function isTickerInvalid(item: UserData.ItemTotalsItemData) {
  return (
    item.ticker.length > 0 && materialsStore.getByTicker(item.ticker.toUpperCase()) === undefined
  );
}

function onAddItemClick() {
  preset.items.push({ ticker: '' });
}

function onRemoveItemClick(item: UserData.ItemTotalsItemData) {
  removeArrayElement(preset.items, item);
}

function onRenameClick(ev: Event) {
  showTileOverlay(ev, RenameTotalsPreset, {
    name: preset.name,
    onRename: name => {
      preset.name = name;
      showBuffer(`XIT TOTALS_EDIT_${toParamName(name)}`);
    },
  });
}

function onOpenClick() {
  showBuffer(`XIT TOTALS_${toParamName(preset.name)}`);
}
</script>

<template>
  <Header :class="$style.header">{{ preset.name }}</Header>
  <SectionHeader>Items</SectionHeader>
  <form>
    <template v-for="(item, i) in preset.items" :key="objectId(item)">
      <Active :label="`Ticker #${i + 1}`" :error="isTickerInvalid(item)">
        <TextInput v-model="item.ticker" />
      </Active>
      <Commands :label="`Item #${i + 1}`">
        <PrunButton dark @click="onRemoveItemClick(item)">REMOVE ITEM</PrunButton>
      </Commands>
    </template>
    <Commands>
      <PrunButton primary @click="onAddItemClick">ADD ITEM</PrunButton>
    </Commands>
  </form>
  <SectionHeader>Commands</SectionHeader>
  <form>
    <Commands label="Rename">
      <PrunButton primary @click="onRenameClick">RENAME</PrunButton>
    </Commands>
    <Commands label="Open">
      <PrunButton primary @click="onOpenClick">OPEN</PrunButton>
    </Commands>
  </form>
</template>

<style module>
.header {
  margin-left: 4px;
}
</style>
