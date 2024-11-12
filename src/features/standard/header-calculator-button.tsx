import { createFragmentApp } from '@src/utils/vue-fragment-app';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import TileControlsButton from '@src/components/TileControlsButton.vue';

async function onTileReady(tile: PrunTile) {
  const tileControls = await $(tile.frame, C.TileFrame.controls);
  createFragmentApp(TileControlsButton, {
    icon: '\uf1ec',
    onClick: () => showBuffer('XIT CALC'),
  }).before(tileControls.children[0]);
  return;
}

function init() {
  tiles.observe(['LM', 'CX', 'XIT'], onTileReady);
}

features.add({
  id: 'header-calculator-button',
  description: 'Adds a calculator button to the buffer header of LM, CX and XIT commands.',
  init,
});
