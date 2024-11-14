import { createFragmentApp } from '@src/utils/vue-fragment-app';
import LMMaterialIcon from './LMMaterialIcon.vue';
import LMShipmentIcon from './LMShipmentIcon.vue';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { localAdsStore } from '@src/infrastructure/prun-api/data/local-ads';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.CommodityAd.container), onContainerReady);
}

async function onContainerReady(container: HTMLElement) {
  const text = await $(container, C.CommodityAd.text);
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
    text.childNodes[1].textContent = text.childNodes[1].textContent!.replace(`(${ticker})`, '');
    createFragmentApp(LMMaterialIcon, { ticker }).before(container.firstElementChild!);
  }
}

function init() {
  tiles.observe('LM', onTileReady);
}

features.add(import.meta.url, init, 'LM: Adds material and shipment icons to ads.');
