import { computed, ref } from 'vue';
import { messages } from '@src/infrastructure/prun-api/data/api-messages';

interface Payload {
  ownCurrency: PrunApi.Currency;
  currencyAccounts: PrunApi.CurrencyAccount[];
}

const all = ref<PrunApi.CurrencyAmount[]>([]);

messages({
  ACCOUNTING_CASH_BALANCES(data: Payload) {
    all.value = data.currencyAccounts.map(x => x.currencyBalance);
  },
  ACCOUNTING_BOOKINGS(data: { items: PrunApi.BookingItem[] }) {
    for (const item of data.items) {
      if (item.accountCategory !== 'LIQUID_ASSETS' && item.accountType !== 1800) {
        continue;
      }

      const account = all.value.find(x => x.currency === item.balance.currency);
      if (account) {
        account.amount = item.balance.amount;
      }
    }
  },
});

const currencies = computed(() => all.value.map(x => x.currency));

export const balancesStore = {
  all,
  currencies,
};
