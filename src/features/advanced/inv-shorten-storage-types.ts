import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import { PrunI18N } from '@src/infrastructure/prun-ui/i18n';

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
      return PrunI18N[`StoreTypeLabel.${storage?.type}_SHORT`]?.[0]?.value;
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

function init() {
  tiles.observe('INV', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'INV: Shortens storage type names in the first column of the main INV command.',
);
