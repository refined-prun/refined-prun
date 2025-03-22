<script setup lang="ts">
import TextInput from '@src/components/forms/TextInput.vue';
import { searchForTickerFromName } from './materials-pretty-names';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { store } from './cx-search-bar';
import RadioItem from '@src/components/forms/RadioItem.vue';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';

const { node } = defineProps<{ node: HTMLElement }>();

const searchText = ref('');
const collapseOthers = ref(false);

watchEffectWhileNodeAlive(node, () => {
  store.collapseOthers = collapseOthers.value;
});

watchEffectWhileNodeAlive(node, () => {
  if (!searchText.value || searchText.value.length === 0) {
    store.matchedMaterials = [];
    return;
  }
  const tickers =
    materialsStore.all.value?.filter(material =>
      material.ticker.includes(searchText.value.toUpperCase()),
    ) ?? [];

  const search = searchForTickerFromName(searchText.value.toUpperCase()) ?? [];
  for (const ticker of search) {
    const material = materialsStore.getByTicker(ticker);
    if (material) {
      tickers.push(material);
    }
  }
  store.matchedMaterials = tickers;
});
</script>

<template>
  <div :class="[C.ActionBar.element, $style.textInputElement]">
    Search:
    <TextInput v-model="searchText" />
    <RadioItem v-model="collapseOthers">Results Only</RadioItem>
  </div>
</template>

<style module>
.textInputElement {
  display: flex;
  align-items: center;
}
</style>
