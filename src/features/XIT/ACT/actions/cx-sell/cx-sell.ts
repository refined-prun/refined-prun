import { act } from '@src/features/XIT/ACT/act-registry';
import Edit from '@src/features/XIT/ACT/actions/cx-sell/Edit.vue';
import { CXPO_SELL } from '@src/features/XIT/ACT/action-steps/CXPO_SELL';
import { fixed0, fixed02 } from '@src/utils/format';
import { fillAmount } from '@src/features/XIT/ACT/actions/cx-sell/utils';
import { AssertFn } from '@src/features/XIT/ACT/shared-types';

act.addAction({
  type: 'CX Sell',
  description: action => {
    if (!action.group || !action.exchange) {
      return '--';
    }

    return 'Selling group ' + action.group + ' on ' + action.exchange;
  },
  editComponent: Edit,
  generateSteps: async ctx => {
    const { data, log, fail, getMaterialGroup, emitStep } = ctx;
    const assert: AssertFn = ctx.assert;
    const allowUnfilled = data.allowUnfilled ?? false;
    const sellPartial = data.sellPartial ?? false;

    const materials = await getMaterialGroup(data.group);
    assert(materials, 'Invalid material group');

    const exchange = data.exchange;
    assert(exchange, 'Missing exchange');

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
