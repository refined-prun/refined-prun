import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { $$ } from '@src/utils/select-dom';
import { subscribe } from '@src/utils/subscribe-async-generator';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, PrunCss.ShipStore.store), div => {
    // div -> div
    const label = div.children[2];
    if (label) {
      label.textContent = (label.textContent || '')
        .replace(/(t|m³)/g, '')
        .replace(/(\d+)([,.]?000)/g, (_, x) => `${x}k`);
    }
  });
}

export function init() {
  tiles.observe('FLT', onTileReady);
}

void features.add({
  id: 'flt-shorten-cargo-capacity',
  advanced: true,
  init,
});
