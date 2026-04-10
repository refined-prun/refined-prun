import { act } from '@src/features/XIT/ACT/act-registry';
import { fixed0, fixed02 } from '@src/utils/format';
import { changeInputValue, clickElement } from '@src/util';
import { fillAmount } from '@src/features/XIT/ACT/actions/cx-sell/utils';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { exchangesStore } from '@src/infrastructure/prun-api/data/exchanges';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { watchWhile } from '@src/utils/watch';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { watchEffect } from 'vue';
import { AssertFn } from '@src/features/XIT/ACT/shared-types';

interface Data {
  exchange: string;
  ticker: string;
  amount: number;
  priceLimit: number;
  sellPartial: boolean;
  allowUnfilled: boolean;
}

export const CXPO_SELL = act.addActionStep<Data>({
  type: 'CXPO_SELL',
  preProcessData: data => ({ ...data, ticker: data.ticker.toUpperCase() }),
  description: data => {
    const { ticker, exchange } = data;
    const cxTicker = `${ticker}.${exchange}`;
    const filled = fillAmount(cxTicker, data.amount, data.priceLimit);
    const amount = filled?.amount ?? data.amount;
    const priceLimit = filled?.priceLimit ?? data.priceLimit;
    const allowUnfilled = data.allowUnfilled ?? false;
    const willFillCompletely = filled && filled.amount === data.amount;

    if (!willFillCompletely && allowUnfilled) {
      let description = `Ask for ${fixed0(data.amount)} ${ticker} on ${exchange}`;
      if (priceLimit > 0) {
        description += ` at price ${fixed02(data.priceLimit)}`;
        description += ` (${fixed0(data.amount * data.priceLimit)} total value)`;
      }
      return description;
    }

    let description = `Sell ${fixed0(amount)} ${ticker} on ${exchange}`;
    if (priceLimit > 0) {
      description += ` with minimum price ${fixed02(priceLimit)}`;
    }
    if (filled) {
      description += ` (${fixed0(filled.volume)} total value)`;
    } else {
      description += ' (no price data yet)';
    }
    return description;
  },
  execute: async ctx => {
    const { data, log, setStatus, requestTile, waitAct, waitActionFeedback, complete, skip, fail } =
      ctx;
    const assert: AssertFn = ctx.assert;
    const { amount, ticker, exchange, priceLimit } = data;
    const cxTicker = `${ticker}.${exchange}`;
    const cxWarehouse = computed(() => {
      const naturalId = exchangesStore.getNaturalIdFromCode(exchange);
      const warehouse = warehousesStore.getByEntityNaturalId(naturalId);
      return storagesStore.getById(warehouse?.storeId);
    });
    assert(cxWarehouse.value, `CX warehouse not found for ${exchange}`);

    if (amount <= 0) {
      log.warning(`No ${ticker} was sold (target amount is 0)`);
      skip();
      return;
    }

    const material = materialsStore.getByTicker(ticker);
    assert(material, `Unknown material ${ticker}`);

    const availableAmount =
      cxWarehouse.value.items
        .map(x => x.quantity)
        .find(x => x?.material.ticker === ticker)?.amount ?? 0;
    assert(
      availableAmount >= amount,
      `Cannot sell ${fixed0(amount)} ${ticker} (only ${fixed0(availableAmount)} in warehouse)`,
    );

    const tile = await requestTile(`CXPO ${cxTicker}`);
    if (!tile) {
      return;
    }

    setStatus('Setting up CXPO buffer...');

    const sellButton = await $(tile.anchor, C.Button.danger);
    const form = await $(tile.anchor, C.ComExPlaceOrderForm.form);
    const inputs = _$$(form, 'input');
    const quantityInput = inputs[0];
    assert(quantityInput !== undefined, 'Missing quantity input');
    const priceInput = inputs[1];
    assert(priceInput !== undefined, 'Missing price input');

    let shouldUnwatch = false;
    const unwatch = watchEffect(() => {
      if (shouldUnwatch) {
        unwatch();
        return;
      }

      const filled = fillAmount(cxTicker, amount, priceLimit);

      if (!filled) {
        shouldUnwatch = true;
        fail(`Missing ${cxTicker} order book data`);
        return;
      }

      if (filled.amount < amount && !data.allowUnfilled) {
        if (!data.sellPartial) {
          let message = `Not enough demand on ${exchange} to sell ${fixed0(amount)} ${ticker}`;
          if (priceLimit > 0) {
            message += ` with minimum price ${fixed02(priceLimit)}/u`;
          }
          shouldUnwatch = true;
          fail(message);
          return;
        }

        const leftover = amount - filled.amount;
        let message =
          `${fixed0(leftover)} ${ticker} will not be sold on ${exchange} ` +
          `(${fixed0(filled.amount)} of ${fixed0(amount)} demand available`;
        if (priceLimit > 0) {
          message += ` with minimum price ${fixed02(priceLimit)}/u`;
        }
        message += ')';
        log.warning(message);
        if (filled.amount === 0) {
          shouldUnwatch = true;
          skip();
          return;
        }
      }

      if (data.allowUnfilled) {
        changeInputValue(quantityInput, data.amount.toString());
        changeInputValue(priceInput, fixed02(data.priceLimit));
      } else {
        changeInputValue(quantityInput, filled.amount.toString());
        changeInputValue(priceInput, fixed02(filled.priceLimit));
      }

      // Cache description before clicking the sell button because
      // order book data will change after that.
      ctx.cacheDescription();
    });

    await waitAct();
    unwatch();

    const warehouseAmount = computed(() => {
      return (
        cxWarehouse.value?.items
          .map(x => x.quantity ?? undefined)
          .filter(x => x !== undefined)
          .find(x => x.material.ticker === ticker)?.amount ?? 0
      );
    });
    const currentAmount = warehouseAmount.value;
    const amountToFill = fillAmount(cxTicker, amount, priceLimit)?.amount ?? 0;
    const shouldWaitForUpdate = amountToFill > 0;

    await clickElement(sellButton);
    await waitActionFeedback(tile);

    if (shouldWaitForUpdate) {
      setStatus('Waiting for storage update...');
      await watchWhile(() => warehouseAmount.value === currentAmount);
    } else {
      setStatus('Ask order created');
    }

    complete();
  },
});
