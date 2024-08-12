import { CurrencySymbols } from '@src/GameProperties';
import PrunCss from '@src/prun-ui/prun-css';
import features from '@src/feature-registry';
import observeReadyElementsByClassName from '@src/utils/mutation-observer';
import { widgetAfter } from '@src/utils/vue-mount';

function onAdTextReady(element: HTMLDivElement) {
  // Test if the text matches that of a shipping ad
  const regExp = /SHIPPING\s([\d,.]+)t\s\/\s([\d,.]+)m³\s@\s([\d,.]+)\s[A-Z]+\sfrom/;
  const matches = element.textContent?.match(regExp);

  if (!matches || matches.length < 4) {
    return;
  }

  const weight = parseFloat(matches[1].replace(/[,.]/g, '')) / 100;
  const volume = parseFloat(matches[2].replace(/[,.]/g, '')) / 100;
  const totalCost = matches[3];
  const unit = weight > volume ? 't' : 'm³';
  const amount = weight > volume ? weight : volume;
  const totalCents = parseInt(totalCost.replace(/[,.]/g, ''), 10);
  const perItem = (totalCents / amount / 100).toFixed(2);
  for (const child of Array.from(element.childNodes)) {
    if (child.nodeValue && child.nodeValue.slice(1) in CurrencySymbols) {
      widgetAfter(child as Element, () => (
        <span>
          {' '}
          ({perItem}/{unit})
        </span>
      ));
    }
  }
}

export function init() {
  observeReadyElementsByClassName(PrunCss.CommodityAd.text, onAdTextReady);
}

void features.add({
  id: 'shipping-per-unit-price',
  init,
});
