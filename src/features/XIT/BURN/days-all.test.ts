import { describe, expect, it } from 'vitest';
import { MaterialBurn } from '@src/core/burn';
import { getDaysAll } from './days-all';

function mat(partial: Partial<MaterialBurn>): MaterialBurn {
  return {
    input: 0,
    output: 0,
    workforce: 0,
    dailyAmount: -100,
    remainingAllocation: 0,
    inventory: 0,
    inboundInventory: 0,
    daysLeft: 0,
    type: 'input',
    ...partial,
  };
}

describe('getDaysAll', () => {
  it('adds the planet warehouse stock to the base stock', () => {
    expect(getDaysAll(mat({ inventory: 300, warehouseInventory: 500 }))).toBe(8);
  });

  it('counts inbound cargo', () => {
    expect(getDaysAll(mat({ inventory: 300, inboundInventory: 200 }))).toBe(5);
  });

  it('is the same as Days without a warehouse', () => {
    expect(getDaysAll(mat({ inventory: 300 }))).toBe(3);
  });

  it('is infinite for produced materials', () => {
    expect(getDaysAll(mat({ dailyAmount: 50 }))).toBe(Number.POSITIVE_INFINITY);
  });
});
