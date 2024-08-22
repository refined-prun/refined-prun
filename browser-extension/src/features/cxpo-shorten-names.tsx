import buffers from '@src/prun-ui/prun-buffers';
import features from '@src/feature-registry';
import PrunCss from '@src/prun-ui/prun-css';
import descendantPresent from '@src/utils/descendant-present';
import { _$ } from '@src/utils/get-element-by-class-name';

async function onBufferCreated(buffer: PrunBuffer) {
  const form = await descendantPresent(buffer.frame, PrunCss.ComExPlaceOrderForm.form);
  const parts = buffer.parameter!.split('.');
  replaceRowValue(form.children[0], parts[1]);
  replaceRowValue(form.children[1], parts[0]);
}

function replaceRowValue(row: Element, value: string) {
  const label = _$(PrunCss.StaticInput.static, row);
  if (label) {
    label.textContent = value;
  }
}

export function init() {
  buffers.observe('CXPO', onBufferCreated);
}

void features.add({
  id: 'cxpo-shorten-names',
  init,
});
