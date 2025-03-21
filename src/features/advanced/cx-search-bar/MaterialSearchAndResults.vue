<script setup lang="ts">
import TextInput from '@src/components/forms/TextInput.vue';
import { searchForTickerFromName } from './materials-pretty-names';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { store } from './cx-search-bar';

const searchText = ref('');
const tickers = ref<PrunApi.Material[]>([]);

const foundMaterials = computed(() => {
  if (!searchText.value || searchText.value.length === 0) {
    return [];
  }
  tickers.value = [];
  tickers.value =
    materialsStore.all.value?.filter(material => {
      material.ticker.includes(searchText.value.toUpperCase());
    }) ?? [];

  const search = searchForTickerFromName(searchText.value.toUpperCase());
  for (const ticker of search) {
    const material = materialsStore.getByTicker(ticker);
    if (material) {
      tickers.value.push(material);
    }
  }

  return tickers;
});

watch(foundMaterials, () => {
  store.foundMaterials = foundMaterials.value;
});
</script>

<template>
  <div :class="[C.ActionBar.element, $style.textInputElement]">
    Search:
    <TextInput v-model="searchText" />
  </div>
</template>

<style module>
.textInputElement {
  display: flex;
  align-items: center;
}
</style>
