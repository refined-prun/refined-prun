import { extractPlanetName } from '@src/util';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.Link.link), link => {
    if (link.textContent) {
      link.textContent = extractPlanetName(link.textContent);
    }
  });
}

function init() {
  tiles.observe('FLT', onTileReady);
}

features.add({
  id: 'flt-shorten-addresses',
  description: 'FLT: Shortens addresses in "Location" and "Destination".',
  advanced: true,
  init,
});
