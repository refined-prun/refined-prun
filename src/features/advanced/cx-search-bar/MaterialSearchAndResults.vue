<script setup lang="ts">
import TextInput from '@src/components/forms/TextInput.vue';
import { searchForTickerFromSubstring } from './materials-pretty-names';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import RadioItem from '@src/components/forms/RadioItem.vue';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';

const { node, store } = defineProps<{
  node: HTMLElement;
  store: { collapseOthers: boolean; matchedTickers: Set<string>; matchedCategories: Set<string> };
}>();

const searchText = ref('');
const collapseOthers = ref(false);

watchEffectWhileNodeAlive(node, () => {
  store.collapseOthers = collapseOthers.value;
});

watchEffectWhileNodeAlive(node, () => {
  const tickers = new Set<string>();
  const categories = new Set<string>();
  if (!searchText.value || searchText.value.length === 0) {
    store.matchedTickers = tickers;
    store.matchedCategories = categories;
    return;
  }

  const search = searchForTickerFromSubstring(searchText.value) ?? [];
  for (const ticker of search) {
    const material = materialsStore.getByTicker(ticker)!;
    tickers.add(material.ticker);
    categories.add(material.category);
  }
  store.matchedTickers = tickers;
  store.matchedCategories = categories;
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
