import { describe, expect, it, vi } from 'vitest';
import { createCollectionSource, DataCatalog } from '@src/core/data-query/catalog';
import { getInvStore } from '@src/core/store-id';
import {
  exportTileDataFromCatalog,
  listTileDataProviders,
  registerTileDataProvider,
} from '@src/infrastructure/data-catalog/tile-export-providers';

vi.mock('@src/core/store-id', () => ({ getInvStore: vi.fn() }));

function createCatalog() {
  return new DataCatalog([
    createCollectionSource({
      id: 'ships',
      label: 'Ships',
      description: 'Ships.',
      provenance: 'prun-live',
      completeness: () => 'complete',
      snapshot: () => [{ registration: 'ABC-123' }],
    }),
    createCollectionSource({
      id: 'flights',
      label: 'Flights',
      description: 'Flights.',
      provenance: 'prun-live',
      completeness: () => 'partial',
      snapshot: () => [{ id: 'flight-1' }],
    }),
  ]);
}

describe('tile export providers', () => {
  it.each(['ABC-123', 'Promitor', 'MOR'])(
    'resolves INV %s before filtering the storage snapshot',
    parameter => {
      const store = { id: 'storage-1' } as PrunApi.Store;
      vi.mocked(getInvStore).mockReturnValue(store);
      const catalog = new DataCatalog([
        createCollectionSource({
          id: 'storages',
          label: 'Storages',
          description: 'Loaded inventories.',
          provenance: 'prun-live',
          completeness: () => 'complete',
          snapshot: () => [store, { id: 'storage-2' }],
        }),
      ]);
      const result = exportTileDataFromCatalog(catalog, {
        id: 'tile-1',
        command: 'INV',
        parameter,
        fullCommand: `INV ${parameter}`,
      });
      expect(getInvStore).toHaveBeenCalledWith(parameter);
      expect(result.datasets[0].rows).toEqual([store]);
    },
  );

  it('exports provider datasets with consistent result envelopes and timestamps', () => {
    const generatedAt = new Date('2026-07-19T12:00:00.000Z');
    const result = exportTileDataFromCatalog(
      createCatalog(),
      {
        id: 'tile-1',
        fullCommand: 'FLT',
        command: 'FLT',
      },
      generatedAt,
      () => ({
        id: 'tile-1',
        docked: true,
        fullCommand: 'FLT',
        command: 'FLT',
        gameState: [],
        extensionState: {},
      }),
    );

    expect(result.providerId).toBe('fleet');
    expect(result.generatedAt).toBe(generatedAt.toISOString());
    expect(result.tile).toMatchObject({ id: 'tile-1', docked: true });
    expect(result.datasets).toHaveLength(2);
    expect(result.datasets.map(x => x.source.id)).toEqual(['ships', 'flights']);
    expect(result.datasets.every(x => x.generatedAt === result.generatedAt)).toBe(true);
    expect(result.datasets[0].rows).toEqual([{ registration: 'ABC-123' }]);
  });

  it('does not invoke loaders when exporting a tile', () => {
    const loader = vi.fn();
    const catalog = new DataCatalog([
      createCollectionSource({
        id: 'ships',
        label: 'Ships',
        description: 'Ships.',
        provenance: 'prun-live',
        completeness: () => 'not-loaded',
        snapshot: () => undefined,
        load: { execute: loader },
      }),
      createCollectionSource({
        id: 'flights',
        label: 'Flights',
        description: 'Flights.',
        provenance: 'prun-live',
        completeness: () => 'not-loaded',
        snapshot: () => undefined,
      }),
    ]);

    exportTileDataFromCatalog(
      catalog,
      { id: 'tile-1', fullCommand: 'FLT', command: 'FLT' },
      new Date(),
      () => undefined,
    );
    expect(loader).not.toHaveBeenCalled();
  });

  it('supports explicit provider registration and rejects duplicates', () => {
    const id = `test-${Date.now()}`;
    registerTileDataProvider({
      id,
      matches: () => false,
      queries: () => [],
    });
    expect(listTileDataProviders().some(x => x.id === id)).toBe(true);
    expect(() =>
      registerTileDataProvider({
        id,
        matches: () => false,
        queries: () => [],
      }),
    ).toThrow();
  });
});
