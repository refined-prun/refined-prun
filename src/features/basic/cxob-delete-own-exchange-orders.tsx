import $style from './cxob-delete-own-exchange-orders.module.css';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { cxobStore } from '@src/infrastructure/prun-api/data/cxob';
import { fxobStore } from '@src/infrastructure/prun-api/data/fxob';
import DeleteExchangeOrderButton from '@src/components/DeleteExchangeOrderButton.vue';

function onTileReady(tile: PrunTile) {
  const isCX = tile.command === 'CXOB';
  const ordersCommand = isCX ? 'CXOS' : 'FXOS';
  const ownOrderIds = computed(() => {
    const ids = new Set<string>();
    const orders = isCX ? getOwnCXOrders(tile.parameter) : getOwnFXOrders(tile.parameter);
    for (const order of orders) {
      ids.add(order.id);
    }
    return ids;
  });

  subscribe($$(tile.anchor, 'tr'), tr => {
    const id = refPrunId(tr);
    const isOwn = computed(() => {
      const orderId = id.value;
      return orderId !== null && ownOrderIds.value.has(orderId);
    });
    const amountColumn = tr.children[1] as HTMLElement | undefined;
    if (!amountColumn) {
      return;
    }
    createFragmentApp(() =>
      isOwn.value && id.value ? (
        <DeleteExchangeOrderButton orderId={id.value} screenCommand={ordersCommand} />
      ) : null,
    ).prependTo(amountColumn);
  });
}

function getOwnCXOrders(parameter?: string) {
  const orderBook = cxobStore.getByTicker(parameter);
  if (!orderBook) {
    return [];
  }
  return [...orderBook.sellingOrders, ...orderBook.buyingOrders].filter(
    x => x.trader.id === companyStore.value?.id,
  );
}

function getOwnFXOrders(parameter?: string) {
  const orderBook = fxobStore.getByTicker(parameter);
  if (!orderBook) {
    return [];
  }
  return [...orderBook.sellingOrders, ...orderBook.buyingOrders].filter(
    x => x.trader.id === companyStore.value?.id,
  );
}

function init() {
  applyCssRule([`.${C.ComExOrderBookPanel.amount}`, `.${C.ForExOrderBook.amount}`], $style.amount);
  tiles.observe(['CXOB', 'FXOB'], onTileReady);
}

features.add(import.meta.url, init, 'CXOB/FXOB: Adds a delete button to own orders.');
