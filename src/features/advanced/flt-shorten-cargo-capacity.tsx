import features from '@src/feature-registry';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.ShipStore.store), div => {
    // div -> div
    const label = div.children[2];
    if (label) {
      label.textContent = (label.textContent || '')
        .replace(/(t|m³)/g, '')
        .replace(/(\d+)([,.]?000)/g, (_, x) => `${x}k`);
    }
  });
}

function init() {
  tiles.observe('FLT', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'FLT: Removes "t" and "m³" and convert cargo capacity label to k-notation.',
);
