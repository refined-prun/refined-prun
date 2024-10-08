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

export function mergeMaterialAmounts(amounts: PrunApi.MaterialAmount[]) {
  const result: PrunApi.MaterialAmount[] = [];
  const added = new Map<string, PrunApi.MaterialAmount>();
  for (const amount of amounts) {
    const existing = added.get(amount.material.ticker);
    if (existing) {
      existing.amount += amount.amount;
    } else {
      const copy = { ...amount };
      result.push(copy);
      added.set(amount.material.ticker, copy);
    }
  }
  return result;
}
