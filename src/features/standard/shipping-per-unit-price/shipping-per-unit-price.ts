import { createFragmentApp } from '@src/utils/vue-fragment-app';
import PpuLabel from './PpuLabel.vue';
import { refValue } from '@src/utils/reactive-dom';
import { fixed2 } from '@src/utils/format';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { localAdsStore } from '@src/infrastructure/prun-api/data/local-ads';

function onLMTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.CommodityAd.container), onAdContainerReady);
}

async function onAdContainerReady(container: HTMLElement) {
  const text = await $(container, C.CommodityAd.text);
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
      const span = document.createElement('span');
      span.textContent = ` (${fixed2(total / amount)}/${unit})`;
      child.after(span);
      break;
    }
  }
}

function onLMPTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.LocalMarketPost.form), onFormReady);
}

function onFormReady(form: HTMLElement) {
  const type = _$$(form, C.StaticInput.static);
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
  ).before(totalPriceInput.parentElement!);
}

function init() {
  tiles.observe(['LM', 'LMA'], onLMTileReady);
  tiles.observe('LMP', onLMPTileReady);
}

features.add(import.meta.url, init, 'Adds a per-unit price label to ads in LM, LMA, and LMP.');
