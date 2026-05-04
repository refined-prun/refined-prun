import { act } from '@src/features/XIT/ACT/act-registry';
import Edit from '@src/features/XIT/ACT/actions/cx-sell/Edit.vue';
import Configure from '@src/features/XIT/ACT/actions/cx-sell/Configure.vue';
import { Config } from '@src/features/XIT/ACT/actions/cx-sell/config';
import { CXPO_SELL } from '@src/features/XIT/ACT/action-steps/CXPO_SELL';
import { fixed0, fixed02 } from '@src/utils/format';
import { fillAmount } from '@src/features/XIT/ACT/actions/cx-sell/utils';
import { AssertFn, configurableValue } from '@src/features/XIT/ACT/shared-types';
import {
  atSameLocation,
  deserializeStorage,
  serializeStorage,
} from '@src/features/XIT/ACT/actions/utils';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { exchangesStore } from '@src/infrastructure/prun-api/data/exchanges';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';

act.addAction<Config>({
  type: 'CX Sell',
  description: (action, config) => {
    if (!action.group || !action.exchange) {
      return '--';
    }

    let origin = 'CX warehouse';
    if (action.origin === configurableValue) {
      origin = config?.origin ?? 'configured location';
    } else if (action.origin) {
      origin = action.origin;
    }

    return `Selling group ${action.group} on ${action.exchange} from ${origin}`;
  },
  editComponent: Edit,
  configureComponent: Configure,
  needsConfigure: data => {
    return data.origin === configurableValue;
  },
  isValidConfig: (data, config) => {
    return data.origin !== configurableValue || config.origin !== undefined;
  },
  generateSteps: async ctx => {
    const { data, config, log, fail, getMaterialGroup, emitStep } = ctx;
    const assert: AssertFn = ctx.assert;
    const allowUnfilled = data.allowUnfilled ?? false;
    const sellPartial = data.sellPartial ?? false;

    const materials = await getMaterialGroup(data.group);
    assert(materials, 'Invalid material group');

    const exchange = data.exchange;
    assert(exchange, 'Missing exchange');

    let serializedOrigin = data.origin;
    if (!serializedOrigin) {
      const naturalId = exchangesStore.getNaturalIdFromCode(exchange);
      const warehouse = warehousesStore.getByEntityNaturalId(naturalId);
      const cxWarehouse = storagesStore.getById(warehouse?.storeId);
      assert(cxWarehouse, `CX warehouse not found for ${exchange}`);
      serializedOrigin = serializeStorage(cxWarehouse);
    } else if (serializedOrigin === configurableValue) {
      serializedOrigin = config?.origin;
    }
    const origin = deserializeStorage(serializedOrigin);
    assert(origin, 'Invalid origin');

    for (const ticker of Object.keys(materials)) {
      const amount = materials[ticker];
      const priceLimit = data.priceLimits?.[ticker] ?? 0;
      if (isNaN(priceLimit)) {
        log.error('Non-numerical price limit on ' + ticker);
        continue;
      }

      const cxTicker = `${ticker}.${data.exchange}`;
      const filled = fillAmount(cxTicker, amount, priceLimit);
      let askAmount = amount;

      if (filled && filled.amount < amount && !allowUnfilled) {
        if (!sellPartial) {
          let message = `Not enough demand on ${exchange} to sell ${fixed0(amount)} ${ticker}`;
          if (priceLimit > 0) {
            message += ` with minimum price ${fixed02(priceLimit)}/u`;
          }
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
          continue;
        }

        askAmount = filled.amount;
      }

      emitStep(
        CXPO_SELL({
          exchange,
          originId: origin.id,
          ticker,
          amount: askAmount,
          priceLimit,
          sellPartial,
          allowUnfilled,
        }),
      );
    }
  },
});
