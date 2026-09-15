import { afterEach, describe, expect, it, vi } from 'vitest';
// Mirrors the app's Day.js setup required by core/repair → core/buildings → fio/cx.
import '@src/utils/dayjs';
import { getPlanetBurn, getPlanetBurnPassive } from '@src/core/burn';
import { DataCatalog } from '@src/core/data-query/catalog';
import { gameDataSources } from '@src/infrastructure/data-catalog/game-sources';
import { dispatch } from '@src/infrastructure/prun-api/data/api-messages';
import { request } from '@src/infrastructure/prun-api/data/request-hooks';

const expectedSourceIds = [
  'alerts',
  'balances',
  'blueprints',
  'burn',
  'company',
  'contract-drafts',
  'contracts',
  'corporation-holdings',
  'cx-order-books',
  'cx-orders',
  'cx-prices',
  'exchanges',
  'experts',
  'flight-plans',
  'flights',
  'fx-order-books',
  'fx-orders',
  'local-ads',
  'material-categories',
  'materials',
  'planet-settings',
  'planets',
  'production',
  'repair',
  'sectors',
  'ships',
  'shipyard-projects',
  'shipyards',
  'sites',
  'stars',
  'stations',
  'storages',
  'users',
  'warehouses',
  'workforces',
];

function createSite(siteId: string, naturalId: string): PrunApi.Site {
  return {
    siteId,
    address: {
      lines: [
        {
          type: 'SYSTEM',
          entity: { id: 'system-1', naturalId: 'OT', name: 'OT' },
        },
        {
          type: 'PLANET',
          entity: { id: `planet-${naturalId}`, naturalId, name: naturalId },
        },
      ],
    },
    founded: { timestamp: 0 },
    platforms: [],
    buildOptions: { options: [] },
    area: 0,
    investedPermits: 0,
    maximumPermits: 0,
  };
}

function dispatchBurnData(site: PrunApi.Site) {
  dispatch({
    type: 'WORKFORCE_WORKFORCES',
    data: { address: site.address, siteId: site.siteId, workforces: [] },
  });
  dispatch({
    type: 'PRODUCTION_SITE_PRODUCTION_LINES',
    data: { siteId: site.siteId, productionLines: [] },
  });
}

afterEach(() => {
  dispatch({ type: 'CLIENT_CONNECTION_OPENED' });
  vi.restoreAllMocks();
});

describe('game data sources', () => {
  it.each(['workforces', 'production'])(
    'reports %s as complete when every site has loaded, including empty responses',
    sourceId => {
      const requestSpies = Object.keys(request).map(key =>
        vi.spyOn(request, key as keyof typeof request),
      );
      const catalog = new DataCatalog(gameDataSources);
      const completeness = computed(() => catalog.snapshot(sourceId).source.completeness);
      const sites = [createSite('site-1', 'OT-580b'), createSite('site-2', 'OT-580c')];

      expect(completeness.value).toBe('not-loaded');
      dispatchBurnData(sites[0]);
      expect(completeness.value).toBe('partial');

      dispatch({ type: 'SITE_SITES', data: { sites } });
      expect(completeness.value).toBe('partial');
      dispatchBurnData(sites[1]);
      expect(completeness.value).toBe('complete');

      dispatch({ type: 'SITE_SITE', data: createSite('site-3', 'OT-580d') });
      expect(completeness.value).toBe('partial');

      dispatch({ type: 'CLIENT_CONNECTION_OPENED' });
      expect(completeness.value).toBe('not-loaded');
      dispatch({ type: 'SITE_SITES', data: { sites } });
      expect(completeness.value).toBe('not-loaded');
      dispatchBurnData(sites[0]);
      expect(completeness.value).toBe('partial');

      for (const spy of requestSpies) {
        expect(spy).not.toHaveBeenCalled();
      }
    },
  );

  it.each(['workforces', 'production'])('reports %s as complete with no sites', sourceId => {
    const catalog = new DataCatalog(gameDataSources);
    dispatch({ type: 'SITE_SITES', data: { sites: [] } });
    expect(catalog.snapshot(sourceId).source.completeness).toBe('complete');
  });

  it('requires a site response to mark production complete after individual line observations', () => {
    const catalog = new DataCatalog(gameDataSources);
    dispatch({ type: 'SITE_SITES', data: { sites: [createSite('site-1', 'OT-580b')] } });
    dispatch({
      type: 'PRODUCTION_PRODUCTION_LINE',
      data: { id: 'line-1', siteId: 'site-1', orders: [] },
    });
    expect(catalog.snapshot('production').source.completeness).toBe('partial');
    dispatch({
      type: 'PRODUCTION_SITE_PRODUCTION_LINES',
      data: { siteId: 'site-1', productionLines: [{ id: 'line-1', siteId: 'site-1', orders: [] }] },
    });
    expect(catalog.snapshot('production').source.completeness).toBe('complete');
  });

  it('reports global production as complete without the sites list and resets on reconnect', () => {
    const catalog = new DataCatalog(gameDataSources);
    dispatch({ type: 'PRODUCTION_PRODUCTION_LINES', data: { productionLines: [] } });
    expect(catalog.snapshot('production').source.completeness).toBe('complete');
    dispatch({ type: 'CLIENT_CONNECTION_OPENED' });
    expect(catalog.snapshot('production').source.completeness).toBe('not-loaded');
  });

  it('catalogs the explicit gameplay source set with declared provenance and loaders', () => {
    expect(gameDataSources.map(x => x.id)).toEqual(expectedSourceIds);

    const byId = new Map(gameDataSources.map(x => [x.id, x]));
    expect(byId.get('planets')).toMatchObject({
      provenance: 'fio-reference-with-prun-overrides',
      warning: expect.stringContaining('stale'),
    });
    expect(byId.get('exchanges')?.provenance).toBe('prun-live-with-defaults');
    expect(byId.get('stations')?.provenance).toBe('prun-live-with-defaults');
    expect(byId.get('production')?.load?.parameter).toBe('siteId');
    expect(byId.get('workforces')?.load?.parameter).toBe('siteId');
    for (const id of ['blueprints', 'cx-orders', 'fx-orders', 'shipyards', 'shipyard-projects']) {
      expect(byId.get(id)?.load).toBeDefined();
    }
  });

  it('lists, snapshots, queries, and exports every real source without requesting data', () => {
    const requestSpies = Object.keys(request).map(key =>
      vi.spyOn(request, key as keyof typeof request),
    );
    const catalog = new DataCatalog(gameDataSources);

    expect(catalog.list()).toHaveLength(expectedSourceIds.length);
    for (const sourceId of expectedSourceIds) {
      catalog.snapshot(sourceId);
      catalog.query({ sourceId });
      catalog.export({ sourceId });
    }
    for (const spy of requestSpies) {
      expect(spy).not.toHaveBeenCalled();
    }
  });

  it('snapshots burn for loaded sites without requesting missing data', () => {
    const requestSpies = Object.keys(request).map(key =>
      vi.spyOn(request, key as keyof typeof request).mockImplementation(() => undefined),
    );
    const site = createSite('site-1', 'OT-580b');
    dispatch({ type: 'SITE_SITES', data: { sites: [site] } });

    const catalog = new DataCatalog(gameDataSources);

    expect(catalog.snapshot('burn')).toMatchObject({
      source: { completeness: 'not-loaded' },
      rows: [],
    });
    for (const spy of requestSpies) {
      expect(spy).not.toHaveBeenCalled();
    }
  });

  it('reports and snapshots passively loaded burn data', () => {
    const requestSpies = Object.keys(request).map(key =>
      vi.spyOn(request, key as keyof typeof request).mockImplementation(() => undefined),
    );
    const sites = [createSite('site-1', 'OT-580b'), createSite('site-2', 'OT-580c')];
    const catalog = new DataCatalog(gameDataSources);

    expect(catalog.snapshot('burn')).toMatchObject({
      source: { completeness: 'not-loaded' },
      rows: undefined,
    });

    dispatch({ type: 'SITE_SITES', data: { sites } });
    dispatchBurnData(sites[0]);

    const partial = catalog.snapshot('burn');
    expect(partial.source.completeness).toBe('partial');
    expect(partial.rows).toHaveLength(1);
    const passiveBurn = getPlanetBurnPassive(sites[0]);
    expect(passiveBurn).toBeDefined();
    expect(passiveBurn).toEqual(getPlanetBurn(sites[0]));

    dispatchBurnData(sites[1]);

    const complete = catalog.snapshot('burn');
    expect(complete.source.completeness).toBe('complete');
    expect(complete.rows).toHaveLength(2);
    expect(complete.rows).toEqual(
      expect.arrayContaining([expect.objectContaining({ naturalId: 'OT-580b' })]),
    );
    for (const spy of requestSpies) {
      expect(spy).not.toHaveBeenCalled();
    }
  });
});
