import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { messages } from '@src/infrastructure/prun-api/data/api-messages';
import { materialCategoriesStore } from '@src/infrastructure/prun-api/data/material-categories';
import { createMapGetter } from '@src/infrastructure/prun-api/data/create-map-getter';

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

export function sortMaterials(materials: PrunApi.Material[]) {
  return sortMaterialsBy(materials, x => x);
}

export function sortMaterialAmounts(materials: PrunApi.MaterialAmount[]) {
  return sortMaterialsBy(materials, x => x.material);
}

export function sortMaterialsBy<T>(
  items: T[],
  selector: (item: T) => PrunApi.Material | undefined,
) {
  const categories = materialCategoriesStore.entities;
  return items.slice().sort((a, b) => {
    const materialA = selector(a);
    const materialB = selector(b);
    if (materialA === materialB) {
      return 0;
    }
    if (!materialA) {
      return 1;
    }
    if (!materialB) {
      return -1;
    }
    const categoryA = categories[materialA.category].name;
    const categoryB = categories[materialB.category].name;
    return categoryA === categoryB
      ? materialA.ticker.localeCompare(materialB.ticker)
      : categoryA.localeCompare(categoryB);
  });
}

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
