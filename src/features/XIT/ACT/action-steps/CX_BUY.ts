import { act } from '@src/features/XIT/ACT/act-registry';
import { fixed0, fixed02 } from '@src/utils/format';
import { changeInputValue, clickElement } from '@src/util';
import { clamp } from '@src/utils/clamp';
import { cxobStore } from '@src/infrastructure/prun-api/data/cxob';

interface Data {
  exchange: string;
  ticker: string;
  amount: number;
  priceLimit: number;
  buyPartial: boolean;
}

export const CX_BUY = act.addActionStep<Data>({
  type: 'CX_BUY',
  preProcessData: data => ({ ...data, ticker: data.ticker.toUpperCase() }),
  description: data =>
    `Buy ${fixed0(data.amount)} ${data.ticker} from ${data.exchange}${getPriceLimit(data)}`,
  execute: async ctx => {
    const { data, log, setStatus, requestTile, waitAct, waitActionFeedback, complete, fail } = ctx;
    const cxTicker = `${data.ticker}.${data.exchange}`;

    const tile = await requestTile(`CXPO ${cxTicker}`);
    if (!tile) {
      return;
    }

    setStatus('Setting up CXPO buffer...');
    const form = await $(tile.anchor, C.ComExPlaceOrderForm.form);
    const inputs = _$$(form, 'input');
    const quantityInput = inputs[0];
    const priceInput = inputs[1];

    if (!quantityInput || !priceInput) {
      log.error('Missing input elements');
      fail();
      return;
    }

    const priceLimit = data.priceLimit;
    const orderBook = cxobStore.getByTicker(cxTicker);

    if (!orderBook) {
      log.error(`Missing ${cxTicker} order book data`);
      fail();
      return;
    }

    const requiredAmount = data.amount;
    let filledAmount = 0;
    let filledPrice = 0;
    for (const order of orderBook.sellingOrders) {
      const orderPrice = order.limit.amount;
      if (priceLimit < orderPrice) {
        break;
      }
      filledPrice = orderPrice;
      // MM orders don't have the amount.
      if (!order.amount) {
        filledAmount = requiredAmount;
        break;
      }
      filledAmount = clamp(filledAmount + order.amount, 0, requiredAmount);
      if (filledAmount === requiredAmount) {
        break;
      }
    }

    if (filledAmount === 0 && data.buyPartial) {
      log.info(`No matching orders for ${cxTicker}`);
      complete();
      return;
    }

    if (filledAmount < requiredAmount && !data.buyPartial) {
      let message = `Not enough materials on ${cxTicker} to buy ${fixed0(requiredAmount)} ${data.ticker}`;
      if (isFinite(priceLimit)) {
        message += ` with the provided price limit ${fixed02(priceLimit)}/u`;
      }
      log.error(message);
      fail();
      return;
    }

    changeInputValue(quantityInput, filledAmount.toString());
    changeInputValue(priceInput, filledPrice.toString());

    const buyButton = await $(tile.anchor, C.Button.success);

    await waitAct();
    await clickElement(buyButton);
    await waitActionFeedback(tile);

    complete();
  },
});

function getPriceLimit(step: Data) {
  return isFinite(step.priceLimit) ? ` with price limit ${fixed02(step.priceLimit)}/u` : '';
}
