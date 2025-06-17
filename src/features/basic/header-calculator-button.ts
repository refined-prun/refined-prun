import { createFragmentApp } from '@src/utils/vue-fragment-app';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import TileControlsButton from '@src/components/TileControlsButton.vue';

async function onTileReady(tile: PrunTile) {
  const tileControls = await $(tile.frame, C.TileFrame.controls);
  createFragmentApp(TileControlsButton, {
    icon: '\uf1ec',
    onClick: () => showBuffer('XIT CALC'),
    marginTop: 4,
  }).prependTo(tileControls);
  return;
}

function init() {
  tiles.observe(['LM', 'CX', 'XIT'], onTileReady);
}

features.add(
  import.meta.url,
  init,
  'Adds a calculator button to the buffer header of LM, CX and XIT commands.',
);
