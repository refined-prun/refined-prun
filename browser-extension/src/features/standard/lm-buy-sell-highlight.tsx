import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import features from '@src/feature-registry';
import { observeReadyElementsByClassName } from '@src/utils/mutation-observer';
import tiles from '@src/infrastructure/prun-ui/tiles';
import { _$ } from '@src/utils/get-element-by-class-name';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { localAdsStore } from '@src/infrastructure/prun-api/data/local-ads';

function onTileReady(tile: PrunTile) {
  observeReadyElementsByClassName(PrunCss.CommodityAd.container, {
    baseElement: tile.frame,
    callback: onAdContainerReady,
  });
}

function onAdContainerReady(container: HTMLDivElement) {
  const element = _$(PrunCss.CommodityAd.text, container);
  if (!element) {
    return;
  }

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
    ad.type === 'COMMODITY_BUYING' ? PrunCss.OrderTypeLabel.BUYING : PrunCss.OrderTypeLabel.SELLING;
  span.textContent = type;
  element.replaceChild(span, element.firstChild!);
}

export function init() {
  tiles.observe(['LM', 'LMA'], onTileReady);
}

void features.add({
  id: 'lm-buy-sell-highlight',
  init,
});
