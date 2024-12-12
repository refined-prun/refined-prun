function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.Message.controls), async controls => {
    const button = await $(controls, C.Button.btn);
    button.addEventListener('click', e => {
      if (e.shiftKey) {
        return;
      }

      button.setAttribute(
        'data-tooltip',
        'Please hold shift when clicking this button (misclick prevention)',
      );
      button.setAttribute('data-tooltip-position', 'top');
      e.preventDefault();
      e.stopPropagation();
    });
  });
}

function init() {
  tiles.observe(['COMG', 'COMP', 'COMU'], onTileReady);
}

features.add(
  import.meta.url,
  init,
  'Makes the "delete" button in chats work only when shift is held down.',
);
