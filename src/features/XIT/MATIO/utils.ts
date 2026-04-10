import { MaterialBurn, PlanetBurn } from '@src/core/burn';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { sortMaterials } from '@src/core/sort-materials';

export type MatioMode = 'all' | 'production' | 'workforce';
export type MatioRowBurn = Pick<
  MaterialBurn,
  'inventory' | 'input' | 'output' | 'dailyAmount' | 'workforce'
>;

export function getSortedTickers(burn: PlanetBurn) {
  const materials = Object.keys(burn.burn).map(materialsStore.getByTicker);
  return sortMaterials(materials.filter(x => x !== undefined));
}

export function matchesMode(burn: MatioRowBurn, mode: MatioMode) {
  switch (mode) {
    case 'production':
      return burn.input > 0 || burn.output > 0;
    case 'workforce':
      return burn.workforce > 0;
    default:
      return true;
  }
}
