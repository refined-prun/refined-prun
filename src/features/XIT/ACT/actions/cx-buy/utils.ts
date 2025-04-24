import { cxobStore } from '@src/infrastructure/prun-api/data/cxob';
import { isFiniteOrder } from '@src/core/orders';

export function fillAmount(cxTicker: string, amount: number, priceLimit: number) {
  const orderBook = cxobStore.getByTicker(cxTicker);
  if (!orderBook) {
    return undefined;
  }

  const filled = {
    amount: 0,
    priceLimit: 0,
    cost: 0,
  };
  const orders = orderBook.sellingOrders.slice().sort((a, b) => a.limit.amount - b.limit.amount);
  for (const order of orders) {
    const orderPrice = order.limit.amount;
    if (priceLimit < orderPrice) {
      break;
    }
    const orderAmount = isFiniteOrder(order) ? order.amount : Infinity;
    const remaining = amount - filled.amount;
    const filledByOrder = Math.min(remaining, orderAmount);
    filled.priceLimit = orderPrice;
    filled.amount += filledByOrder;
    filled.cost += filledByOrder * orderPrice;
    if (filled.amount === amount) {
      break;
    }
  }

  return filled;
}
