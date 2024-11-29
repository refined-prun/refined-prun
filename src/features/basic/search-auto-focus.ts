async function focusSearchBar(tile: PrunTile) {
  // Only parameter-less commands have the search bar.
  if (tile.parameter) {
    return;
  }
  const input = await $(tile.anchor, 'input');
  input.focus();
}

function init() {
  tiles.observe(['PLI', 'SYSI'], focusSearchBar);
}

features.add(import.meta.url, init, 'Auto-focuses the search bar in PLI and SYSI.');
