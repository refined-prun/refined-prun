import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import features from '@src/feature-registry';
import { observeReadyElementsByClassName } from '@src/utils/mutation-observer';
import buffers from '@src/infrastructure/prun-ui/prun-buffers';

function onLMBufferReady(buffer: PrunBuffer) {
  observeReadyElementsByClassName(PrunCss.CommodityAd.text, {
    baseElement: buffer.frame,
    callback: onAdTextReady,
  });
}

function onAdTextReady(element: HTMLDivElement) {
  const type = element.firstChild?.nodeValue;
  if (type !== 'BUYING' && type !== 'SELLING') {
    return;
  }

  const span = document.createElement('span');
  span.className =
    type === 'BUYING' ? PrunCss.OrderTypeLabel.BUYING : PrunCss.OrderTypeLabel.SELLING;
  span.textContent = type;
  element.replaceChild(span, element.firstChild!);
}

export function init() {
  buffers.observe(['LM', 'LMA'], onLMBufferReady);
}

void features.add({
  id: 'lm-buy-sell-highlight',
  init,
});
