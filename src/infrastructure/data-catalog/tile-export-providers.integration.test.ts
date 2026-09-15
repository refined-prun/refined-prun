import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@src/utils/dayjs';
import { DataCatalog } from '@src/core/data-query/catalog';
import { gameDataSources } from '@src/infrastructure/data-catalog/game-sources';
import { exportTileDataFromCatalog } from '@src/infrastructure/data-catalog/tile-export-providers';
import { dispatch } from '@src/infrastructure/prun-api/data/api-messages';
import { request } from '@src/infrastructure/prun-api/data/request-hooks';
import { applyInitialUserData } from '@src/store/user-data';

const catalog = new DataCatalog(gameDataSources);

function exportCommand(fullCommand: string) {
  const space = fullCommand.indexOf(' ');
  return exportTileDataFromCatalog(catalog, {
    id: 'tile-1',
    fullCommand,
    command: space === -1 ? fullCommand : fullCommand.slice(0, space),
    parameter: space === -1 ? undefined : fullCommand.slice(space + 1),
  });
}

function address(naturalId: string, name = naturalId): PrunApi.Address {
  return {
    lines: [
      { type: 'SYSTEM', entity: { id: 'system-1', naturalId: 'OT-580', name: 'Test System' } },
      { type: 'PLANET', entity: { id: `planet-${naturalId}`, naturalId, name } },
    ],
  };
}

beforeEach(() => {
  dispatch({ type: 'CLIENT_CONNECTION_OPENED' });
  applyInitialUserData();
  dispatch({ type: 'COMPANY_DATA', data: { id: 'company-1', code: 'OWN' } });
});

afterEach(() => vi.restoreAllMocks());

describe('catalog-backed tile exports', () => {
  it('resolves a chart ticker to its broker ID before selecting price history', () => {
    for (const [id, ticker] of [
      ['broker-1', 'RAT.AI1'],
      ['broker-2', 'DW.AI1'],
    ]) {
      dispatch({ type: 'COMEX_BROKER_DATA', data: { id, ticker } });
      dispatch({ type: 'COMEX_BROKER_PRICES', data: { brokerId: id, prices: [] } });
    }
    expect(exportCommand('CXPC rat.ai1').datasets.map(x => x.rows)).toEqual([
      [{ id: 'broker-1', ticker: 'RAT.AI1' }],
      [{ brokerId: 'broker-1', prices: [] }],
    ]);
    expect(exportCommand('CXPC MISSING.AI1').datasets.every(x => x.rows.length === 0)).toBe(true);
  });

  it.each(['site-aaa', 'ot-580b', 'New Hope'])('resolves EXP %s to the site', parameter => {
    const sites = [
      { siteId: 'site-aaa-full', address: address('OT-580b', 'New Hope') },
      { siteId: 'site-bbb-full', address: address('OT-580c') },
    ];
    dispatch({ type: 'SITE_SITES', data: { sites } });
    for (const site of sites) {
      dispatch({ type: 'EXPERTS_EXPERTS', data: { ...site, experts: [] } });
    }
    expect(exportCommand(`EXP ${parameter}`).datasets[0].rows).toEqual([
      { ...sites[0], experts: [] },
    ]);
  });

  it('distinguishes ad numbers in different markets and ignores shipping destinations', () => {
    const ads = [
      {
        id: 'ad-1',
        localMarketId: 'market-1',
        naturalId: 7,
        address: address('OT-580b', 'New Hope'),
        creator: { id: 'company-1' },
      },
      {
        id: 'ad-2',
        localMarketId: 'market-1',
        naturalId: 8,
        address: address('OT-580b', 'New Hope'),
        creator: { id: 'other' },
      },
      {
        id: 'ad-3',
        localMarketId: 'market-2',
        naturalId: 7,
        address: address('OT-580c'),
        destination: address('OT-580b', 'New Hope'),
        creator: { id: 'other' },
      },
    ];
    dispatch({ type: 'DATA_DATA', data: { path: ['localmarkets', 'market', 'ads'], body: ads } });
    expect(exportCommand('LM New Hope').datasets[0].rows).toEqual(ads.slice(0, 2));
    expect(exportCommand('LMA ot-580b/7').datasets[0].rows).toEqual([ads[0]]);
    expect(exportCommand('LMA OT-580c/7').datasets[0].rows).toEqual([ads[2]]);
    expect(exportCommand('LMOS').datasets[0].rows).toEqual([ads[0]]);
    expect(exportCommand('LM Unknown').datasets[0].rows).toEqual([]);
  });

  it.each(['warehouse-aaa', 'ot-580b', 'New Hope'])(
    'resolves WAR %s to its rented storage',
    parameter => {
      const warehouses = [
        {
          warehouseId: 'warehouse-aaa-full',
          storeId: 'store-1',
          address: address('OT-580b', 'New Hope'),
        },
        { warehouseId: 'warehouse-bbb-full', storeId: 'store-2', address: address('OT-580c') },
      ];
      dispatch({ type: 'WAREHOUSE_STORAGES', data: { storages: warehouses } });
      dispatch({
        type: 'STORAGE_STORAGES',
        data: { stores: [{ id: 'store-1' }, { id: 'store-2' }] },
      });
      expect(exportCommand(`WAR ${parameter}`).datasets.map(x => x.rows)).toEqual([
        [warehouses[0]],
        [{ id: 'store-1' }],
      ]);
    },
  );

  it('exports only the requested material and its category', () => {
    const categories = [
      {
        id: 'cat-1',
        name: 'Food',
        materials: [
          { id: 'mat-1', ticker: 'RAT' },
          { id: 'mat-2', ticker: 'DW' },
        ],
      },
      { id: 'cat-2', name: 'Fuel', materials: [{ id: 'mat-3', ticker: 'FF' }] },
    ];
    dispatch({ type: 'WORLD_MATERIAL_CATEGORIES', data: { categories } });
    expect(exportCommand('MAT rat').datasets.map(x => x.rows)).toEqual([
      [categories[0].materials[0]],
      [categories[0]],
    ]);
    expect(exportCommand('MAT MISSING').datasets.every(x => x.rows.length === 0)).toBe(true);
  });

  it('resolves planet, system, station, and user names without exporting unrelated records', () => {
    dispatch({
      type: 'FIO_PLANET_DATA',
      data: {
        planets: [
          { naturalId: 'OT-580b', name: 'New Hope' },
          { naturalId: 'OT-580c', name: 'Other' },
        ],
      },
    });
    const star = { systemId: 'system-1', address: address('OT-580b'), name: 'Star' };
    dispatch({ type: 'SYSTEM_STARS_DATA', data: { stars: [star] } });
    const station = {
      id: 'station-1',
      name: 'Station One',
      address: {
        lines: [
          { type: 'STATION', entity: { id: 'station-1', naturalId: 'STA', name: 'Station One' } },
        ],
      },
    };
    dispatch({ type: 'DATA_DATA', data: { path: ['stations', 'station-1'], body: station } });
    const user = { id: 'user-1', username: 'TestUser' };
    dispatch({ type: 'DATA_DATA', data: { path: ['users', 'user-1'], body: user } });
    expect(exportCommand('PLI New Hope').datasets[0].rows).toEqual([
      { naturalId: 'OT-580b', name: 'New Hope' },
    ]);
    expect(exportCommand('SYSI Test System').datasets[0].rows).toEqual([star]);
    expect(exportCommand('STNS sta').datasets[0].rows).toEqual([station]);
    expect(exportCommand('USR testuser').datasets[0].rows).toEqual([user]);
    expect(exportCommand('USR missing').datasets[0].rows).toEqual([]);
  });

  it('matches company codes and IDs without returning the own record for another company', () => {
    for (const parameter of ['own', 'company-']) {
      expect(exportCommand(`CO ${parameter}`).datasets[0].rows).toEqual([
        { id: 'company-1', code: 'OWN' },
      ]);
    }
    expect(exportCommand('CO OTHER').datasets[0].rows).toEqual([]);
  });

  it('selects production lines by line ID and flights by the resolved ship ID', () => {
    const lines = [
      { id: 'line-aaa-full', siteId: 'site-1' },
      { id: 'line-bbb-full', siteId: 'site-1' },
    ];
    dispatch({ type: 'PRODUCTION_PRODUCTION_LINES', data: { productionLines: lines } });
    expect(exportCommand('PRODQ LINE-AAA').datasets[0].rows).toEqual([lines[0]]);
    const ships = [
      { id: 'ship-1', registration: 'ABC-123', address: null },
      { id: 'ship-2', registration: 'DEF-456', address: null },
    ];
    dispatch({ type: 'SHIP_SHIPS', data: { ships } });
    const flights = [
      { id: 'flight-1', shipId: 'ship-1' },
      { id: 'flight-2', shipId: 'ship-2' },
    ];
    dispatch({ type: 'SHIP_FLIGHT_FLIGHTS', data: { flights } });
    expect(exportCommand('SFC abc-123').datasets.map(x => x.rows)).toEqual([
      [ships[0]],
      [flights[0]],
    ]);
    expect(exportCommand('SFC MISSING').datasets.every(x => x.rows.length === 0)).toBe(true);
  });

  it.each([
    'XIT BURN',
    'XIT REP',
    'XIT REPAIR',
    'XIT REPAIRS',
    'XIT PLS',
    'XIT PLANETS',
    'XIT FLT',
    'XIT FLEET',
    'XIT INV',
    'XIT BS',
    'XIT PROD',
    'XIT FIN',
    'XIT FINBS',
  ])('exports backing datasets for %s without triggering lazy loads', command => {
    const spies = Object.keys(request).map(key =>
      vi.spyOn(request, key as keyof typeof request).mockImplementation(() => {
        throw Error('Unexpected request');
      }),
    );
    const result = exportCommand(command);
    expect(result.providerId).toBeDefined();
    expect(result.datasets.length).toBeGreaterThan(0);
    for (const spy of spies) {
      expect(spy).not.toHaveBeenCalled();
    }
  });

  it.each(['XIT REPAIRACT', 'XIT BURNACT', 'XIT FINBSOTHER', 'XIT CONTSOTHER'])(
    'does not match %s by a command prefix',
    command => {
      expect(exportCommand(command).providerId).toBeUndefined();
    },
  );
});
