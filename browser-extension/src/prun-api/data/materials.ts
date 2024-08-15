import { createEntityStore } from '@src/prun-api/data/create-entity-store';
import { messages } from '@src/prun-api/data/api-messages';
import { materialCategoriesStore } from '@src/prun-api/data/material-categories';
import { createMapGetter } from '@src/prun-api/data/create-map-getter';

const store = createEntityStore<PrunApi.Material>();
const state = store.state;

messages({
  WORLD_MATERIAL_CATEGORIES(data: { categories: PrunApi.MaterialCategory[] }) {
    const materials = data.categories.flatMap(x => x.materials);
    store.setAll(materials);
    store.setFetched();
  },
});

const getByTicker = createMapGetter(
  state.all,
  x => x.ticker,
  x => x.toUpperCase(),
);

export const materialsStore = {
  ...state,
  getByTicker,
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
