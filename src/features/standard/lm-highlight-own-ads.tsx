import classes from './lm-highlight-own-ads.module.css';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
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

function init() {
  tiles.observe('LM', onTileReady);
}

features.add({
  id: 'lm-highlight-own-ads',
  description: 'LM: Highlights own ads.',
  init,
});
