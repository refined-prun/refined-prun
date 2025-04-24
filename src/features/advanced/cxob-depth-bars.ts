import $style from './cxob-depth-bars.module.css';
import tableAlternatingColors from '../basic/table-rows-alternating-colors.module.css';
import { cxobStore } from '@src/infrastructure/prun-api/data/cxob';
import { observeDescendantListChanged } from '@src/utils/mutation-observer';
import { clamp } from '@src/utils/clamp';
import { isFiniteOrder } from '@src/core/orders';

function onTileReady(tile: PrunTile) {
  const orderBook = computed(() => cxobStore.getByTicker(tile.parameter));

  subscribe($$(tile.anchor, C.ScrollView.view), scroll => {
    subscribe($$(scroll, 'table'), async table => {
      const tbodies = _$$(table, 'tbody');
      const asks = tbodies[0];
      const bids = tbodies[2];
      if (asks === undefined || bids === undefined) {
        return;
      }
      table.classList.add(tableAlternatingColors.optOut);
      asks.classList.add($style.tbody, $style.asks);
      bids.classList.add($style.tbody, $style.bids);

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

      function applyDepthAttribute(
        rows: HTMLTableRowElement[],
        orders: PrunApi.CXBrokerOrder[],
        maxDepth: number,
      ) {
        if (rows.length !== orders.length) {
          return;
        }

        let accumulated = 0;
        let hitMM = false;
        for (let i = 0; i < orders.length; i++) {
          if (!isFiniteOrder(orders[i])) {
            hitMM = true;
          }
          if (hitMM) {
            rows[i].setAttribute('data-depth', '0');
            continue;
          }
          const order = orders[i];
          accumulated += order.amount ?? 0;
          const depth = clamp((accumulated / maxDepth) * 100, 0, 100);
          rows[i].setAttribute('data-depth', depth.toString());
        }
      }

      observeDescendantListChanged(table, () => {
        // The first row in each section is a section header
        const askRows = _$$(asks, 'tr').slice(1).toReversed();
        const bidRows = _$$(bids, 'tr').slice(1);
        for (const row of askRows) {
          row.removeAttribute('data-depth');
        }
        for (const row of bidRows) {
          row.removeAttribute('data-depth');
        }

        if (!orderBook.value) {
          return;
        }
        const askDepth = calculateDepth(orderBook.value.sellingOrders);
        const bidDepth = calculateDepth(orderBook.value.buyingOrders);
        const maxDepth = Math.max(askDepth, bidDepth);
        applyDepthAttribute(askRows, orderBook.value.sellingOrders, maxDepth);
        applyDepthAttribute(bidRows, orderBook.value.buyingOrders, maxDepth);
      });
    });
  });
}

function init() {
  tiles.observe('CXOB', onTileReady);
}

features.add(import.meta.url, init, 'CXOB: Adds market depth bars.');
