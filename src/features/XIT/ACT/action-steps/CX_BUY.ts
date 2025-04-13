import { act } from '@src/features/XIT/ACT/act-registry';
import { fixed0, fixed02 } from '@src/utils/format';
import { changeInputValue, clickElement } from '@src/util';
import { fillAmount } from '@src/features/XIT/ACT/actions/cx-buy/utils';

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
  description: data => {
    const { ticker, exchange } = data;
    const cxTicker = `${ticker}.${exchange}`;
    const filled = fillAmount(cxTicker, data.amount, data.priceLimit);
    const amount = filled?.amount ?? data.amount;
    const priceLimit = filled?.priceLimit ?? data.priceLimit;
    let description = `Buy ${fixed0(amount)} ${ticker} on ${exchange}`;
    if (isFinite(priceLimit)) {
      description += ` with price limit ${fixed02(priceLimit)}`;
    }
    if (filled) {
      description += ` (${fixed0(filled.cost)} total cost)`;
    } else {
      description += ' (no price data yet)';
    }
    return description;
  },
  execute: async ctx => {
    const { data, log, setStatus, requestTile, waitAct, waitActionFeedback, complete, fail } = ctx;
    const { amount, ticker, exchange, priceLimit } = data;
    const cxTicker = `${ticker}.${exchange}`;

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

    const filled = fillAmount(cxTicker, amount, priceLimit);

    if (!filled) {
      log.error(`Missing ${cxTicker} order book data`);
      fail();
      return;
    }

    if (filled.amount < amount) {
      if (!data.buyPartial) {
        let message = `Not enough materials on ${exchange} to buy ${fixed0(amount)} ${ticker}`;
        if (isFinite(priceLimit)) {
          message += ` with price limit ${fixed02(priceLimit)}/u`;
        }
        log.error(message);
        fail();
        return;
      }

      const leftover = amount - filled.amount;
      let message =
        `${fixed0(leftover)} ${ticker} will not be bought on ${exchange} ` +
        `(${filled.amount} of ${amount} available`;
      if (isFinite(priceLimit)) {
        message += ` with price limit ${fixed02(priceLimit)}/u`;
      }
      message += ')';
      log.warning(message);
      if (filled.amount === 0) {
        complete();
        return;
      }
    }

    changeInputValue(quantityInput, filled.amount.toString());
    changeInputValue(priceInput, filled.priceLimit.toString());

    const buyButton = await $(tile.anchor, C.Button.success);

    await waitAct();
    await clickElement(buyButton);
    await waitActionFeedback(tile);

    complete();
  },
});
