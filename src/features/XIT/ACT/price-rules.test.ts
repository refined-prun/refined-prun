import { describe, expect, it } from 'vitest';
import { act } from './act-registry';
import { getGroupPriceRules } from './price-rules';

const base = { description: () => '', editComponent: {}, generateSteps: async () => {} };
act.addAction({
  ...base,
  type: 'CX Buy',
  priceRule: data => (data.allowUnfilled ? { maxSignificantFigures: 3 } : undefined),
});
act.addAction({ ...base, type: 'CONT Trade', priceRule: () => ({ required: true }) });
act.addAction({ ...base, type: 'MTRA' });

function createPackage(actions: UserData.ActionData[]) {
  return { global: { name: 'Test' }, groups: [], actions } as UserData.ActionPackageData;
}

describe('getGroupPriceRules', () => {
  it('collects the rules of each action that uses the group', () => {
    const pkg = createPackage([
      { type: 'CX Buy', name: 'Buy', group: 'A', allowUnfilled: true },
      { type: 'MTRA', name: 'Move', group: 'A' },
      { type: 'CONT Trade', name: 'Sell', group: 'A' },
    ]);
    expect(getGroupPriceRules(pkg, 'A')).toEqual([
      { source: '[Buy]', maxSignificantFigures: 3 },
      { source: '[Sell]', required: true },
    ]);
  });

  it('ignores the actions that use a different group', () => {
    const pkg = createPackage([
      { type: 'CX Buy', name: 'Buy', group: 'A', allowUnfilled: true },
      { type: 'CONT Trade', name: 'Sell', group: 'B' },
    ]);
    expect(getGroupPriceRules(pkg, 'B')).toEqual([{ source: '[Sell]', required: true }]);
  });

  it('has no rule for a CX Buy that does not bid', () => {
    const pkg = createPackage([{ type: 'CX Buy', name: 'Buy', group: 'A' }]);
    expect(getGroupPriceRules(pkg, 'A')).toEqual([]);
  });
});
