export interface KnapsackItem {
  weight: number;
  volume: number;
  value: number;
}

export interface KnapsackResult<T extends KnapsackItem> {
  items: T[];
  weight: number;
  volume: number;
  value: number;
}

// Bounds the search on large inputs. The greedy result seeds the incumbent,
// so stopping early still returns a result that is at least as good as greedy.
const defaultNodeBudget = 200_000;

export function solveKnapsack<T extends KnapsackItem>(
  items: T[],
  maxWeight: number,
  maxVolume: number,
  nodeBudget = defaultNodeBudget,
): KnapsackResult<T> {
  const fitting = items.filter(x => x.value > 0 && x.weight <= maxWeight && x.volume <= maxVolume);
  const sorted = sortByRatio(fitting, maxWeight, maxVolume);
  const greedy = solveGreedy(sorted, maxWeight, maxVolume);

  let bestValue = greedy.value;
  let bestPicks = greedy.picks;
  const picks: boolean[] = new Array(sorted.length).fill(false);
  const byWeight = densityOrder(sorted, x => x.weight);
  const byVolume = densityOrder(sorted, x => x.volume);
  let nodes = 0;

  const search = (index: number, weight: number, volume: number, value: number) => {
    if (value > bestValue) {
      bestValue = value;
      bestPicks = picks.slice();
    }
    if (index === sorted.length || nodes++ >= nodeBudget) {
      return;
    }
    const bound = Math.min(
      fractionalBound(sorted, byWeight, index, maxWeight - weight, x => x.weight),
      fractionalBound(sorted, byVolume, index, maxVolume - volume, x => x.volume),
    );
    if (value + bound <= bestValue) {
      return;
    }
    const item = sorted[index];
    if (weight + item.weight <= maxWeight && volume + item.volume <= maxVolume) {
      picks[index] = true;
      search(index + 1, weight + item.weight, volume + item.volume, value + item.value);
      picks[index] = false;
    }
    search(index + 1, weight, volume, value);
  };
  search(0, 0, 0, 0);

  return toResult(sorted.filter((_, i) => bestPicks[i]));
}

export function solveKnapsackGreedy<T extends KnapsackItem>(
  items: T[],
  maxWeight: number,
  maxVolume: number,
): KnapsackResult<T> {
  const fitting = items.filter(x => x.value > 0 && x.weight <= maxWeight && x.volume <= maxVolume);
  const sorted = sortByRatio(fitting, maxWeight, maxVolume);
  const greedy = solveGreedy(sorted, maxWeight, maxVolume);
  return toResult(sorted.filter((_, i) => greedy.picks[i]));
}

function sortByRatio<T extends KnapsackItem>(items: T[], maxWeight: number, maxVolume: number) {
  const size = (x: KnapsackItem) => Math.max(x.weight / maxWeight, x.volume / maxVolume);
  const ratio = (x: KnapsackItem) => {
    const s = size(x);
    return s === 0 ? Number.POSITIVE_INFINITY : x.value / s;
  };
  return items.slice().sort((a, b) => ratio(b) - ratio(a));
}

function solveGreedy(items: KnapsackItem[], maxWeight: number, maxVolume: number) {
  const picks: boolean[] = new Array(items.length).fill(false);
  let weight = 0;
  let volume = 0;
  let value = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (weight + item.weight <= maxWeight && volume + item.volume <= maxVolume) {
      picks[i] = true;
      weight += item.weight;
      volume += item.volume;
      value += item.value;
    }
  }
  return { picks, value };
}

function densityOrder(items: KnapsackItem[], size: (x: KnapsackItem) => number) {
  const density = (x: KnapsackItem) => {
    const s = size(x);
    return s === 0 ? Number.POSITIVE_INFINITY : x.value / s;
  };
  return items.map((_, i) => i).sort((a, b) => density(items[b]) - density(items[a]));
}

// Dropping one dimension can only raise the optimum, so the fractional relaxation
// of either dimension alone is a valid upper bound for the 2D problem.
function fractionalBound(
  items: KnapsackItem[],
  order: number[],
  from: number,
  capacity: number,
  size: (x: KnapsackItem) => number,
) {
  let bound = 0;
  for (const i of order) {
    if (i < from) {
      continue;
    }
    const item = items[i];
    const s = size(item);
    if (s <= capacity) {
      capacity -= s;
      bound += item.value;
      continue;
    }
    bound += (item.value * capacity) / s;
    break;
  }
  return bound;
}

function toResult<T extends KnapsackItem>(items: T[]): KnapsackResult<T> {
  return {
    items,
    weight: sumBy(items, x => x.weight),
    volume: sumBy(items, x => x.volume),
    value: sumBy(items, x => x.value),
  };
}
