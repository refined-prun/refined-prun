import { createEntityStore } from '@src/prun-api/data/create-entity-store';
import { messages } from '@src/prun-api/data/api-messages';
import { computed } from 'vue';
import { materialCategoriesStore } from '@src/prun-api/data/material-categories';

const store = createEntityStore<PrunApi.Material>();
const state = store.state;

messages({
  WORLD_MATERIAL_CATEGORIES(data: { categories: PrunApi.MaterialCategory[] }) {
    const materials = data.categories.flatMap(x => x.materials);
    store.setAll(materials);
    store.setFetched();
  },
});

const byTicker = computed(() => {
  const map = new Map<string, PrunApi.Material>();
  for (const material of state.all.value) {
    map.set(material.ticker.toUpperCase(), material);
  }
  return map;
});

export const materialsStore = {
  ...state,
  getByTicker: (ticker?: string | null) =>
    ticker ? byTicker.value.get(ticker.toUpperCase()) : undefined,
};

export const sortMaterials = (materials: PrunApi.Material[]) => {
  const categories = materialCategoriesStore.entities;
  return materials.slice().sort((a, b) => {
    const categoryA = categories[a.category].name;
    const categoryB = categories[b.category].name;
    return categoryA === categoryB
      ? a.ticker.localeCompare(b.ticker)
      : categoryA.localeCompare(categoryB);
  });
};
