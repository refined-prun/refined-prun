import { extractPlanetName } from '@src/util';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.Link.link), link => {
    if (link.textContent) {
      link.textContent = extractPlanetName(link.textContent);
    }
  });
}

function init() {
  tiles.observe(['FLT', 'FLTS', 'FLTP'], onTileReady);
}

features.add(import.meta.url, init, 'FLT: Shortens addresses in "Location" and "Destination".');
