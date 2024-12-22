import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';

function onTileReady(tile: PrunTile) {
  // Only shorten names in the main INV tile
  if (tile.parameter) {
    return;
  }

  // Shorten storage types
  subscribe($$(tile.anchor, 'tr'), row => {
    const id = refPrunId(row);
    const name = computed(() => {
      const storage = storagesStore.getById(id.value);
      switch (storage?.type) {
        case 'STORE':
          return 'Base';
        case 'WAREHOUSE_STORE':
          return 'WAR';
        case 'SHIP_STORE':
          return 'Ship';
        case 'STL_FUEL_STORE':
          return 'STL';
        case 'FTL_FUEL_STORE':
          return 'FTL';
        default:
          return null;
      }
    });
    watchEffectWhileNodeAlive(row, () => {
      // tr -> td -> span
      const typeLabel = row.firstChild?.firstChild;
      if (typeLabel && name) {
        typeLabel.textContent = name.value;
      }
    });
  });
}

function init() {
  tiles.observe('INV', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'INV: Shortens storage type names in the first column of the main INV command.',
);
