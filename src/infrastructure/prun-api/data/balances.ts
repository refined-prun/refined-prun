import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';

interface Payload {
  ownCurrency: PrunApi.Currency;
  currencyAccounts: PrunApi.CurrencyAccount[];
}

const store = createEntityStore<PrunApi.CurrencyAmount>(x => x.currency);
const state = store.state;
const ownCurrency = ref('');

onApiMessage({
  ACCOUNTING_CASH_BALANCES(data: Payload) {
    ownCurrency.value = data.ownCurrency.code;
    store.setAll(data.currencyAccounts.map(x => x.currencyBalance));
    store.setFetched();
  },
  ACCOUNTING_BOOKINGS(data: { items: PrunApi.BookingItem[] }) {
    for (const item of data.items) {
      if (item.accountCategory !== 'LIQUID_ASSETS' && item.accountType !== 1800) {
        continue;
      }

      store.setOne(item.balance);
    }
  },
});

const currencies = computed(() => state.all.value?.map(x => x.currency));

export const balancesStore = {
  ...state,
  ownCurrency,
  currencies,
};
