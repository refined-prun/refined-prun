import { extractPlanetName } from '@src/util';

function onTileReady(tile: PrunTile) {
  // Only shorten names in the main INV tile
  if (tile.parameter) {
    return;
  }

  subscribe($$(tile.anchor, C.Link.link), link => {
    if (link.textContent) {
      link.textContent = extractPlanetName(link.textContent);
    }
  });
}

function init() {
  tiles.observe('INV', onTileReady);
}

features.add(import.meta.url, init, 'INV: Shortens addresses in the main INV command.');
