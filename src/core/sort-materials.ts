import { materialCategoriesStore } from '@src/infrastructure/prun-api/data/material-categories';

export function sortMaterials(materials: PrunApi.Material[]) {
  return sortByMaterial(materials, x => x);
}

export function sortMaterialAmounts(materials: PrunApi.MaterialAmount[]) {
  return sortByMaterial(materials, x => x.material);
}

export function sortByMaterial<T>(items: T[], selector: (item: T) => PrunApi.Material | undefined) {
  return items.slice().sort((a, b) => compareMaterials(selector(a), selector(b)));
}

const categoryNameMap = new Map<string, string>();
const categorySortOrder = new Map<string, number>();

watch(materialCategoriesStore.all, categories => {
  categoryNameMap.clear();
  categorySortOrder.clear();
  if (!categories) {
    return;
  }

  categories = categories.slice().sort((a, b) => a.name.localeCompare(b.name));
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    categorySortOrder.set(category.id, i);
    categoryNameMap.set(category.id, category.name);
  }
});

export function compareMaterials(
  materialA: PrunApi.Material | undefined | null,
  materialB: PrunApi.Material | undefined | null,
) {
  if (materialA === materialB) {
    return 0;
  }
  if (!materialA) {
    return 1;
  }
  if (!materialB) {
    return -1;
  }
  const categoryAPosition = categorySortOrder.get(materialA.category);
  const categoryBPosition = categorySortOrder.get(materialB.category);
  if (categoryAPosition !== categoryBPosition) {
    return (
      (categoryAPosition ?? Number.POSITIVE_INFINITY) -
      (categoryBPosition ?? Number.POSITIVE_INFINITY)
    );
  }

  const categoryAName = categoryNameMap.get(materialA.category) ?? '';
  const intraCategoryOrder = sortOrder[categoryAName];
  if (intraCategoryOrder) {
    const indexA = intraCategoryOrder.get(materialA.ticker);
    const indexB = intraCategoryOrder.get(materialB.ticker);
    if (indexA !== undefined && indexB === undefined) {
      return -1;
    }
    if (indexA === undefined && indexB !== undefined) {
      return 1;
    }
    return indexA - indexB;
  }
  return materialA.ticker.localeCompare(materialB.ticker);
}

const sortOrder = {
  'consumables (luxury)': makeSortOrderMap([
    'COF',
    'PWO',
    'KOM',
    'REP',
    'ALE',
    'SC',
    'GIN',
    'VG',
    'WIN',
    'NST',
  ]),
  'consumables (basic)': makeSortOrderMap([
    'DW',
    'RAT',
    'OVE',
    'EXO',
    'PT',
    'MED',
    'HMS',
    'SCN',
    'FIM',
    'HSS',
    'PDA',
    'MEA',
    'LC',
    'WS',
  ]),
  'consumable bundles': makeSortOrderMap(['PBU', 'SBU', 'TBU', 'EBU', 'CBU']),
  'construction prefabs': makeSortOrderMap([
    'BBH',
    'BDE',
    'BSE',
    'BTA',
    'LBH',
    'LDE',
    'LSE',
    'LTA',
    'RBH',
    'RDE',
    'RSE',
    'RTA',
    'ABH',
    'ADE',
    'ASE',
    'ATA',
    'HSE',
  ]),
  fuels: makeSortOrderMap(['SF', 'FF']),
};

function makeSortOrderMap(materials: string[]) {
  const map = new Map<string, number>();
  for (let i = 0; i < materials.length; i++) {
    map.set(materials[i], i);
  }
  return map;
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
