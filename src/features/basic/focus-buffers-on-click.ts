import { UI_WINDOWS_REQUEST_FOCUS } from '@src/infrastructure/prun-api/client-messages';
import { dispatchClientPrunMessage } from '@src/infrastructure/prun-api/prun-api-listener';

async function onTileReady(tile: PrunTile) {
  if (tile.docked) {
    return;
  }

  const tileWindow = tile.frame.closest(`.${C.Window.window}`) as HTMLElement;
  tileWindow?.addEventListener('mousedown', () => {
    const command = UI_WINDOWS_REQUEST_FOCUS(tile.id);
    dispatchClientPrunMessage(command);
  });
}

function init() {
  tiles.observeAll(onTileReady);
}

features.add(import.meta.url, init, 'Focuses buffers on click anywhere, not just the header.');
