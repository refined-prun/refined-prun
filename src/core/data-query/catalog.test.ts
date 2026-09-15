import { describe, expect, it, vi } from 'vitest';
import { createCollectionSource, DataCatalog } from '@src/core/data-query/catalog';
import { DataQueryError } from '@src/core/data-query/query';

describe('DataCatalog passive access', () => {
  it('lists, snapshots, queries, and exports without invoking a loader', () => {
    const loader = vi.fn();
    const snapshot = vi.fn(() => [{ id: 1 }, { id: 2 }]);
    const catalog = new DataCatalog([
      createCollectionSource({
        id: 'inert',
        label: 'Inert',
        description: 'An inert fake store.',
        provenance: 'prun-live',
        completeness: () => 'partial',
        snapshot,
        load: { execute: loader },
      }),
    ]);

    expect(catalog.list()).toEqual([
      {
        id: 'inert',
        label: 'Inert',
        description: 'An inert fake store.',
        provenance: 'prun-live',
        shape: 'collection',
        completeness: 'partial',
        load: { parameter: undefined },
      },
    ]);
    expect(snapshot).not.toHaveBeenCalled();
    expect(loader).not.toHaveBeenCalled();

    expect(catalog.snapshot('inert').rows).toEqual([{ id: 1 }, { id: 2 }]);
    expect(catalog.query({ sourceId: 'inert', limit: 1 }).rows).toEqual([{ id: 1 }]);
    expect(catalog.export({ sourceId: 'inert', search: '"id":2' }).rows).toEqual([{ id: 2 }]);

    expect(snapshot).toHaveBeenCalledTimes(3);
    expect(loader).not.toHaveBeenCalled();
  });

  it('invokes a loader only through explicit load and validates site IDs', () => {
    const loader = vi.fn();
    const catalog = new DataCatalog([
      createCollectionSource({
        id: 'production',
        label: 'Production',
        description: 'Site production.',
        provenance: 'prun-live',
        completeness: () => 'not-loaded',
        snapshot: () => undefined,
        load: { parameter: 'siteId', execute: loader },
      }),
    ]);

    expect(() => catalog.load('production', '')).toThrow(DataQueryError);
    expect(loader).not.toHaveBeenCalled();
    catalog.load('production', ' site-1 ');
    expect(loader).toHaveBeenCalledWith('site-1');
  });

  it('rejects duplicate and unknown source IDs', () => {
    const descriptor = createCollectionSource({
      id: 'same',
      label: 'Same',
      description: 'Duplicate.',
      provenance: 'prun-live',
      completeness: () => 'complete',
      snapshot: () => [],
    });
    expect(() => new DataCatalog([descriptor, descriptor])).toThrow(DataQueryError);

    const catalog = new DataCatalog([descriptor]);
    expect(() => catalog.query({ sourceId: 'unknown' })).toThrow(DataQueryError);
    expect(() => catalog.snapshot('unknown')).toThrow(DataQueryError);
  });
});
