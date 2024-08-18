import { CurrencySymbols } from '@src/GameProperties';
import PrunCss from '@src/prun-ui/prun-css';
import features from '@src/feature-registry';
import { observeReadyElementsByClassName } from '@src/utils/mutation-observer';
import { widgetAfter, widgetBefore } from '@src/utils/vue-mount';
import buffers from '@src/prun-ui/prun-buffers';
import { _$$ } from '@src/utils/get-element-by-class-name';
import PpuLabel from '@src/features/lm-shipping-per-unit-price/PpuLabel.vue';
import { reactive } from 'vue';
import { refValue } from '@src/utils/reactive-dom';

function onLMBufferReady(buffer: PrunBuffer) {
  observeReadyElementsByClassName(PrunCss.CommodityAd.text, {
    baseElement: buffer.frame,
    callback: onAdTextReady,
  });
}

function onAdTextReady(element: HTMLDivElement) {
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

function onLMPBufferReady(buffer: PrunBuffer) {
  observeReadyElementsByClassName(PrunCss.LocalMarketPost.form, {
    baseElement: buffer.frame,
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
  buffers.observe(['LM', 'LMA'], onLMBufferReady);
  buffers.observe('LMP', onLMPBufferReady);
}

void features.add({
  id: 'lm-shipping-per-unit-price',
  init,
});
