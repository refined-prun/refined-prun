// Prices are per unit in the currency of the action's target exchange.
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';

export type MaterialBill = Record<string, { quantity: number; price?: number }>;

export function materialBillFromQuantities(quantities: Record<string, number>): MaterialBill {
  const materials: MaterialBill = {};
  for (const ticker in quantities) {
    materials[ticker] = { quantity: quantities[ticker] };
  }
  return materials;
}

// Saved Manual groups contain quantities only.
export function billQuantities(
  bill: MaterialBill,
  filter?: (ticker: string, quantity: number) => boolean,
) {
  const quantities: Record<string, number> = {};
  for (const ticker in bill) {
    const quantity = bill[ticker].quantity;
    if (filter === undefined || filter(ticker, quantity)) {
      quantities[ticker] = quantity;
    }
  }
  return quantities;
}

export function mergeBills(a: MaterialBill | undefined, b: MaterialBill | undefined) {
  if (!a && !b) {
    return undefined;
  }
  const result: MaterialBill = {};
  const applyBill = (bill: MaterialBill | undefined) => {
    if (!bill) {
      return;
    }
    for (const [ticker, entry] of Object.entries(bill)) {
      let existing = result[ticker];
      if (existing === undefined) {
        existing = { quantity: 0 };
        result[ticker] = existing;
      }
      existing.quantity += entry.quantity;
      existing.price = entry.price ?? existing.price;
    }
  };
  applyBill(a);
  applyBill(b);
  return result;
}

export function billTotals(entries: MaterialBill) {
  let weight = 0;
  let volume = 0;
  for (const [ticker, { quantity }] of Object.entries(entries)) {
    const mat = materialsStore.getByTicker(ticker);
    if (mat) {
      weight += mat.weight * quantity;
      volume += mat.volume * quantity;
    }
  }
  return { weight, volume };
}
