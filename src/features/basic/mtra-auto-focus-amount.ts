function onTileReady(tile: PrunTile) {
  if (tile.docked) {
    return;
  }
  subscribe($$(tile.anchor, 'input'), input => {
    if (input.type === 'text') {
      input.focus();
      input.select();
    }
  });
}

function init() {
  tiles.observe('MTRA', onTileReady);
}

features.add(import.meta.url, init, 'MTRA: Automatically focuses the amount input on buffer open.');
