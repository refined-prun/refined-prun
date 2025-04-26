import { cxobStore } from '@src/infrastructure/prun-api/data/cxob';

export function tagUI() {
  tagCxobOrders();
}

function tagCxobOrders() {
  tiles.observe('CXOB', tile => {
    const orderBook = computed(() => cxobStore.getByTicker(tile.parameter));

    subscribe($$(tile.anchor, 'table'), table => {
      const tbodies = _$$(table, 'tbody');
      const asks = tbodies[0];
      const bids = tbodies[2];
      if (asks === undefined || bids === undefined) {
        return;
      }
      const observe = () => {
        // The first row in each section is a section header
        const askRows = _$$(asks, 'tr').slice(1).toReversed();
        const bidRows = _$$(bids, 'tr').slice(1);

        if (!orderBook.value) {
          return;
        }

        function tagRows(rows: HTMLTableRowElement[], orders: PrunApi.CXBrokerOrder[]) {
          if (rows.length !== orders.length) {
            return;
          }

          for (let i = 0; i < orders.length; i++) {
            const id = orders[i].id;
            if (rows[i].getAttribute('data-prun-id') !== id) {
              rows[i].setAttribute('data-prun-id', id);
            }
          }
        }

        tagRows(askRows, orderBook.value.sellingOrders);
        tagRows(bidRows, orderBook.value.buyingOrders);
      };
      const observer = new MutationObserver(observe);
      observer.observe(asks, { childList: true, subtree: true, characterData: true });
      observe();
    });
  });
}
