import { createFragmentApp } from '@src/utils/vue-fragment-app';
import TileControlsButton from '@src/components/TileControlsButton.vue';
import { computedTileState } from '@src/store/user-data-tiles';
import { getTileState } from './tile-state';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';

async function onTileReady(tile: PrunTile) {
  const tileContextControls = await $(tile.frame, C.ContextControls.container);
  if (!tileContextControls) {
    return;
  }

  const isMinimized = computedTileState(getTileState(tile), 'minimizeContextControls', false);
  watchEffectWhileNodeAlive(tile.anchor, () => {
    if (isMinimized.value) {
      tileContextControls.style.display = 'none';
    } else {
      tileContextControls.style.display = 'flex';
    }
  });

  const tileControls = await $(tile.frame, C.TileFrame.controls);
  createFragmentApp(TileControlsButton, {
    icon: '\uf070',
    onClick: () => (isMinimized.value = !isMinimized.value),
    marginTop: 4,
  }).before(tileControls.children[0]);
}

function init() {
  tiles.observeAll(onTileReady);
}

features.add(
  import.meta.url,
  init,
  'Adds a hide context menu button to the buffer header of tiles with a context menu.',
);
