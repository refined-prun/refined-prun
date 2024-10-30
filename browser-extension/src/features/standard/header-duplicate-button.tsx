import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { $ } from '@src/utils/select-dom';
import TileControlsButton from '@src/components/TileControlsButton.vue';

async function onTileReady(tile: PrunTile) {
  const splitControls = await $(tile.frame, PrunCss.TileControls.splitControls);
  createFragmentApp(TileControlsButton, {
    icon: '\uf24d',
    onClick: () => showBuffer(tile.fullCommand, { force: true }),
  }).before(splitControls);
}

export function init() {
  tiles.observeAll(onTileReady);
}

void features.add({
  id: 'header-duplicate-button',
  init,
});
