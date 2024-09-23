import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import features from '@src/feature-registry';
import { observeReadyElementsByClassName } from '@src/utils/mutation-observer';
import tiles from '@src/infrastructure/prun-ui/tiles';
import { _$ } from '@src/utils/get-element-by-class-name';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import LMMaterialIcon from './LMMaterialIcon.vue';
import LMShipmentIcon from './LMShipmentIcon.vue';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { localAdsStore } from '@src/infrastructure/prun-api/data/local-ads';

function onTileReady(tile: PrunTile) {
  observeReadyElementsByClassName(PrunCss.CommodityAd.container, {
    baseElement: tile.frame,
    callback: onContainerReady,
  });
}

function onContainerReady(container: HTMLDivElement) {
  const text = _$(PrunCss.CommodityAd.text, container);
  if (!text) {
    return;
  }

  const id = getPrunId(container);
  const ad = localAdsStore.getById(id);
  if (!ad) {
    return;
  }

  const type = ad.type;
  const quantity = ad.quantity;
  if (type === 'COMMODITY_SHIPPING') {
    createFragmentApp(LMShipmentIcon).before(container.firstElementChild!);
  }
  if ((type === 'COMMODITY_BUYING' || type === 'COMMODITY_SELLING') && quantity) {
    const ticker = quantity.material.ticker;
    const amount = quantity.amount;
    text.childNodes[1].textContent = ` ${amount} @ `;
    createFragmentApp(LMMaterialIcon, { ticker }).before(container.firstElementChild!);
  }
}

export function init() {
  tiles.observe('LM', onTileReady);
}

void features.add({
  id: 'lm-add-icons',
  init,
});
