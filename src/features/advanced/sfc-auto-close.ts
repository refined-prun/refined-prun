import { closeTileWindow } from '@src/infrastructure/prun-ui/utils/close-prun-window';
import { sleep } from '@src/utils/sleep';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.frame, C.ActionFeedback.success), async () => {
    // Delay a bit so the user can see the success overlay for a bit.
    await sleep(300);
    await closeTileWindow(tile);
  });
}

function init() {
  tiles.observe('SFC', onTileReady);
}

features.add(import.meta.url, init, 'SFC: Auto-closes the window on success.');
