import './cxpo-order-book.css';
import buffers from '@src/prun-ui/prun-buffers';
import features from '@src/feature-registry';
import PrunCss from '@src/prun-ui/prun-css';
import childElementPresent from '@src/utils/child-element-present';

async function onBufferCreated(buffer: PrunBuffer) {
  const form = await childElementPresent(buffer.frame, PrunCss.ComExPlaceOrderForm.form);
  const parts = buffer.parameter!.split('.');
  replaceRowValue(form.children[0], parts[1]);
  replaceRowValue(form.children[1], parts[0]);
}

function replaceRowValue(row: Element, value: string) {
  const divs = row.getElementsByClassName(PrunCss.StaticInput.static);
  divs[0].textContent = value;
}

export function init() {
  buffers.observe('CXPO', onBufferCreated);
}

void features.add({
  id: 'cxpo-shorten-names',
  init,
});
