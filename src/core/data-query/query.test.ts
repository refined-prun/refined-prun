import { describe, expect, it } from 'vitest';
import { createCollectionSource, createRecordSource } from '@src/core/data-query/catalog';
import { DataQueryError, executeDataQuery, parseFilterValue } from '@src/core/data-query/query';
import { DataSourceDescriptor, MAX_DATA_QUERY_LIMIT } from '@src/core/data-query/types';

const rows = [
  {
    id: 1,
    name: 'Alpha Base',
    active: true,
    score: 12,
    nested: { code: 'AI1' },
    tags: ['ore', 'fuel'],
    config: { mode: 'safe' },
  },
  {
    id: 2,
    name: 'beta station',
    active: false,
    score: 4,
    nested: { code: 'NC1' },
    tags: ['food'],
    config: { mode: 'fast' },
  },
  { id: 3, name: 'Gamma', active: true, score: null },
];

function source(snapshot: unknown[] = rows, overrides: Partial<DataSourceDescriptor> = {}) {
  return createCollectionSource({
    id: 'test',
    label: 'Test Source',
    description: 'Test data.',
    provenance: 'prun-live',
    completeness: () => 'complete',
    snapshot: () => snapshot,
    ...overrides,
  });
}

function matchingIds(
  filter: NonNullable<Parameters<typeof executeDataQuery>[1]['filters']>[number],
) {
  return executeDataQuery(source(), { sourceId: 'test', filters: [filter] }).rows.map(
    x => (x as { id: number }).id,
  );
}

describe('parseFilterValue', () => {
  it.each([
    ['true', true],
    ['false', false],
    ['null', null],
    ['42', 42],
    ['"AI1"', 'AI1'],
    ['["ore"]', ['ore']],
    ['{"mode":"safe"}', { mode: 'safe' }],
    ['plain text', 'plain text'],
    ['', ''],
  ])('parses %s as a typed literal when valid', (input, expected) => {
    expect(parseFilterValue(input)).toEqual(expected);
  });
});

describe('executeDataQuery filters', () => {
  it('supports strict equality and inequality with typed values', () => {
    expect(matchingIds({ path: 'active', operator: 'eq', value: true })).toEqual([1, 3]);
    expect(matchingIds({ path: 'active', operator: 'neq', value: true })).toEqual([2]);
    expect(matchingIds({ path: 'id', operator: 'eq', value: '1' })).toEqual([]);
    expect(matchingIds({ path: 'config', operator: 'eq', value: { mode: 'safe' } })).toEqual([1]);
  });

  it('supports contains and startsWith without case sensitivity', () => {
    expect(matchingIds({ path: 'name', operator: 'contains', value: 'BASE' })).toEqual([1]);
    expect(matchingIds({ path: 'name', operator: 'startsWith', value: 'BETA' })).toEqual([2]);
    expect(matchingIds({ path: 'tags', operator: 'contains', value: 'fuel' })).toEqual([1]);
  });

  it('supports every ordered comparison', () => {
    expect(matchingIds({ path: 'score', operator: 'gt', value: 4 })).toEqual([1]);
    expect(matchingIds({ path: 'score', operator: 'gte', value: 4 })).toEqual([1, 2]);
    expect(matchingIds({ path: 'score', operator: 'lt', value: 12 })).toEqual([2]);
    expect(matchingIds({ path: 'score', operator: 'lte', value: 12 })).toEqual([1, 2]);
  });

  it('resolves nested paths and treats missing paths explicitly', () => {
    expect(matchingIds({ path: 'nested.code', operator: 'eq', value: 'AI1' })).toEqual([1]);
    expect(matchingIds({ path: 'nested.code', operator: 'neq', value: 'AI1' })).toEqual([2]);
    expect(matchingIds({ path: 'nested.code', operator: 'exists' })).toEqual([1, 2]);
    expect(matchingIds({ path: 'nested.code', operator: 'exists', value: false })).toEqual([3]);
  });

  it('AND-combines filters', () => {
    const result = executeDataQuery(source(), {
      sourceId: 'test',
      filters: [
        { path: 'active', operator: 'eq', value: true },
        { path: 'score', operator: 'gt', value: 10 },
      ],
    });
    expect(result.rows).toEqual([rows[0]]);
  });
});

describe('executeDataQuery search and sorting', () => {
  it('searches serialized rows with a case-insensitive substring', () => {
    const result = executeDataQuery(source(), { sourceId: 'test', search: 'nc1' });
    expect(result.rows).toEqual([rows[1]]);
  });

  it('sorts ascending and descending while keeping null and missing values last', () => {
    const sortable = [
      { id: 'missing' },
      { id: 'two', value: 2 },
      { id: 'null', value: null },
      { id: 'undefined', value: undefined },
      { id: 'one', value: 1 },
    ];
    const asc = executeDataQuery(source(sortable), {
      sourceId: 'test',
      sort: { path: 'value', direction: 'asc' },
    });
    const desc = executeDataQuery(source(sortable), {
      sourceId: 'test',
      sort: { path: 'value', direction: 'desc' },
    });
    expect(asc.rows.map(x => (x as { id: string }).id)).toEqual([
      'one',
      'two',
      'missing',
      'null',
      'undefined',
    ]);
    expect(desc.rows.map(x => (x as { id: string }).id)).toEqual([
      'two',
      'one',
      'missing',
      'null',
      'undefined',
    ]);
  });

  it('falls back to string comparison for unlike types', () => {
    const result = executeDataQuery(source([{ value: 2 }, { value: '10' }, { value: true }]), {
      sourceId: 'test',
      sort: { path: 'value', direction: 'asc' },
    });
    expect(result.rows).toEqual([{ value: '10' }, { value: 2 }, { value: true }]);
  });
});

describe('executeDataQuery result envelope', () => {
  it('applies the default limit and reports truncation metadata', () => {
    const manyRows = Array.from({ length: 300 }, (_, id) => ({ id }));
    const result = executeDataQuery(source(manyRows), { sourceId: 'test' });
    expect(result.rows).toHaveLength(250);
    expect(result.totalRows).toBe(300);
    expect(result.matchedRows).toBe(300);
    expect(result.truncated).toBe(true);
    expect(result.query.limit).toBe(250);
  });

  it('caps requested limits at the maximum', () => {
    const manyRows = Array.from({ length: MAX_DATA_QUERY_LIMIT + 10 }, (_, id) => ({ id }));
    const result = executeDataQuery(source(manyRows), {
      sourceId: 'test',
      limit: MAX_DATA_QUERY_LIMIT + 100,
    });
    expect(result.rows).toHaveLength(MAX_DATA_QUERY_LIMIT);
    expect(result.query.limit).toBe(MAX_DATA_QUERY_LIMIT);
    expect(result.truncated).toBe(true);
  });

  it('normalizes record sources into one row and preserves export metadata', () => {
    const descriptor = createRecordSource({
      id: 'company',
      label: 'Company',
      description: 'Company record.',
      provenance: 'fio-reference-with-prun-overrides',
      completeness: () => 'partial',
      snapshotRecord: () => ({ id: 'company-1' }),
    });
    const generatedAt = new Date('2026-07-19T12:00:00.000Z');
    const result = executeDataQuery(descriptor, { sourceId: 'company' }, generatedAt);
    expect(result.rows).toEqual([{ id: 'company-1' }]);
    expect(result.source).toEqual({
      id: 'company',
      label: 'Company',
      provenance: 'fio-reference-with-prun-overrides',
      completeness: 'partial',
    });
    expect(result.generatedAt).toBe('2026-07-19T12:00:00.000Z');
  });
});

describe('executeDataQuery validation', () => {
  it.each([
    { sourceId: '' },
    { sourceId: 'test', filters: {} },
    { sourceId: 'test', filters: [{ path: '', operator: 'eq', value: 1 }] },
    { sourceId: 'test', filters: [{ path: '__proto__.x', operator: 'eq', value: 1 }] },
    { sourceId: 'test', filters: [{ path: 'id', operator: 'wat', value: 1 }] },
    { sourceId: 'test', filters: [{ path: 'id', operator: 'exists', value: 'yes' }] },
    { sourceId: 'test', sort: { path: 'id', direction: 'sideways' } },
    { sourceId: 'test', limit: 0 },
    { sourceId: 'test', limit: 1.5 },
  ])('rejects malformed query %#', query => {
    expect(() => executeDataQuery(source(), query as never)).toThrow(DataQueryError);
  });

  it('rejects a query for a different descriptor', () => {
    expect(() => executeDataQuery(source(), { sourceId: 'unknown' })).toThrow(DataQueryError);
  });
});
