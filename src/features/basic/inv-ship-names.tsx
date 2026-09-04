import PrunLink from '@src/components/PrunLink.vue';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { observeDescendantListChanged } from '@src/utils/mutation-observer';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, 'tr'), row => {
    const id = refPrunId(row);
    const getNameCell = () => row.children[2];
    const ship = computed(() => shipsStore.getByStoreId(id.value));
    const container = document.createElement('span');

    observeDescendantListChanged(row, () => {
      const nameCell = getNameCell();
      if (ship.value?.name) {
        for (const child of Array.from(nameCell.childNodes)) {
          if (child !== container) {
            child.remove();
          }
        }
      }
      if (nameCell.lastChild !== container) {
        nameCell.append(container);
      }
    });

    createFragmentApp(() => {
      const currentShip = ship.value;
      if (!currentShip?.name) {
        return null;
      }
      return (
        <PrunLink inline command={`SHP ${currentShip.registration}`}>
          {currentShip.name}
        </PrunLink>
      );
    }).appendTo(container);
  });
}

function init() {
  tiles.observe('INV', onTileReady);
}

features.add(import.meta.url, init, 'INV: Shows ship names in ship-owned inventory rows.');
