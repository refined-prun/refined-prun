import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import { showBuffer } from '@src/util';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import descendantPresent from '@src/utils/descendant-present';
import { widgetBefore } from '@src/utils/vue-mount';

async function onTileReady(tile: PrunTile) {
  if (!tile.firstActivation) {
    return;
  }

  const splitControls = await descendantPresent(tile.frame, PrunCss.TileControls.splitControls);
  widgetBefore(splitControls.children[0], () => (
    <div
      class="button-upper-right"
      style={{
        marginTop: __CHROME__ ? '3px' : '-3px',
        fontSize: __CHROME__ ? '16px' : '20px',
        paddingRight: '1px',
        paddingLeft: '1px',
      }}
      onClick={() => showBuffer(tile.fullCommand)}>
      ↗
    </div>
  ));
}

export function init() {
  tiles.observeAll(onTileReady);
}

void features.add({
  id: 'header-duplicate-button',
  init,
});
