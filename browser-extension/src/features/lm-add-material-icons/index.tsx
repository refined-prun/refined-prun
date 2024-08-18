import PrunCss from '@src/prun-ui/prun-css';
import features from '@src/feature-registry';
import { observeReadyElementsByClassName } from '@src/utils/mutation-observer';
import buffers from '@src/prun-ui/prun-buffers';
import { _$ } from '@src/utils/get-element-by-class-name';
import { widgetBefore } from '@src/utils/vue-mount';
import LMMaterialIcon from '@src/features/lm-add-material-icons/LMMaterialIcon.vue';

function onLMBufferReady(buffer: PrunBuffer) {
  observeReadyElementsByClassName(PrunCss.CommodityAd.container, {
    baseElement: buffer.frame,
    callback: onContainerReady,
  });
}

function onContainerReady(element: HTMLDivElement) {
  const adText = _$(PrunCss.CommodityAd.text, element);
  if (!adText) {
    return;
  }
  const type = adText.firstChild?.nodeValue;
  if (type !== 'BUYING' && type !== 'SELLING') {
    return;
  }

  const amountNode = adText.childNodes[1];
  const amountText = amountNode.textContent;
  const regex = /(\d+)\s+[\w-\s]+\((\w+)\)/;

  const ticker = amountText?.match(regex)?.[2];
  const amount = (() => {
    const match = amountText?.match(regex)?.[1];
    if (!match) {
      return undefined;
    }
    const amount = Number.parseFloat(match);
    return isFinite(amount) ? amount : undefined;
  })();

  amountNode.textContent = ' @ ';

  widgetBefore(element.firstElementChild!, LMMaterialIcon, {
    ticker,
    amount,
  });
}

export function init() {
  buffers.observe('LM', onLMBufferReady);
}

void features.add({
  id: 'lm-add-material-icons',
  init,
});
