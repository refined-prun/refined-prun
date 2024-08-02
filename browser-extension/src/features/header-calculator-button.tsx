import buffers from '@src/prun-ui/prun-buffers';
import features from '@src/feature-registry';
import { showBuffer } from '@src/util';
import { h } from 'dom-chef';
import PrunCss from '@src/prun-ui/prun-css';
import descendantPresent from '@src/utils/descendant-present';
import system from '@src/system';

async function onBufferCreated(buffer: PrunBuffer) {
  if (!buffer.firstActivation) {
    return;
  }
  const tileControls = await descendantPresent(buffer.frame, PrunCss.TileFrame.controls);
  const path = system.runtime.getURL('images/calculator-button.svg');
  const button = (
    <div
      className="button-upper-right"
      style={{ marginTop: __CHROME__ ? '-3px' : '-4px' }}
      onClick={() => showBuffer('XIT CALCULATOR')}>
      <img src={path} alt="Calculator icon" />
    </div>
  );
  tileControls.children[0].before(button);
}

export function init() {
  buffers.observe(['LM', 'CX', 'XIT'], onBufferCreated);
}

void features.add({
  id: 'header-calculator-button',
  init,
});
