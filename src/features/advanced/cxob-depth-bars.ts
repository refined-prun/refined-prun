import $style from './cxob-depth-bars.module.css';
import tableAlternatingColors from '../basic/table-rows-alternating-colors.module.css';
import { cxobStore } from '@src/infrastructure/prun-api/data/cxob';
import { clamp } from '@src/utils/clamp';
import { isFiniteOrder } from '@src/core/orders';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';

function onTileReady(tile: PrunTile) {
  const orderDepths = computed(() => {
    const orderBook = cxobStore.getByTicker(tile.parameter);
    if (!orderBook) {
      return undefined;
    }
    const maxDepth = Math.max(
      calculateDepth(orderBook.sellingOrders),
      calculateDepth(orderBook.buyingOrders),
    );
    const depths = new Map<string, number>();
    fillOrderDepths(depths, orderBook.sellingOrders, maxDepth);
    fillOrderDepths(depths, orderBook.buyingOrders, maxDepth);
    return depths;
  });

  subscribe($$(tile.anchor, C.ScrollView.view), scroll => {
    subscribe($$(scroll, 'table'), async table => {
      const tbodies = _$$(table, 'tbody');
      const askSection = tbodies[0];
      const bidSection = tbodies[2];
      if (askSection === undefined || bidSection === undefined) {
        return;
      }
      table.classList.add(tableAlternatingColors.optOut);
      askSection.classList.add($style.tbody, $style.asks);
      bidSection.classList.add($style.tbody, $style.bids);

      subscribe($$(table, 'tr'), row => {
        const id = refPrunId(row);
        watchEffectWhileNodeAlive(row, () => {
          const depth = orderDepths.value?.get(id.value ?? '') ?? 0;
          row.style.setProperty('--rp-market-depth', `${depth}%`);
        });
      });
    });
  });
}

function calculateDepth(orders: PrunApi.CXBrokerOrder[]) {
  let depth = 0;
  for (const order of orders) {
    if (!isFiniteOrder(order)) {
      break;
    }
    depth += order.amount;
  }
  return depth;
}

function fillOrderDepths(
  depths: Map<string, number>,
  orders: PrunApi.CXBrokerOrder[],
  maxDepth: number,
) {
  let accumulated = 0;
  let hitMM = false;
  for (const order of orders) {
    if (!isFiniteOrder(order)) {
      hitMM = true;
      depths.set(order.id, 0);
      continue;
    }
    if (hitMM) {
      depths.set(order.id, 0);
      continue;
    }
    accumulated += order.amount;
    depths.set(order.id, clamp((accumulated / maxDepth) * 100, 0, 100));
  }
}

function init() {
  tiles.observe('CXOB', onTileReady);
}

features.add(import.meta.url, init, 'CXOB: Adds market depth bars.');
