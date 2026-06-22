import { closeWindow } from '@src/infrastructure/prun-ui/utils/close-window';
import { sleep } from '@src/utils/sleep';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.frame, C.ActionFeedback.success), async () => {
    if (tile.docked) {
      return;
    }

    // Delay a bit so the user can see the success overlay for a bit.
    await sleep(300);
    void closeWindow(tile.window);
  });
}

function init() {
  tiles.observe('SFC', onTileReady);
}

features.add(import.meta.url, init, 'SFC: Auto-closes the window on success.');
