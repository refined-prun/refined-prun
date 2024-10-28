import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import system from '@src/system';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { $ } from '@src/utils/select-dom';

async function onTileReady(tile: PrunTile) {
  const tileControls = await $(tile.frame, PrunCss.TileFrame.controls);
  const path = system.runtime.getURL('images/calculator-button.svg');
  createFragmentApp(() => (
    <div
      class="button-upper-right"
      style={{ marginTop: __CHROME__ ? '-3px' : '-4px' }}
      onClick={() => showBuffer('XIT CALC')}>
      <img src={path} alt="Calculator icon" />
    </div>
  )).before(tileControls.children[0]);
}

export function init() {
  tiles.observe(['LM', 'CX', 'XIT'], onTileReady);
}

void features.add({
  id: 'header-calculator-button',
  init,
});
