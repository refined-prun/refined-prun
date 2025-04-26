import { cxobStore } from '@src/infrastructure/prun-api/data/cxob';
import { fxobStore } from '@src/infrastructure/prun-api/data/fxob';

export function tagUI() {
  tagOrderBook('CXOB', cxobStore);
  tagOrderBook('FXOB', fxobStore);
}

interface Broker {
  sellingOrders: { id: string }[];
  buyingOrders: { id: string }[];
}

interface BrokerStore {
  getByTicker(ticker?: string): Broker | undefined;
}

function tagOrderBook(command: string, store: BrokerStore) {
  tiles.observe(command, tile => {
    const orderBook = computed(() => store.getByTicker(tile.parameter));

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

        function tagRows(rows: HTMLTableRowElement[], orders: { id: string }[]) {
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
