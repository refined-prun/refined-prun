import { shallowRef } from 'vue';
import { messages } from '@src/prun-api/data/api-messages';

interface Payload {
  ownCurrency: PrunApi.Currency;
  currencyAccounts: PrunApi.CurrencyAccount[];
}

const all = shallowRef<PrunApi.CurrencyAmount[]>([]);

messages({
  ACCOUNTING_CASH_BALANCES(data: Payload) {
    all.value = data.currencyAccounts.map(x => x.currencyBalance);
  },
});

export const balancesStore = {
  all,
};
