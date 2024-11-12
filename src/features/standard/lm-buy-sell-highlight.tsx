import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { localAdsStore } from '@src/infrastructure/prun-api/data/local-ads';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.CommodityAd.container), onAdContainerReady);
}

async function onAdContainerReady(container: HTMLElement) {
  const element = await $(container, C.CommodityAd.text);
  const id = getPrunId(container);
  const ad = localAdsStore.getById(id);
  if (!ad || (ad.type !== 'COMMODITY_BUYING' && ad.type !== 'COMMODITY_SELLING')) {
    return;
  }
  if (ad.type !== 'COMMODITY_BUYING' && ad.type !== 'COMMODITY_SELLING') {
    return;
  }

  const type = element.firstChild?.nodeValue ?? null;
  const span = document.createElement('span');
  span.className =
    ad.type === 'COMMODITY_BUYING' ? C.OrderTypeLabel.BUYING : C.OrderTypeLabel.SELLING;
  span.textContent = type;
  element.replaceChild(span, element.firstChild!);
}

function init() {
  tiles.observe(['LM', 'LMA'], onTileReady);
}

features.add({
  id: 'lm-buy-sell-highlight',
  description: 'LM: Colors the BUYING and SELLING in green and red respectively.',
  init,
});
