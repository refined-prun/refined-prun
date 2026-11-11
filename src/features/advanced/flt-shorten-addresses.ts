import { ElementTag } from '@src/infrastructure/prun-ui/tagger';
import { extractPlanetName } from '@src/util';

function onTileReady(tile: PrunTile) {
  for (const tag of [ElementTag.FLT_LOCATION_CELL, ElementTag.FLT_DESTINATION_CELL]) {
    subscribe($$(tile.anchor, tag), cell => {
      subscribe($$(cell, C.Link.link), link => {
        if (link.textContent) {
          link.textContent = extractPlanetName(link.textContent);
        }
      });
    });
  }
}

function init() {
  tiles.observe(['FLT', 'FLTS', 'FLTP'], onTileReady);
}

features.add(import.meta.url, init, 'FLT: Shortens addresses in "Location" and "Destination".');
