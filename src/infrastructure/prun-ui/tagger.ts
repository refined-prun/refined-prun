import { cxobStore } from '@src/infrastructure/prun-api/data/cxob';
import { fxobStore } from '@src/infrastructure/prun-api/data/fxob';
import { refAttributeValue } from '@src/utils/reactive-dom';
import { contractsStore } from '@src/infrastructure/prun-api/data/contracts';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';

export function tagUI() {
  tagOrderBook('CXOB', cxobStore);
  tagOrderBook('FXOB', fxobStore);
  tagItems();
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
      observer.observe(table, { childList: true, subtree: true, characterData: true });
      observe();
    });
  });
}

function tagItems() {
  subscribe($$(document, C.ColoredIcon.container), async container => {
    const label = await $(container, C.ColoredIcon.label);
    if (label.textContent !== 'BLCK' && label.textContent !== 'SHPT') {
      return;
    }

    const prunId = getPrunId(container);
    if (prunId) {
      return;
    }

    const attribute = refAttributeValue(container, 'title');
    watchEffectWhileNodeAlive(container, () => {
      const regex = /#([a-zA-Z0-9]+)/;
      const match = attribute.value?.match(regex);

      if (!match) {
        return;
      }

      const id = match[1];
      // The id is the localId of the contract
      // getDestinationByShipmentId is needed until the APEX bug is fixed
      // https://discord.com/channels/667551433503014924/1333780301234569228/1333780301234569228
      const condition =
        contractsStore.getDeliveryConditionByLocalContractId(id) ??
        contractsStore.getDeliveryConditionByShipmentId(id);
      if (!condition?.shipmentItemId) {
        return;
      }

      container.setAttribute('data-prun-id', condition.shipmentItemId);
    });
  });
}
