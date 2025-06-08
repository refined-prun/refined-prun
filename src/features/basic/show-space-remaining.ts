import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { refValue } from '@src/utils/reactive-dom';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';

function formatFixed(f: number) {
  return f % 1 ? f.toFixed(2) : f.toString();
}

function getStore(tile: PrunTile) {
  const storeId =
    tile.command.startsWith('SHPI') && tile.parameter
      ? shipsStore.getByRegistration(tile.parameter)?.idShipStore
      : tile.parameter;
  if (!storeId) {
    return;
  }
  return storagesStore.getById(storeId);
}

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.StoreView.column), column => {
    const capacities = _$$(column, C.StoreView.capacity);
    if (capacities.length < 2) {
      return;
    }
    const weightIndex = capacities.findIndex(x => x.textContent?.includes('Weight'));
    const volumeIndex = capacities.findIndex(x => x.textContent?.includes('Volume'));

    if (weightIndex === -1 || volumeIndex === -1) {
      return;
    }
    const weightBar = capacities[weightIndex].getElementsByTagName('progress')[0];
    const volumeBar = capacities[volumeIndex].getElementsByTagName('progress')[0];
    if (!weightBar || !volumeBar) {
      return;
    }

    watchEffectWhileNodeAlive(weightBar, () => {
      const store = getStore(tile);
      if (!store) {
        return;
      }
      const weightAvailable = formatFixed(store.weightCapacity - store.weightLoad);
      (capacities[weightIndex].lastChild as Text).textContent = ` (${weightAvailable}t)`;
    });

    watchEffectWhileNodeAlive(volumeBar, () => {
      const store = getStore(tile);
      if (!store) {
        return;
      }
      const volumeAvailable = formatFixed(store.volumeCapacity - store.volumeLoad);
      (capacities[volumeIndex].lastChild as Text).textContent = ` (${volumeAvailable}m³)`;
    });
  });
}

function init() {
  tiles.observe('INV', onTileReady);
  tiles.observe('SHPI', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'Show the remaining weight and volume capacity of the selected store in INV and SHPI',
);
