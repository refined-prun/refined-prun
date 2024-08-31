import { computed } from 'vue';
import { balancesStore } from '@src/infrastructure/prun-api/data/balances';
import { cxosStore } from '@src/infrastructure/prun-api/data/cxos';
import { fxosStore } from '@src/infrastructure/prun-api/data/fxos';

interface CurrencyDeposits {
  currency: string;
  cx: number;
  fx: number;
}

export const deposits = computed(() => {
  const deposits = new Map<string, CurrencyDeposits>();

  for (const order of cxosStore.all.value) {
    if (order.status === 'FILLED' || order.type === 'SELLING') {
      continue;
    }

    const deposit = order.limit.amount * order.amount;
    const currency = order.limit.currency;
    let currencyDeposits = deposits.get(currency);
    if (!currencyDeposits) {
      currencyDeposits = {
        currency,
        cx: 0,
        fx: 0,
      };
      deposits.set(currency, currencyDeposits);
    }
    currencyDeposits.cx += deposit;
  }

  for (const order of fxosStore.all.value) {
    if (order.status === 'FILLED') {
      continue;
    }

    let deposit: number;
    let currency: string;
    if (order.type === 'SELLING') {
      deposit = order.amount.amount;
      currency = order.limit.base;
    } else {
      deposit = order.amount.amount * order.limit.rate;
      currency = order.limit.quote;
    }
    let currencyDeposits = deposits.get(currency);
    if (!currencyDeposits) {
      currencyDeposits = {
        currency,
        cx: 0,
        fx: 0,
      };
      deposits.set(currency, currencyDeposits);
    }
    currencyDeposits.fx += deposit;
  }

  for (const currency of balancesStore.currencies.value) {
    if (!deposits.has(currency)) {
      deposits.set(currency, {
        currency,
        cx: 0,
        fx: 0,
      });
    }
  }

  return deposits;
});
