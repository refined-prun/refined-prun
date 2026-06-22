import { closeTileWindow } from '@src/infrastructure/prun-ui/utils/close-prun-window';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, 'input'), async input => {
    if (input.type !== 'text') {
      return;
    }
    const transfer = (await $(tile.anchor, C.Button.btn)) as HTMLButtonElement;
    input.addEventListener('keydown', async e => {
      if (e.key !== 'Enter') {
        return;
      }
      transfer.click();
      await Promise.any([
        $(tile.frame, C.ActionFeedback.success),
        $(tile.frame, C.ActionFeedback.error),
      ]);
      await $(tile.frame, C.ActionFeedback.success);
      await closeTileWindow(tile);
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
