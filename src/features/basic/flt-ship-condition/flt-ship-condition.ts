import { ElementTag } from '@src/infrastructure/prun-ui/tagger';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import ShipCondition from './ShipCondition.vue';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, ElementTag.FLT_NAME_CELL), cell => {
    const row = cell.closest('tr')!;
    createFragmentApp(
      ShipCondition,
      reactive({
        id: refPrunId(row),
      }),
    ).appendTo(cell);
  });
}

function init() {
  tiles.observe(['FLT', 'FLTS', 'FLTP'], onTileReady);
}

features.add(import.meta.url, init, 'FLT: Adds a ship condition label to the "Name" column.');
