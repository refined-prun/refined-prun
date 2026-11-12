import { describe, expect, it } from 'vitest';
import { KnapsackItem, solveKnapsack, solveKnapsackGreedy } from '@src/core/shipping/knapsack';

function random(seed: number) {
  return () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
}

function randomItems(rand: () => number, count: number): KnapsackItem[] {
  return Array.from({ length: count }, () => ({
    weight: Math.round(rand() * 400),
    volume: Math.round(rand() * 400),
    value: Math.round(rand() * 10000),
  }));
}

function bruteForce(items: KnapsackItem[], maxWeight: number, maxVolume: number) {
  let best = 0;
  for (let mask = 0; mask < 1 << items.length; mask++) {
    let weight = 0;
    let volume = 0;
    let value = 0;
    for (let i = 0; i < items.length; i++) {
      if ((mask & (1 << i)) !== 0) {
        weight += items[i].weight;
        volume += items[i].volume;
        value += items[i].value;
      }
    }
    if (weight <= maxWeight && volume <= maxVolume) {
      best = Math.max(best, value);
    }
  }
  return best;
}

describe('solveKnapsack', () => {
  it('finds the optimum on small random instances', () => {
    const rand = random(1);
    for (let run = 0; run < 200; run++) {
      const items = randomItems(rand, Math.floor(rand() * 13) + 1);
      const maxWeight = Math.round(rand() * 1000);
      const maxVolume = Math.round(rand() * 1000);
      const result = solveKnapsack(items, maxWeight, maxVolume);
      expect(result.value).toBe(bruteForce(items, maxWeight, maxVolume));
      expect(result.weight).toBeLessThanOrEqual(maxWeight);
      expect(result.volume).toBeLessThanOrEqual(maxVolume);
    }
  });

  it('is never worse than greedy, even with a tiny node budget', () => {
    const rand = random(2);
    for (let run = 0; run < 200; run++) {
      const items = randomItems(rand, 60);
      const maxWeight = Math.round(rand() * 3000);
      const maxVolume = Math.round(rand() * 3000);
      const greedy = solveKnapsackGreedy(items, maxWeight, maxVolume);
      for (const budget of [0, 10, 1000]) {
        const result = solveKnapsack(items, maxWeight, maxVolume, budget);
        expect(result.value).toBeGreaterThanOrEqual(greedy.value);
        expect(result.weight).toBeLessThanOrEqual(maxWeight);
        expect(result.volume).toBeLessThanOrEqual(maxVolume);
      }
    }
  });

  it('beats greedy when greedy takes the dense small item', () => {
    const items = [
      { weight: 1, volume: 1, value: 2 },
      { weight: 10, volume: 10, value: 10 },
    ];
    expect(solveKnapsackGreedy(items, 10, 10).value).toBe(2);
    expect(solveKnapsack(items, 10, 10).value).toBe(10);
  });

  it('ignores items that do not fit or pay nothing', () => {
    const items = [
      { weight: 11, volume: 1, value: 100 },
      { weight: 1, volume: 1, value: 0 },
    ];
    expect(solveKnapsack(items, 10, 10).items).toEqual([]);
  });
});
