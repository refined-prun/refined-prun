import { act } from '@src/features/XIT/ACT/act-registry';
import Edit from '@src/features/XIT/ACT/actions/cx-buy/Edit.vue';
import Configure from '@src/features/XIT/ACT/actions/cx-buy/Configure.vue';
import { Config } from '@src/features/XIT/ACT/actions/cx-buy/config';
import { CXPO_BUY } from '@src/features/XIT/ACT/action-steps/CXPO_BUY';
import { fixed0, fixed02 } from '@src/utils/format';
import { fillAmount } from '@src/features/XIT/ACT/actions/cx-buy/utils';
import { AssertFn, configurableValue } from '@src/features/XIT/ACT/shared-types';
import { userData } from '@src/store/user-data';

act.addAction<Config>({
  type: 'CX Buy',
  shortDescription: 'Buy materials from a commodity exchange',
  description: (action, config) => {
    if (!action.group || !action.exchange) {
      return '--';
    }

    const exchange =
      action.exchange === configurableValue
        ? (config?.exchange ?? 'configured exchange')
        : action.exchange;
    return 'Buying group ' + action.group + ' from ' + exchange;
  },
  editComponent: Edit,
  configureComponent: Configure,
  needsConfigure: data => data.exchange === configurableValue,
  isValidConfig: (data, config) =>
    !!(data.skippable && config.skip) ||
    data.exchange !== configurableValue ||
    config.exchange !== undefined,
  generateSteps: async ctx => {
    const { data, config, state, log, getMaterialGroup, emitStep } = ctx;

    if (data.skippable && config.skip) {
      return;
    }
    const assert: AssertFn = ctx.assert;
    const allowUnfilled = data.allowUnfilled ?? false;
    const buyPartial = data.buyPartial ?? false;

    const materials = await getMaterialGroup(data.group);
    assert(materials, 'Invalid material group');

    const exchange = data.exchange === configurableValue ? config.exchange : data.exchange;
    assert(exchange, 'Missing exchange');

    // Take out materials in CX inventory if requested
    if ((data.useCXInv ?? true) && exchange) {
      for (const mat of Object.keys(materials)) {
        for (const CXMat of Object.keys(state.WAR[exchange])) {
          if (CXMat === mat) {
            // Amount of material used (minimum of needed and had on hand)
            const used = Math.min(materials[mat].quantity, state.WAR[exchange][CXMat]);
            materials[mat].quantity -= used;
            state.WAR[exchange][CXMat] -= used;
            if (state.WAR[exchange][mat] <= 0) {
              // Remove material from CX Inv is already allocated
              delete state.WAR[exchange][CXMat];
            }
          }
        }
        if (materials[mat].quantity <= 0) {
          // Remove material from list if you already have enough on the CX
          delete materials[mat];
        }
      }
    }

    const noBuy = new Set(userData.settings.noBuy);
    for (const ticker of Object.keys(materials)) {
      if (noBuy.has(ticker)) {
        continue;
      }
      const { quantity: amount, price } = materials[ticker];
      const priceLimit = price ?? data.priceLimits?.[ticker] ?? Infinity;
      if (isNaN(priceLimit)) {
        log.error('Non-numerical price limit on ' + ticker);
        continue;
      }

      const cxTicker = `${ticker}.${exchange}`;
      const filled = fillAmount(cxTicker, amount, priceLimit);
      let bidAmount = amount;

      if (filled && filled.amount < amount && !allowUnfilled) {
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
          continue;
        }
        if (buyPartial) {
          // Lock the order to what is available now. Otherwise the full amount is
          // kept and the step buys whatever is available when it actually runs.
          bidAmount = filled.amount;
        }
      }

      emitStep(
        CXPO_BUY({
          exchange,
          ticker,
          amount: bidAmount,
          priceLimit: priceLimit,
          allowUnfilled: allowUnfilled,
        }),
      );
    }
  },
});
