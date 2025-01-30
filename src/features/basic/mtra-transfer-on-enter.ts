function onTileReady(tile: PrunTile) {
  const window = tile.frame.closest(`.${C.Window.window}`) as HTMLElement;
  const close = _$$(window, C.Window.button).at(-1)!;
  subscribe($$(document, 'input'), async input => {
    if (input.type !== 'text') {
      return;
    }
    const transfer = (await $(tile.anchor, C.Button.btn)) as HTMLButtonElement;
    input.addEventListener('keydown', async e => {
      if (e.key !== 'Enter') {
        return;
      }
      transfer.click();
      if (tile.docked) {
        return;
      }
      await Promise.any([
        $(tile.frame, C.ActionFeedback.success),
        $(tile.frame, C.ActionFeedback.error),
      ]);
      const success = await $(tile.frame, C.ActionFeedback.success);
      if (success) {
        close.click();
      }
    });
  });
}

function init() {
  tiles.observe('MTRA', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'MTRA: Triggers transfer on Enter and closes the buffer on success.',
);
