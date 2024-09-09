import { CurrencySymbols } from '@src/GameProperties';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import features from '@src/feature-registry';
import { observeReadyElementsByClassName } from '@src/utils/mutation-observer';
import { widgetAfter, widgetBefore } from '@src/utils/vue-mount';
import tiles from '@src/infrastructure/prun-ui/tiles';
import { _$$ } from '@src/utils/get-element-by-class-name';
import PpuLabel from './PpuLabel.vue';
import { reactive } from 'vue';
import { refValue } from '@src/utils/reactive-dom';
import { fixed2 } from '@src/utils/format';

function onLMTileReady(tile: PrunTile) {
  observeReadyElementsByClassName(PrunCss.CommodityAd.text, {
    baseElement: tile.frame,
    callback: onAdTextReady,
  });
}

function onAdTextReady(element: HTMLDivElement) {
  const regExp = /SHIPPING\s([\d,.]+)t\s\/\s([\d,.]+)m³\s@\s([\d,.]+)\s[A-Z]+\sfrom/;
  const matches = element.textContent?.match(regExp);

  if (!matches || matches.length < 4) {
    return;
  }

  const weight = parseFloat(matches[1].replace(/[,.]/g, ''));
  const volume = parseFloat(matches[2].replace(/[,.]/g, ''));
  const totalCost = matches[3];
  const unit = weight > volume ? 't' : 'm³';
  const amount = weight > volume ? weight : volume;
  const total = parseFloat(totalCost.replace(/[,.]/g, ''));
  for (const child of Array.from(element.childNodes)) {
    if (child.nodeValue && child.nodeValue.slice(1) in CurrencySymbols) {
      widgetAfter(child as Element, () => (
        <span>
          {' '}
          ({fixed2(total / amount)}/{unit})
        </span>
      ));
    }
  }
}

function onLMPTileReady(tile: PrunTile) {
  observeReadyElementsByClassName(PrunCss.LocalMarketPost.form, {
    baseElement: tile.frame,
    callback: onFormReady,
  });
}

function onFormReady(form: HTMLFormElement) {
  const type = _$$(PrunCss.StaticInput.static, form);
  if (!type.find(x => x.textContent === 'SHIPPING')) {
    return;
  }

  function selectInput(query: string) {
    return document.evaluate(query, form, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
      .singleNodeValue as HTMLInputElement;
  }

  const commodityInput = selectInput("div[label/span[text()='Commodity']]//input");
  const amountInput = selectInput("div[label/span[text()='Amount']]//input");
  const totalPriceInput = selectInput("div[label/span[text()='Total price']]//input");
  const currencyInput = selectInput("div[label/span[text()='Currency']]//select");

  widgetBefore(
    totalPriceInput,
    PpuLabel,
    reactive({
      materialName: refValue(commodityInput),
      amountInput: refValue(amountInput),
      totalPriceInput: refValue(totalPriceInput),
      currencyInput: refValue(currencyInput),
    }),
  );
}

export function init() {
  tiles.observe(['LM', 'LMA'], onLMTileReady);
  tiles.observe('LMP', onLMPTileReady);
}

void features.add({
  id: 'lm-shipping-per-unit-price',
  init,
});
