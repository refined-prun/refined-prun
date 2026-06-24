function onTileReady(tile: PrunTile) {
  if (tile.docked) {
    return;
  }
  subscribe($$(tile.anchor, 'input'), input => {
    if (input.type === 'text') {
      // Use setTimeout because something is messing with focus
      // immediately after input element creation.
      setTimeout(() => {
        input.focus();
        input.select();
      });
    }
  });
}

function init() {
  tiles.observe('MTRA', onTileReady);
}

features.add(import.meta.url, init, 'MTRA: Automatically focuses the amount input on buffer open.');
