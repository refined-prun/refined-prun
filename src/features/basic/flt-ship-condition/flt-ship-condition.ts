import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import ShipCondition from './ShipCondition.vue';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, 'tr'), row => {
    createFragmentApp(
      ShipCondition,
      reactive({
        id: refPrunId(row),
      }),
    ).appendTo(row.children[1]);
  });
}

function init() {
  tiles.observe(['FLT', 'FLTS', 'FLTP'], onTileReady);
}

features.add(import.meta.url, init, 'FLT: Adds a ship condition label to the "Name" column.');
