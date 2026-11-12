import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { MaterialEntry } from './parsers';

// Cargo bays used for transport contracts, with their max weight (t) and volume (m³).
export interface ShipBay {
  label: string;
  weight: number;
  volume: number;
}

export const SHIP_BAYS: ShipBay[] = [
  { label: 'LCB', weight: 2000, volume: 2000 },
  { label: 'WCB', weight: 3000, volume: 1000 },
  { label: 'HCB', weight: 5000, volume: 5000 },
];

export interface UnitSize {
  weight: number;
  volume: number;
}

export type SizeLookup = (ticker: string) => UnitSize | undefined;

export interface FillStack {
  ticker: string;
  quantity: number;
}

export const gameSize: SizeLookup = ticker => {
  const material = materialsStore.getByTicker(ticker);
  return material ? { weight: material.weight, volume: material.volume } : undefined;
};

// Tolerance for float sums of per-unit weights such as 0.001 t.
const EPSILON = 1e-6;

export function cargoLoad(entries: MaterialEntry[], size: SizeLookup = gameSize) {
  let weight = 0;
  let volume = 0;
  for (const entry of entries) {
    const unit = size(entry.ticker);
    if (unit && Number.isFinite(entry.amount) && entry.amount > 0) {
      weight += unit.weight * entry.amount;
      volume += unit.volume * entry.amount;
    }
  }
  return { weight, volume };
}

function maxUnits(remaining: number, perUnit: number) {
  if (perUnit <= 0) {
    return Infinity;
  }
  return Math.max(0, Math.floor((remaining + EPSILON) / perUnit));
}

// Amounts to add so the bay is filled as far as possible, without exceeding
// either its weight or its volume, given what is already in the list.
// Stacks are filled in the order they were dragged.
export function fillBay(
  bay: ShipBay,
  existing: MaterialEntry[],
  stacks: FillStack[],
  size: SizeLookup = gameSize,
): MaterialEntry[] {
  const load = cargoLoad(existing, size);
  let weightLeft = bay.weight - load.weight;
  let volumeLeft = bay.volume - load.volume;
  const added: MaterialEntry[] = [];
  for (const stack of stacks) {
    const unit = size(stack.ticker);
    if (!unit) {
      continue;
    }
    const amount = Math.min(
      stack.quantity,
      maxUnits(weightLeft, unit.weight),
      maxUnits(volumeLeft, unit.volume),
    );
    if (amount >= 1) {
      added.push({ ticker: stack.ticker, amount });
      weightLeft -= amount * unit.weight;
      volumeLeft -= amount * unit.volume;
    }
  }
  return added;
}

// Share of the bay used, by its tighter limit (0 to 1+).
export function bayUsage(bay: ShipBay, load: { weight: number; volume: number }) {
  return Math.max(load.weight / bay.weight, load.volume / bay.volume);
}
