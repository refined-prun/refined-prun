import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { $ } from '@src/utils/select-dom';

async function onTileReady(tile: PrunTile) {
  const splitControls = await $(tile.frame, PrunCss.TileControls.splitControls);
  createFragmentApp(() => (
    <div
      class="button-upper-right"
      style={{
        marginTop: __CHROME__ ? '3px' : '-3px',
        fontSize: __CHROME__ ? '16px' : '20px',
        paddingRight: '1px',
        paddingLeft: '1px',
      }}
      onClick={() => showBuffer(tile.fullCommand, { force: true })}>
      ↗
    </div>
  )).before(splitControls.children[0]);
}

export function init() {
  tiles.observeAll(onTileReady);
}

void features.add({
  id: 'header-duplicate-button',
  init,
});
