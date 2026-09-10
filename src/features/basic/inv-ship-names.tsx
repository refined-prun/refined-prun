import PrunLink from '@src/components/PrunLink.vue';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { ElementTag } from '@src/infrastructure/prun-ui/tagger';
import { observeDescendantListChanged } from '@src/utils/mutation-observer';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, 'tr'), row => {
    const id = refPrunId(row);
    const ship = computed(() => shipsStore.getByStoreId(id.value));
    const container = document.createElement('span');

    observeDescendantListChanged(row, () => {
      const nameCell = _$(row, ElementTag.INV_NAME_CELL);
      if (!nameCell) {
        return;
      }
      if (
        ship.value?.name &&
        (nameCell.childNodes.length !== 1 || nameCell.firstChild !== container)
      ) {
        nameCell.replaceChildren(container);
      } else if (nameCell.lastChild !== container) {
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
