import link from '@src/infrastructure/prun-ui/css/link.module.css';
import $style from './highlight-own-exchange-orders.module.css';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import { cxobStore } from '@src/infrastructure/prun-api/data/cxob';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { fxobStore } from '@src/infrastructure/prun-api/data/fxob';

type GetOwnOrders = (parameter?: string) => { id: string }[] | undefined;

function onTileReady(tile: PrunTile, getOwnOrders: GetOwnOrders, orderCommand: string) {
  const ownOrders = computed(() => {
    const ownOrders = new Map<string, { id: string }>();
    const orders = getOwnOrders(tile.parameter);
    if (!orders) {
      return ownOrders;
    }
    for (const order of orders) {
      ownOrders.set(order.id, order);
    }
    return ownOrders;
  });
  subscribe($$(tile.anchor, 'tr'), tr => {
    const id = refPrunId(tr);
    const ownOrder = computed(() => ownOrders.value.get(id.value ?? ''));
    const amountColumn = tr.children[1] as HTMLElement;
    if (amountColumn === undefined) {
      return;
    }
    amountColumn.addEventListener('click', e => {
      if (ownOrder.value) {
        void showBuffer(`${orderCommand} ${ownOrder.value.id.substring(0, 8)}`);
        e.preventDefault();
        e.stopPropagation();
      }
    });
    watchEffectWhileNodeAlive(tr, () => {
      const isOwnOrder = ownOrder.value !== undefined;
      tr.classList.toggle($style.ownOrder, isOwnOrder);
      amountColumn.classList.toggle(link.link, isOwnOrder);
    });
  });
}

function getOwnComexOrders(parameter?: string) {
  const orderBook = cxobStore.getByTicker(parameter);
  if (!orderBook) {
    return undefined;
  }
  return [...orderBook.sellingOrders, ...orderBook.buyingOrders].filter(
    x => x.trader.id === companyStore.value?.id,
  );
}

function getOwnForexOrders(parameter?: string) {
  const orderBook = fxobStore.getByTicker(parameter);
  if (!orderBook) {
    return undefined;
  }
  return [...orderBook.sellingOrders, ...orderBook.buyingOrders].filter(
    x => x.trader.id === companyStore.value?.id,
  );
}

function init() {
  tiles.observe('CXOB', x => onTileReady(x, getOwnComexOrders, 'CXO'));
  tiles.observe('FXOB', x => onTileReady(x, getOwnForexOrders, 'FXO'));
}

features.add(import.meta.url, init, 'Highlights own orders in CXOB and FXOB.');
