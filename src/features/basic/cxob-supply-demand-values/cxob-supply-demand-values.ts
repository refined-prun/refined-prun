import $style from './cxob-supply-demand-values.module.css';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import SupplyDemandValues from './SupplyDemandValues.vue';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.ComExOrderBookPanel.spread), async spread => {
    createFragmentApp(SupplyDemandValues, { ticker: tile.parameter }).prependTo(spread);
  });
}

function init() {
  applyCssRule(`.${C.ComExOrderBookPanel.spread}`, $style.spread);
  tiles.observe('CXOB', onTileReady);
}

features.add(import.meta.url, init, 'CXOB: Adds supply and demand value labels.');
