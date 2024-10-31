import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { $$ } from '@src/utils/select-dom';
import { subscribe } from '@src/utils/subscribe-async-generator';
import { extractPlanetName } from '@src/util';

function onTileReady(tile: PrunTile) {
  // Only shorten names in the main INV tile
  if (tile.parameter) {
    return;
  }

  subscribe($$(tile.anchor, PrunCss.Link.link), link => {
    if (link.textContent) {
      link.textContent = extractPlanetName(link.textContent);
    }
  });
}

export function init() {
  tiles.observe('INV', onTileReady);
}

void features.add({
  id: 'inv-shorten-planet-names',
  advanced: true,
  init,
});
