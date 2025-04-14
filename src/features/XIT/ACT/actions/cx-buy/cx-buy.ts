import { act } from '@src/features/XIT/ACT/act-registry';
import Edit from '@src/features/XIT/ACT/actions/cx-buy/Edit.vue';
import { CX_BUY } from '@src/features/XIT/ACT/action-steps/CX_BUY';
import { fixed0, fixed02 } from '@src/utils/format';
import { fillAmount } from '@src/features/XIT/ACT/actions/cx-buy/utils';

act.addAction({
  type: 'CX Buy',
  description: action => {
    if (!action.group || !action.exchange) {
      return '--';
    }

    return 'Buying group ' + action.group + ' from ' + action.exchange;
  },
  editComponent: Edit,
  generateSteps: async ctx => {
    const { data, state, log, fail, getMaterialGroup, emitStep } = ctx;

    const materials = await getMaterialGroup(data.group);
    if (!materials) {
      log.error('Invalid material group on MTRA');
    }

    const exchange = data.exchange;
    if (!exchange) {
      log.error('Missing exchange on CX buy');
    }

    if (!materials || !exchange) {
      fail();
      return;
    }

    // Take out materials in CX inventory if requested
    if ((data.useCXInv ?? true) && data.exchange) {
      for (const mat of Object.keys(materials)) {
        for (const CXMat of Object.keys(state.WAR[data.exchange])) {
          if (CXMat === mat) {
            // Amount of material used (minimum of needed and had on hand)
            const used = Math.min(materials[mat], state.WAR[data.exchange][CXMat]);
            materials[mat] -= used;
            state.WAR[data.exchange][CXMat] -= used;
            if (state.WAR[data.exchange][mat] <= 0) {
              // Remove material from CX Inv is already allocated
              delete state.WAR[data.exchange][CXMat];
            }
          }
        }
        if (materials[mat] <= 0) {
          // Remove material from list if you already have enough on the CX
          delete materials[mat];
        }
      }
    }

    for (const ticker of Object.keys(materials)) {
      const amount = materials[ticker];
      const priceLimit = data.priceLimits?.[ticker] ?? Infinity;
      if (isNaN(priceLimit)) {
        log.error('Non-numerical price limit on ' + ticker);
        continue;
      }

      const cxTicker = `${ticker}.${data.exchange}`;
      const filled = fillAmount(cxTicker, amount, priceLimit);

      if (filled && filled.amount < amount) {
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
          `(${fixed0(filled.amount)} of ${fixed0(amount)} available`;
        if (isFinite(priceLimit)) {
          message += ` with price limit ${fixed02(priceLimit)}/u`;
        }
        message += ')';
        log.warning(message);
        if (filled.amount === 0) {
          continue;
        }
      }

      emitStep(
        CX_BUY({
          exchange,
          ticker,
          amount: filled?.amount ?? amount,
          priceLimit: filled?.priceLimit ?? priceLimit,
          buyPartial: data.buyPartial ?? false,
        }),
      );
    }
  },
});
