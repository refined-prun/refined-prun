import buffers from '@src/prun-ui/prun-buffers';
import features from '@src/feature-registry';
import { showBuffer } from '@src/util';
import PrunCss from '@src/prun-ui/prun-css';
import descendantPresent from '@src/utils/descendant-present';
import { widgetBefore } from '@src/utils/vue-mount';

async function onBufferCreated(buffer: PrunBuffer) {
  if (!buffer.firstActivation) {
    return;
  }

  const splitControls = await descendantPresent(buffer.frame, PrunCss.TileControls.splitControls);
  widgetBefore(splitControls.children[0], () => (
    <div
      class="button-upper-right"
      style={{
        marginTop: __CHROME__ ? '3px' : '-3px',
        fontSize: __CHROME__ ? '16px' : '20px',
        paddingRight: '1px',
        paddingLeft: '1px',
      }}
      onClick={() => showBuffer(buffer.fullCommand)}>
      ↗
    </div>
  ));
}

export function init() {
  buffers.observeAll(onBufferCreated);
}

void features.add({
  id: 'header-duplicate-button',
  init,
});
