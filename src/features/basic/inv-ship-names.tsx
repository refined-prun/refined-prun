import PrunLink from '@src/components/PrunLink.vue';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';

const shipStoreTypes = new Set([
  'SHIP_STORE',
  'STL_FUEL_STORE',
  'FTL_FUEL_STORE',
  'VORTEX_FUEL_STORE',
]);

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, 'tr'), row => {
    const id = refPrunId(row);
    const nameCell = row.children[2];
    const ship = computed(() => {
      const storage = storagesStore.getById(id.value);
      if (!storage || !shipStoreTypes.has(storage.type)) {
        return undefined;
      }
      return shipsStore.getById(storage.addressableId);
    });

    watchEffectWhileNodeAlive(row, () => {
      const currentShip = ship.value;
      if (!currentShip?.name) {
        return;
      }

      nameCell.textContent = '';
      createFragmentApp(() => (
        <PrunLink inline command={`SHP ${currentShip.registration}`}>
          {currentShip.name}
        </PrunLink>
      )).appendTo(nameCell);
    });
  });
}

function init() {
  tiles.observe('INV', onTileReady);
}

features.add(import.meta.url, init, 'INV: Shows ship names in ship-owned inventory rows.');
