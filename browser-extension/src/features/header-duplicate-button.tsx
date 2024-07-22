import buffers from '@src/prun-ui/prun-buffers';
import features from '@src/feature-registry';
import { showBuffer } from '@src/util';
import { h } from 'dom-chef';
import PrunCss from '@src/prun-ui/prun-css';
import childElementPresent from '@src/utils/child-element-present';

async function onBufferCreated(buffer: PrunBuffer) {
  const tileControls = await childElementPresent(buffer.frame, PrunCss.TileFrame.controls);
  const hiddenControls = await childElementPresent(tileControls, PrunCss.TileControls.controls);

  const button = (
    <div
      className="button-upper-right"
      style={{
        marginTop: __CHROME__ ? '3px' : '-3px',
        fontSize: __CHROME__ ? '16px' : '20px',
        paddingRight: '1px',
        paddingLeft: '1px',
      }}
      onClick={() => showBuffer(buffer.fullCommand)}>
      ↗
    </div>
  );

  hiddenControls.firstChild!.insertBefore(button, hiddenControls.firstChild!.firstChild);
}

export function init() {
  buffers.observeAll(onBufferCreated);
}

void features.add({
  id: 'header-duplicate-button',
  init,
});
