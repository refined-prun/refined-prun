import { materialCategoriesStore } from '@src/infrastructure/prun-api/data/material-categories';

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
  const categories = materialCategoriesStore.entities.value;
  if (categories === undefined) {
    return items;
  }
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
