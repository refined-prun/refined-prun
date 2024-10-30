import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { $ } from '@src/utils/select-dom';
import TileControlsButton from '@src/components/TileControlsButton.vue';

async function onTileReady(tile: PrunTile) {
  const tileControls = await $(tile.frame, PrunCss.TileFrame.controls);
  createFragmentApp(TileControlsButton, {
    icon: '\uf1ec',
    onClick: () => showBuffer('XIT CALC'),
  }).before(tileControls.children[0]);
  return;
}

export function init() {
  tiles.observe(['LM', 'CX', 'XIT'], onTileReady);
}

void features.add({
  id: 'header-calculator-button',
  init,
});
