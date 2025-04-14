import { act } from '@src/features/XIT/ACT/act-registry';
import { fixed0, fixed02 } from '@src/utils/format';
import { changeInputValue, clickElement } from '@src/util';
import { fillAmount } from '@src/features/XIT/ACT/actions/cx-buy/utils';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { isDefined } from 'ts-extras';
import { ExchangeTickersReverse } from '@src/legacy';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { watchWhile } from '@src/utils/watch';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';

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
    const { data, log, setStatus, requestTile, waitAct, waitActionFeedback, complete, skip, fail } =
      ctx;
    const { amount, ticker, exchange, priceLimit } = data;
    const cxTicker = `${ticker}.${exchange}`;
    const cxWarehouse = computed(() => {
      const naturalId = ExchangeTickersReverse[exchange];
      const warehouse = warehousesStore.getByEntityNaturalId(naturalId);
      return storagesStore.getById(warehouse?.storeId);
    });

    if (!cxWarehouse.value) {
      log.error(`CX warehouse not found for ${exchange}`);
      fail();
      return;
    }

    const material = materialsStore.getByTicker(ticker);
    if (!material) {
      log.error(`Unknown material ${ticker}`);
      fail();
      return;
    }

    const canFitWeight =
      material.weight * amount <= cxWarehouse.value.weightCapacity - cxWarehouse.value.weightLoad;
    const canFitVolume =
      material.volume * amount <= cxWarehouse.value.volumeCapacity - cxWarehouse.value.volumeLoad;
    if (!canFitWeight || !canFitVolume) {
      log.error(`Cannot not buy ${fixed0(amount)} ${ticker} (will not fit in the warehouse)`);
      fail();
      return;
    }

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
        skip();
        return;
      }
    }

    changeInputValue(quantityInput, filled.amount.toString());
    changeInputValue(priceInput, filled.priceLimit.toString());

    const buyButton = await $(tile.anchor, C.Button.success);

    // Cache description before clicking the buy button because
    // order book data will change after that.
    ctx.cacheDescription();
    await waitAct();
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
    setStatus('Waiting for storage update...');
    await watchWhile(() => warehouseAmount.value === currentAmount);

    complete();
  },
});
