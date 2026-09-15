import { describe, expect, it } from 'vitest';
import { popiBuildings } from '@src/core/popi-buildings';
import { buildImportPlan, parseGovBurnImport } from '@src/features/XIT/GOVBURN/govburn-import';
import { resolveSlots } from '@src/features/XIT/GOVBURN/utils';

const phobosJson = {
  planet: 'Phobos',
  buildings: [
    { building: 'SST', selectedLevel: 8, maxLevel: 10, materials: ['DW', 'OFF', 'SUN'] },
    { building: 'INF', selectedLevel: 5, maxLevel: 8, materials: ['OFF', 'STR'] },
    { building: 'HOS', selectedLevel: 1, maxLevel: 2, materials: ['BND'] },
    { building: 'PAR', selectedLevel: 7, maxLevel: 10, materials: ['DW', 'FOD', 'PFE'] },
    { building: '4DA', selectedLevel: 2, maxLevel: 2, materials: ['HOG', 'EDC'] },
    { building: 'ART', selectedLevel: 6, maxLevel: 6, materials: ['MHP', 'UTS'] },
    { building: 'PBH', selectedLevel: 3, maxLevel: 3, materials: ['OFF', 'EDC', 'IDC'] },
    { building: 'UNI', selectedLevel: 6, maxLevel: 7, materials: ['IDC'] },
  ],
};

function upkeep(ticker: string): UserData.GovBurnUpkeep {
  return { ticker, stored: 0, amount: 1, duration: 1, nextTick: 0 };
}

function building(
  ticker: string,
  upkeeps: UserData.GovBurnUpkeep[],
  contribHistory?: Record<string, UserData.GovBurnContrib>,
): UserData.GovBurnBuilding {
  return {
    ticker,
    type: ticker,
    projectId: ticker,
    level: 1,
    upkeeps,
    contribHistory,
  };
}

describe('parseGovBurnImport', () => {
  it('parses the sample Phobos JSON', () => {
    const input = parseGovBurnImport(phobosJson);
    expect(input).toEqual({
      planet: 'Phobos',
      buildings: [
        { ticker: 'SST', materials: ['DW', 'OFF', 'SUN'] },
        { ticker: 'INF', materials: ['OFF', 'STR'] },
        { ticker: 'HOS', materials: ['BND'] },
        { ticker: 'PAR', materials: ['DW', 'FOD', 'PFE'] },
        { ticker: '4DA', materials: ['HOG', 'EDC'] },
        { ticker: 'ART', materials: ['MHP', 'UTS'] },
        { ticker: 'PBH', materials: ['OFF', 'EDC', 'IDC'] },
        { ticker: 'UNI', materials: ['IDC'] },
      ],
    });
  });

  it('returns undefined for malformed input', () => {
    expect(parseGovBurnImport(null)).toBeUndefined();
    expect(parseGovBurnImport('x')).toBeUndefined();
    expect(parseGovBurnImport({ buildings: [] })).toBeUndefined();
    expect(parseGovBurnImport({ planet: 'Phobos', buildings: 'nope' })).toBeUndefined();
    expect(
      parseGovBurnImport({
        planet: 'Phobos',
        buildings: [{ building: 1, materials: [] }],
      }),
    ).toBeUndefined();
    expect(
      parseGovBurnImport({
        planet: 'Phobos',
        buildings: [{ building: 'SST', materials: [1] }],
      }),
    ).toBeUndefined();
  });

  it('upper-cases tickers and lets the last duplicate win', () => {
    const input = parseGovBurnImport({
      planet: '  phobos  ',
      buildings: [
        { building: 'sst', materials: ['dw'] },
        { building: 'SST', materials: ['off', 'sun'] },
      ],
    });
    expect(input).toEqual({
      planet: 'phobos',
      buildings: [{ ticker: 'SST', materials: ['OFF', 'SUN'] }],
    });
  });
});

describe('buildImportPlan', () => {
  const input = parseGovBurnImport(phobosJson)!;

  it('derives counts from materials.length', () => {
    const plan = buildImportPlan(input, undefined, undefined, undefined);
    const sst = plan.rows.find(x => x.ticker === 'SST')!;
    expect(sst.count).toBe(3);
    expect(sst.materials).toEqual(['DW', 'OFF', 'SUN']);
    expect(plan.hasData).toBe(false);
  });

  it('zeros configured POPI buildings omitted from the JSON', () => {
    const plan = buildImportPlan(
      input,
      undefined,
      { SST: 3, SDP: 2 },
      { SST: ['DW', 'OFF', 'SUN'], SDP: ['OFF'] },
    );
    const sdp = plan.rows.find(x => x.ticker === 'SDP')!;
    expect(sdp.count).toBe(0);
    expect(sdp.materials).toEqual([]);
    expect(sdp.omitted).toBe(true);
    expect(sdp.conflict).toBe(true);
  });

  it('zeros every POPI building omitted from the JSON, configured or not', () => {
    const plan = buildImportPlan(input, undefined, undefined, undefined);
    expect(plan.rows).toHaveLength(popiBuildings.length);
    const lib = plan.rows.find(x => x.ticker === 'LIB')!;
    expect(lib.count).toBe(0);
    expect(lib.omitted).toBe(true);
    expect(lib.conflict).toBe(false);
  });

  it('clamps materials longer than captured upkeeps', () => {
    const captured: UserData.GovBurnPlanet = {
      naturalId: 'PHOBOS',
      name: 'Phobos',
      capturedAt: 0,
      buildings: [building('SST', [upkeep('DW'), upkeep('OFF')])],
    };
    const plan = buildImportPlan(input, captured, undefined, undefined);
    const sst = plan.rows.find(x => x.ticker === 'SST')!;
    expect(sst.count).toBe(2);
    expect(sst.clamped).toBe(true);
    expect(sst.materials).toEqual(['DW', 'OFF', 'SUN']);
    expect(sst.unknownMaterials).toEqual(['SUN']);
    expect(plan.hasData).toBe(true);
  });

  it('keeps unknown materials and lists them', () => {
    const captured: UserData.GovBurnPlanet = {
      naturalId: 'PHOBOS',
      name: 'Phobos',
      capturedAt: 0,
      buildings: [building('HOS', [upkeep('DW')])],
    };
    const plan = buildImportPlan(input, captured, undefined, undefined);
    const hos = plan.rows.find(x => x.ticker === 'HOS')!;
    expect(hos.materials).toEqual(['BND']);
    expect(hos.unknownMaterials).toEqual(['BND']);
  });

  it('ignores non-POPI tickers', () => {
    const withJunk = parseGovBurnImport({
      planet: 'Phobos',
      buildings: [
        { building: 'FOO', materials: ['DW'] },
        { building: 'SST', materials: ['DW'] },
      ],
    })!;
    const plan = buildImportPlan(withJunk, undefined, undefined, undefined);
    expect(plan.ignored).toEqual(['FOO']);
    expect(plan.rows.every(x => x.ticker !== 'FOO')).toBe(true);
  });

  it('flags conflicts only when something was already set', () => {
    const fresh = buildImportPlan(input, undefined, undefined, undefined);
    expect(fresh.rows.find(x => x.ticker === 'SST')!.conflict).toBe(false);
    expect(fresh.hasConflicts).toBe(false);

    const changedCount = buildImportPlan(input, undefined, { SST: 1 }, undefined);
    expect(changedCount.rows.find(x => x.ticker === 'SST')!.conflict).toBe(true);
    expect(changedCount.hasConflicts).toBe(true);

    const changedMaterials = buildImportPlan(
      input,
      undefined,
      { SST: 3 },
      { SST: ['DW', 'OFF', 'XXX'] },
    );
    expect(changedMaterials.rows.find(x => x.ticker === 'SST')!.conflict).toBe(true);
  });

  it('has no conflict when current matches the import', () => {
    const plan = buildImportPlan(input, undefined, { SST: 3 }, { SST: ['DW', 'OFF', 'SUN'] });
    expect(plan.rows.find(x => x.ticker === 'SST')!.conflict).toBe(false);
  });
});

describe('resolveSlots', () => {
  const b = building('SST', [upkeep('DW'), upkeep('OFF'), upkeep('SUN'), upkeep('STR')], {
    OFF: { own: 100 },
    SUN: { own: 50 },
    STR: { any: 10 },
  });

  it('honours saved picks in order', () => {
    expect(resolveSlots(b, 2, ['SUN', 'STR']).map(x => x.ticker)).toEqual(['SUN', 'STR']);
  });

  it('drops a saved ticker that is no longer an upkeep and backfills from rankSlots', () => {
    const slots = resolveSlots(b, 2, ['GONE', 'STR']);
    expect(slots[0].ticker).not.toBe('GONE');
    expect(slots[0].ticker).not.toBe('');
    expect(slots[1].ticker).toBe('STR');
    expect(slots[0].ticker).not.toBe('STR');
  });

  it('does not use a duplicated saved ticker twice', () => {
    const slots = resolveSlots(b, 2, ['OFF', 'OFF']);
    expect(slots[0].ticker).toBe('OFF');
    expect(slots[1].ticker).not.toBe('OFF');
    expect(slots[1].ticker).not.toBe('');
  });

  it('backfills new indices when n grows', () => {
    const slots = resolveSlots(b, 3, ['SUN']);
    expect(slots[0].ticker).toBe('SUN');
    expect(slots[1].ticker).not.toBe('');
    expect(slots[2].ticker).not.toBe('');
    expect(new Set(slots.map(x => x.ticker)).size).toBe(3);
  });

  it('clamps n to upkeeps.length', () => {
    expect(resolveSlots(b, 99, ['DW', 'OFF', 'SUN', 'STR', 'EXTRA'])).toHaveLength(4);
    expect(resolveSlots(b, 0, ['DW'])).toEqual([]);
  });
});
