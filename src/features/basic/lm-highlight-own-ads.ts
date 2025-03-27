import $style from './lm-highlight-own-ads.module.css';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { localAdsStore } from '@src/infrastructure/prun-api/data/local-ads';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.LocalMarket.item), async item => {
    const container = await $(item, C.CommodityAd.container);
    const id = getPrunId(container);
    const ad = localAdsStore.getById(id);
    if (ad?.creator.id === companyStore.value?.id) {
      item.classList.add($style.ownAd);
    }
  });
}

function init() {
  tiles.observe('LM', onTileReady);
}

features.add(import.meta.url, init, 'LM: Highlights own ads.');
