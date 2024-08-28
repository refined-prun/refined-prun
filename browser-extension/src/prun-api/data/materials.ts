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

const getByTicker = (() => {
  const getter = createMapGetter(
    state.all,
    x => x.ticker,
    x => x.toUpperCase(),
  );

  return (value?: string | null) => {
    if (!value) {
      return undefined;
    }

    // Extract ticker from MAT.CX
    const dotIndex = value.indexOf('.');
    if (dotIndex >= 0) {
      return getter(value.substring(0, dotIndex));
    }
    return getter(value);
  };
})();

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

export const sortMaterialAmounts = (materials: PrunApi.MaterialAmount[]) => {
  const categories = materialCategoriesStore.entities;
  return materials.slice().sort((a, b) => {
    const categoryA = categories[a.material.category].name;
    const categoryB = categories[b.material.category].name;
    return categoryA === categoryB
      ? a.material.ticker.localeCompare(b.material.ticker)
      : categoryA.localeCompare(categoryB);
  });
};

export function mergeMaterialAmounts(materials: PrunApi.MaterialAmount[]) {
  const result: PrunApi.MaterialAmount[] = [];
  for (const material of materials) {
    const existing = result.find(x => x.material.ticker === material.material.ticker);
    if (existing) {
      existing.amount += material.amount;
    } else {
      result.push({ ...material });
    }
  }
  return result;
}
