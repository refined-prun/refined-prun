import $style from './lm-sort-ads.module.css';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { getLocalAdById } from '@src/core/shipping/shipping-ads';
import { observeChildListChanged } from '@src/utils/mutation-observer';

interface SortKey {
  group: number;
  ticker: string;
  price: number;
  index: number;
}

const groups: Record<PrunApi.LocalAdType, number> = {
  COMMODITY_SHIPPING: 0,
  COMMODITY_SELLING: 1,
  COMMODITY_BUYING: 2,
};

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.LocalMarket.list), list => {
    observeChildListChanged(list, sortItems);
  });
}

// React owns the item nodes, so the order is set with CSS instead of moving them.
function sortItems(list: HTMLElement) {
  const items = _$$(list, C.LocalMarket.item) as HTMLElement[];
  const keys = new Map(items.map((x, i) => [x, getSortKey(x, i)]));
  const sorted = items.slice().sort((a, b) => compare(keys.get(a)!, keys.get(b)!));
  for (let i = 0; i < sorted.length; i++) {
    sorted[i].style.order = String(i);
  }
}

function getSortKey(item: HTMLElement, index: number): SortKey {
  const container = _$(item, C.CommodityAd.container);
  const ad = getLocalAdById(container ? getPrunId(container) : undefined);
  if (!ad) {
    return { group: 3, ticker: '', price: 0, index };
  }
  if (ad.type === 'COMMODITY_SHIPPING') {
    const size = Math.max(ad.cargoWeight ?? 0, ad.cargoVolume ?? 0);
    return { group: 0, ticker: '', price: size > 0 ? ad.price.amount / size : 0, index };
  }
  const amount = ad.quantity?.amount ?? 0;
  return {
    group: groups[ad.type],
    ticker: ad.quantity?.material.ticker ?? '',
    price: amount > 0 ? ad.price.amount / amount : 0,
    index,
  };
}

function compare(a: SortKey, b: SortKey) {
  if (a.group !== b.group) {
    return a.group - b.group;
  }
  if (a.ticker !== b.ticker) {
    return a.ticker.localeCompare(b.ticker);
  }
  if (a.price !== b.price) {
    return b.price - a.price;
  }
  return a.index - b.index;
}

function init() {
  applyCssRule('LM', `.${C.LocalMarket.list}`, $style.list);
  tiles.observe('LM', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'LM: Sorts ads: shipping by price per t or m³, then selling and buying by ticker and price.',
);
