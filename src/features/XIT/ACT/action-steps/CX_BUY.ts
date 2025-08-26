import { act } from '@src/features/XIT/ACT/act-registry';
import { fixed0, fixed02 } from '@src/utils/format';
import { changeInputValue, clickElement } from '@src/util';
import { fillAmount } from '@src/features/XIT/ACT/actions/cx-buy/utils';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { isDefined } from 'ts-extras';
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
  buyPartial: boolean;
  createBids: boolean;
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
    const createBids = data.createBids ?? false;

    if (createBids) {
      let description = `Bid for ${fixed0(data.amount)} ${ticker} on ${exchange}`;
      if (isFinite(priceLimit)) {
        description += ` at price ${fixed02(data.priceLimit)}`;
      }
      return description;
    }

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

    const material = materialsStore.getByTicker(ticker);
    assert(material, `Unknown material ${ticker}`);

    const canFitWeight =
      material.weight * amount <= cxWarehouse.value.weightCapacity - cxWarehouse.value.weightLoad;
    const canFitVolume =
      material.volume * amount <= cxWarehouse.value.volumeCapacity - cxWarehouse.value.volumeLoad;
    assert(
      canFitWeight && canFitVolume,
      `Cannot not buy ${fixed0(amount)} ${ticker} (will not fit in the warehouse)`,
    );

    const tile = await requestTile(`CXPO ${cxTicker}`);
    if (!tile) {
      return;
    }

    setStatus('Setting up CXPO buffer...');

    const buyButton = await $(tile.anchor, C.Button.success);
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

      if (data.createBids) {
        // don't check to see if the amount is present on the cx (in the `filled` var).
        // Just make the bids for the full amount at the specified price limit.
        changeInputValue(quantityInput, amount.toString());
        changeInputValue(priceInput, priceLimit.toString());
      } else {
        if (filled.amount < amount) {
          if (!data.buyPartial) {
            let message = `Not enough materials on ${exchange} to buy ${fixed0(amount)} ${ticker}`;
            if (isFinite(priceLimit)) {
              message += ` with price limit ${fixed02(priceLimit)}/u`;
            }
            shouldUnwatch = true;
            fail(message);
            return;
          }

          const leftover = amount - filled.amount;
          let message =
            `${fixed0(leftover)} ${ticker} will not be bought on ${exchange} ` +
            `(${fixed0(filled.amount)} of ${fixed0(amount)} available`;
          if (isFinite(priceLimit)) {
            message += ` with price limit ${fixed02(priceLimit)}/u`;
          }
          message += ')';
          log.warning(message);
          if (filled.amount === 0) {
            shouldUnwatch = true;
            skip();
            return;
          }
        }
        changeInputValue(quantityInput, filled.amount.toString());
        changeInputValue(priceInput, filled.priceLimit.toString());
      }

      // Cache description before clicking the buy button because
      // order book data will change after that.
      ctx.cacheDescription();
    });

    await waitAct();
    unwatch();

    const warehouseAmount = computed(() => {
      return (
        cxWarehouse.value?.items
          .map(x => x.quantity ?? undefined)
          .filter(isDefined)
          .find(x => x.material.ticker === ticker)?.amount ?? 0
      );
    });
    const currentAmount = warehouseAmount.value;
    await clickElement(buyButton);
    await waitActionFeedback(tile);

    // if we created bids, there will be no storage update.
    if (data.createBids) {
      // but it would be cool to wait for a CXPO update, if we could trigger that..?
      setStatus('Bids created.');
    } else {
      setStatus('Waiting for storage update...');
      await watchWhile(() => warehouseAmount.value === currentAmount);
    }

    complete();
  },
});
