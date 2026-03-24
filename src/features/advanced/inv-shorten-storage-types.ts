import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import { PrunI18N } from '@src/infrastructure/prun-ui/i18n';

const storeTypes = [
  'STORE',
  'SHIP_STORE',
  'STL_FUEL_STORE',
  'FTL_FUEL_STORE',
  'WAREHOUSE_STORE',
  'CONSTRUCTION_STORE',
  'UPKEEP_STORE',
  'VORTEX_FUEL_STORE',
];

function onTileReady(tile: PrunTile) {
  shortenFilterLabels(tile);
  shortenTableLabels(tile);
}

function shortenFilterLabels(tile: PrunTile) {
  const map = new Map<string, string>();
  for (const type of storeTypes) {
    map.set(getFullName(type), getShortName(type));
  }
  subscribe($$(tile.anchor, C.InventoriesListContainer.filter), async filter => {
    for (const label of _$$(filter, C.RadioItem.value)) {
      const type = label.textContent;
      if (type) {
        label.textContent = map.get(type) ?? type;
      }
    }
  });
}

function shortenTableLabels(tile: PrunTile) {
  const map = new Map<string, string>();
  for (const type of storeTypes) {
    map.set(type, getShortName(type));
  }
  subscribe($$(tile.anchor, 'tr'), row => {
    const id = refPrunId(row);
    const name = computed(() => {
      const storage = storagesStore.getById(id.value);
      return storage ? map.get(storage?.type) : undefined;
    });
    watchEffectWhileNodeAlive(row, () => {
      // tr -> td -> span
      const typeLabel = row.firstChild?.firstChild;
      if (typeLabel && name.value !== undefined) {
        typeLabel.textContent = name.value;
      }
    });
  });
}

function getFullName(type: string) {
  return PrunI18N[`StoreTypeLabel.${type}`]?.[0]?.value ?? type;
}

function getShortName(type: string) {
  return PrunI18N[`StoreTypeLabel.${type}_SHORT`]?.[0]?.value ?? type;
}

function init() {
  tiles.observe('INV', onTileReady);
}

features.add(import.meta.url, init, 'INV: Shortens storage type names in the table and filters.');
