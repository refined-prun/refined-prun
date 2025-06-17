import { materialCategoriesStore } from '@src/infrastructure/prun-api/data/material-categories';

export function sortMaterials(materials: PrunApi.Material[]) {
  return sortByMaterial(materials, x => x);
}

export function sortMaterialAmounts(materials: PrunApi.MaterialAmount[]) {
  return sortByMaterial(materials, x => x.material);
}

export function sortByMaterial<T>(items: T[], selector: (item: T) => PrunApi.Material | undefined) {
  const categories = materialCategoriesStore.entities.value;
  if (!categories) {
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
    if (categoryA !== categoryB) {
      return categoryA.localeCompare(categoryB);
    }

    const categoryOrder = sortOrder[categoryA];
    if (categoryOrder) {
      const indexA = categoryOrder.get(materialA.ticker);
      const indexB = categoryOrder.get(materialB.ticker);
      if (indexA && !indexB) {
        return 1;
      }
      if (!indexA && indexB) {
        return -1;
      }
      return indexA - indexB;
    }
    return materialA.ticker.localeCompare(materialB.ticker);
  });
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
