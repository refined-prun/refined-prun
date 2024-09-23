import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import features from '@src/feature-registry';
import { observeReadyElementsByClassName } from '@src/utils/mutation-observer';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import tiles from '@src/infrastructure/prun-ui/tiles';
import { _$, _$$ } from '@src/utils/get-element-by-class-name';
import PpuLabel from './PpuLabel.vue';
import { reactive } from 'vue';
import { refValue } from '@src/utils/reactive-dom';
import { fixed2 } from '@src/utils/format';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { localAdsStore } from '@src/infrastructure/prun-api/data/local-ads';

function onLMTileReady(tile: PrunTile) {
  observeReadyElementsByClassName(PrunCss.CommodityAd.container, {
    baseElement: tile.frame,
    callback: onAdContainerReady,
  });
}

function onAdContainerReady(container: HTMLDivElement) {
  const text = _$(PrunCss.CommodityAd.text, container);
  if (!text) {
    return;
  }

  const id = getPrunId(container);
  const ad = localAdsStore.getById(id);
  if (!ad || ad.type !== 'COMMODITY_SHIPPING') {
    return;
  }

  const weight = ad.cargoWeight;
  const volume = ad.cargoVolume;
  if (!weight || !volume) {
    return;
  }
  const unit = weight > volume ? 't' : 'm³';
  const amount = weight > volume ? weight : volume;
  const total = ad.price.amount;
  for (let i = 0; i < text.childNodes.length; i++) {
    const child = text.childNodes[i];
    if (child.nodeValue && child.nodeValue.includes(ad.price.currency)) {
      createFragmentApp(() => (
        <span>
          {' '}
          ({fixed2(total / amount)}/{unit})
        </span>
      )).after(child as Element);
      break;
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

  createFragmentApp(
    PpuLabel,
    reactive({
      materialName: refValue(commodityInput),
      amountInput: refValue(amountInput),
      totalPriceInput: refValue(totalPriceInput),
      currencyInput: refValue(currencyInput),
    }),
  ).before(totalPriceInput);
}

export function init() {
  tiles.observe(['LM', 'LMA'], onLMTileReady);
  tiles.observe('LMP', onLMPTileReady);
}

void features.add({
  id: 'lm-shipping-per-unit-price',
  init,
});
