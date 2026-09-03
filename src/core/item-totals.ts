import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { exchangesStore } from '@src/infrastructure/prun-api/data/exchanges';
import { getPriceAt } from '@src/infrastructure/fio/cx';

export interface ItemExchangeValue {
  code: string;
  name: string;
  currency: string;
  // Worth of the whole holding at this exchange. Undefined when there is no price.
  value?: number;
}

export interface ItemTotalStatus {
  ticker: string;
  material?: PrunApi.Material;
  // Total amount across every inventory the company owns.
  amount: number;
  // Total weight in tonnes and total volume in cubic metres.
  weight: number;
  volume: number;
  values: ItemExchangeValue[];
}

// Every exchange, ordered by code, so the columns keep a stable order.
export const exchanges = computed(() =>
  [...(exchangesStore.all.value ?? [])].sort((a, b) => a.code.localeCompare(b.code)),
);

// Sums every material across all owned inventories: bases, warehouses,
// ship cargo holds and fuel tanks. Construction and upkeep stores are
// already excluded by storagesStore.
const totals = computed(() => {
  const stores = storagesStore.all.value;
  if (!stores) {
    return undefined;
  }
  const totals = new Map<string, number>();
  for (const store of stores) {
    for (const item of store.items) {
      const quantity = item.quantity;
      if (!quantity) {
        continue;
      }
      const ticker = quantity.material.ticker;
      totals.set(ticker, (totals.get(ticker) ?? 0) + quantity.amount);
    }
  }
  return totals;
});

export function getItemTotal(ticker: string): ItemTotalStatus {
  const upper = ticker.toUpperCase();
  const material = materialsStore.getByTicker(upper);
  const amount = totals.value?.get(upper) ?? 0;
  const values = exchanges.value.map<ItemExchangeValue>(exchange => {
    const price = getPriceAt(upper, exchange.code);
    return {
      code: exchange.code,
      name: exchange.name,
      currency: exchange.currency.code,
      value: price === undefined ? undefined : price * amount,
    };
  });
  return {
    ticker: upper,
    material,
    amount,
    weight: (material?.weight ?? 0) * amount,
    volume: (material?.volume ?? 0) * amount,
    values,
  };
}
