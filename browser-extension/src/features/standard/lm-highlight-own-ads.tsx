import classes from './lm-highlight-own-ads.module.css';
import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { subscribe } from '@src/utils/subscribe-async-generator';
import { $, $$ } from '@src/utils/select-dom';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { localAdsStore } from '@src/infrastructure/prun-api/data/local-ads';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, PrunCss.LocalMarket.item), async item => {
    const container = await $(item, PrunCss.CommodityAd.container);
    const id = getPrunId(container);
    const ad = localAdsStore.getById(id);
    if (ad?.creator.id === companyStore.value?.id) {
      item.classList.add(classes.ownAd);
    }
  });
}

export function init() {
  tiles.observe('LM', onTileReady);
}

void features.add({
  id: 'lm-highlight-own-ads',
  init,
});
