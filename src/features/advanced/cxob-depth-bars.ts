import $style from './cxob-depth-bars.module.css';
import tableAlternatingColors from '../basic/table-rows-alternating-colors.module.css';
import { cxobStore } from '@src/infrastructure/prun-api/data/cxob';
import { observeDescendantListChanged } from '@src/utils/mutation-observer';
import { clamp } from '@src/utils/clamp';

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

      function applyDepthAttribute(rows: HTMLTableRowElement[], orders: PrunApi.CXBrokerOrder[]) {
        if (rows.length !== orders.length) {
          return;
        }

        let totalAmount = 0;
        for (const order of orders) {
          // MM orders don't have the amount.
          if (order.amount === null) {
            break;
          }
          totalAmount += order.amount;
        }

        let accumulated = 0;
        let hitMM = false;
        for (let i = 0; i < orders.length; i++) {
          if (orders[i].amount === null) {
            hitMM = true;
          }
          if (hitMM) {
            rows[i].setAttribute('data-depth', '0');
            continue;
          }
          const order = orders[i];
          accumulated += order.amount ?? 0;
          const depth = clamp((accumulated / totalAmount) * 100, 0, 100);
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
        applyDepthAttribute(askRows, orderBook.value.sellingOrders);
        applyDepthAttribute(bidRows, orderBook.value.buyingOrders);
      });
    });
  });
}

function init() {
  tiles.observe('CXOB', onTileReady);
}

features.add(import.meta.url, init, 'CXOB: Adds market depth bars.');
