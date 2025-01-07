import { matchBufferSize } from '@src/infrastructure/prun-ui/buffer-sizes';
import { setBufferSize } from '@src/infrastructure/prun-ui/buffers';

const pastWindows: WeakSet<Element> = new WeakSet();

async function onTileReady(tile: PrunTile) {
  if (tile.docked) {
    return;
  }

  if (!pastWindows.has(tile.container)) {
    // Skip the first tile activation, as the main tiles.ts adjusts the size itself.
    pastWindows.add(tile.container);
    return;
  }

  const size = matchBufferSize(tile.fullCommand) ?? [450, 300];
  const buffer = tile.frame.closest(`.${C.Window.window}`);
  if (!buffer) {
    return;
  }

  const body = await $(buffer, C.Window.body);
  const width = parseInt(body.style.width.replace('px', ''), 10);
  const height = parseInt(body.style.height.replace('px', ''), 10);
  setBufferSize(tile.id, Math.max(size[0], width), Math.max(size[1], height));
}

function init() {
  tiles.observeAll(onTileReady);
}

features.add(import.meta.url, init, 'Automatically resizes the buffer size on command change.');
