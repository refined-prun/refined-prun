import { getInvStore } from '@src/core/store-id';
import { DataCatalog } from '@src/core/data-query/catalog';
import { DataQuery, DataQueryResult } from '@src/core/data-query/types';
import type { RenderedTileMetadata } from '@src/infrastructure/data-catalog/tile-sources';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { cxobStore } from '@src/infrastructure/prun-api/data/cxob';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { materialCategoriesStore } from '@src/infrastructure/prun-api/data/material-categories';
import { planetsStore } from '@src/infrastructure/prun-api/data/planets';
import { starsStore } from '@src/infrastructure/prun-api/data/stars';
import { stationsStore } from '@src/infrastructure/prun-api/data/stations';
import { usersStore } from '@src/infrastructure/prun-api/data/users';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { localAdsStore } from '@src/infrastructure/prun-api/data/local-ads';
import { getLocationLineFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';

export interface TileExportContext {
  id: string;
  fullCommand: string;
  command: string;
  parameter?: string;
}

export interface TileDataProvider {
  id: string;
  matches(context: TileExportContext): boolean;
  queries(context: TileExportContext): DataQuery[];
}

export interface TileDataExportResult {
  generatedAt: string;
  tile: RenderedTileMetadata | TileExportContext;
  providerId?: string;
  datasets: DataQueryResult[];
}

const providers: TileDataProvider[] = [
  provider('balances', ['FIN', 'FINLA'], () => [query('balances')]),
  provider('company', ['HQ', 'ARC'], () => [query('company')]),
  provider('company-info', ['CO'], context => {
    const company = companyStore.value;
    const parameter = context.parameter?.trim().toUpperCase() ?? '';
    const matches =
      company &&
      (company.code.toUpperCase() === parameter || company.id.toUpperCase().startsWith(parameter));
    return [query('company', filter('id', 'eq', matches ? company.id : ''))];
  }),
  provider('corporation-holdings', ['CORP', 'CORPFIN'], () => [
    query('corporation-holdings', filter('primary', 'eq', true)),
  ]),
  provider('buildings', ['BBL'], context =>
    context.parameter
      ? [query('sites', filter('siteId', 'startsWith', context.parameter))]
      : [query('sites')],
  ),
  provider('blueprints', ['BLU'], context =>
    context.parameter
      ? [query('blueprints', filter('naturalId', 'eq', context.parameter))]
      : [query('blueprints')],
  ),
  provider('base', ['BS'], context => {
    if (!context.parameter) {
      return [query('sites'), query('workforces'), query('production')];
    }
    return [
      query('sites', undefined, context.parameter),
      query('workforces', undefined, context.parameter),
      query('production', undefined, context.parameter),
    ];
  }),
  provider('contract-drafts', ['CONTD'], context =>
    context.parameter
      ? [query('contract-drafts', filter('naturalId', 'eq', context.parameter))]
      : [query('contract-drafts')],
  ),
  provider('contracts', ['CONTS'], () => [query('contracts')]),
  provider('contract', ['CONT'], context => [
    query('contracts', filter('localId', 'eq', context.parameter)),
  ]),
  provider('cx-order-book', ['CXOB', 'CXPO'], context => [
    query('cx-order-books', filter('ticker', 'eq', context.parameter)),
  ]),
  provider('cx-orders', ['CXOS'], () => [query('cx-orders')]),
  provider('cx-order', ['CXO'], context => [
    query('cx-orders', filter('id', 'startsWith', context.parameter)),
  ]),
  provider('cx-prices', ['CXP', 'CXPC'], context => {
    const broker = cxobStore.getByTicker(context.parameter);
    return [
      query('cx-order-books', filter('id', 'eq', broker?.id ?? '')),
      query('cx-prices', filter('brokerId', 'eq', broker?.id ?? '')),
    ];
  }),
  provider('exchanges', ['CXL'], () => [query('exchanges')]),
  provider('exchange', ['CX'], context => [
    query('exchanges', filter('code', 'eq', context.parameter?.trim().toUpperCase())),
  ]),
  provider('material-markets', ['CXM'], context => {
    const ticker = context.parameter?.trim().split(/\s+/)[0].toUpperCase();
    return [
      query('materials', filter('ticker', 'eq', ticker)),
      query('cx-order-books', filter('material.ticker', 'eq', ticker)),
    ];
  }),
  provider('fx-order-books', ['FX'], () => [query('fx-order-books')]),
  provider('fx-order-book', ['FXOB', 'FXP', 'FXPC', 'FXPO'], context => [
    query('fx-order-books', filter('ticker', 'eq', context.parameter?.trim().toUpperCase())),
  ]),
  provider('fx-orders', ['FXOS'], () => [query('fx-orders')]),
  provider('fx-order', ['FXO'], context => [
    query('fx-orders', filter('id', 'startsWith', context.parameter)),
  ]),
  provider('experts', ['EXP'], context => [
    query('experts', filter('siteId', 'eq', sitesStore.find(context.parameter)?.siteId ?? '')),
  ]),
  provider('fleet', ['FLT'], () => [query('ships'), query('flights')]),
  provider('inventory', ['INV'], context => {
    const parameter = context.parameter?.trim();
    if (!parameter) {
      return [query('storages')];
    }
    const store = getInvStore(parameter);
    return [
      query(
        'storages',
        store ? filter('id', 'eq', store.id) : filter('id', 'startsWith', parameter.toLowerCase()),
      ),
    ];
  }),
  provider('alerts', ['NOTS'], () => [query('alerts')]),
  provider('material', ['MAT'], context => {
    const material = materialsStore.getByTicker(context.parameter);
    const category = materialCategoriesStore.all.value?.find(x =>
      x.materials.some(x => x.id === material?.id),
    );
    return [
      query('materials', filter('id', 'eq', material?.id ?? '')),
      query('material-categories', filter('id', 'eq', category?.id ?? '')),
    ];
  }),
  provider('planets', ['PLI'], context =>
    context.parameter
      ? [
          query(
            'planets',
            filter('naturalId', 'eq', planetsStore.find(context.parameter)?.naturalId ?? ''),
          ),
        ]
      : [query('planets')],
  ),
  provider('systems', ['SYSI', 'MS'], context => {
    if (!context.parameter) {
      return [query('stars')];
    }
    const star = starsStore.getById(context.parameter) ?? starsStore.find(context.parameter);
    return [query('stars', filter('systemId', 'eq', star?.systemId ?? ''))];
  }),
  provider('universe', ['MU'], () => [query('sectors'), query('stars'), query('planets')]),
  provider('stations', ['STNS'], context => {
    if (!context.parameter) {
      return [query('stations')];
    }
    const station =
      stationsStore.getById(context.parameter) ??
      stationsStore.getByNaturalId(context.parameter) ??
      stationsStore.getByName(context.parameter);
    return [query('stations', filter('id', 'eq', station?.id ?? ''))];
  }),
  provider('user', ['USR'], context => {
    const user =
      usersStore.getById(context.parameter) ?? usersStore.getByUsername(context.parameter);
    return [query('users', filter('id', 'eq', user?.id ?? ''))];
  }),
  provider('local-market', ['LM', 'LMP'], context => [
    query('local-ads', localMarketFilter(context.parameter ?? '')),
  ]),
  provider('local-ad', ['LMA'], context => {
    const parameter = context.parameter ?? '';
    const separator = parameter.lastIndexOf('/');
    return [
      query('local-ads', [
        ...localMarketFilter(parameter.slice(0, separator)),
        ...filter('naturalId', 'eq', Number(parameter.slice(separator + 1))),
      ]),
    ];
  }),
  provider('own-local-ads', ['LMOS'], () => [
    query('local-ads', filter('creator.id', 'eq', companyStore.value?.id ?? '')),
  ]),
  provider('warehouse', ['WAR'], context => {
    const warehouse =
      warehousesStore.getById(context.parameter) ??
      warehousesStore.getByEntityNaturalIdOrName(context.parameter);
    return [
      query('warehouses', filter('warehouseId', 'eq', warehouse?.warehouseId ?? '')),
      query('storages', filter('id', 'eq', warehouse?.storeId ?? '')),
    ];
  }),
  provider('production', ['PROD'], context =>
    context.parameter
      ? [query('production', filter('siteId', 'startsWith', context.parameter))]
      : [query('production')],
  ),
  provider('ship', ['SHP'], context => [
    query('ships', filter('registration', 'eq', context.parameter)),
  ]),
  provider('flight-control', ['SFC'], context => {
    const ship =
      shipsStore.getById(context.parameter) ?? shipsStore.getByRegistration(context.parameter);
    return [
      query('ships', filter('id', 'eq', ship?.id ?? '')),
      query('flights', filter('shipId', 'eq', ship?.id ?? '')),
    ];
  }),
  provider('shipyards', ['SHY'], context => [query('shipyards', undefined, context.parameter)]),
  provider('production-line', ['PRODQ', 'PRODCO'], context => [
    query('production', filter('id', 'startsWith', context.parameter)),
  ]),
  provider('shipyard-project', ['SHYP'], context =>
    context.parameter
      ? [query('shipyard-projects', filter('id', 'startsWith', context.parameter))]
      : [query('shipyard-projects')],
  ),
  provider('workforce', ['WF'], context => [
    query('workforces', filter('siteId', 'startsWith', context.parameter)),
  ]),
  xitProvider('xit-contracts', ['CONTS'], ['contracts']),
  xitProvider('xit-cx-orders', ['CXTS'], ['cx-orders']),
  xitProvider('xit-fx-orders', ['FXTS'], ['fx-orders']),
  xitProvider('xit-burn', ['BURN'], ['burn', 'planet-settings']),
  xitProvider('xit-repair', ['REP', 'REPAIR', 'REPAIRS'], ['repair', 'planet-settings']),
  xitProvider('xit-planet-settings', ['PLS', 'PLANETS'], ['planet-settings', 'sites']),
  xitProvider('xit-fleet', ['FLT', 'FLEET'], ['ships', 'flights']),
  xitProvider('xit-inventory', ['INV'], ['storages', 'warehouses']),
  xitProvider('xit-bases', ['BS'], ['sites', 'workforces', 'production', 'burn', 'repair']),
  xitProvider('xit-production', ['PROD'], ['production', 'sites', 'workforces']),
  xitProvider('xit-finance', ['FIN', 'FINBS'], ['balances', 'corporation-holdings', 'storages']),
];

function localMarketFilter(parameter: string) {
  const normalized = parameter.trim().toUpperCase();
  const ad = localAdsStore.all.value?.find(x => {
    const entity = getLocationLineFromAddress(x.address)?.entity;
    return (
      x.localMarketId.toUpperCase().startsWith(normalized) ||
      entity?.naturalId.toUpperCase() === normalized ||
      entity?.name.toUpperCase() === normalized ||
      entity?.id.toUpperCase().startsWith(normalized)
    );
  });
  return filter('localMarketId', 'eq', ad?.localMarketId ?? '');
}

function xitProvider(id: string, commands: string[], sources: string[]): TileDataProvider {
  const commandSet = new Set(commands);
  return {
    id,
    matches: context =>
      context.command === 'XIT' &&
      commandSet.has(context.parameter?.trim().split(/\s+/)[0].toUpperCase() ?? ''),
    queries: () => sources.map(x => query(x)),
  };
}

export function registerTileDataProvider(provider: TileDataProvider) {
  if (providers.some(x => x.id === provider.id)) {
    throw Error(`Duplicate tile data provider ID "${provider.id}".`);
  }
  providers.push(provider);
}

export function listTileDataProviders() {
  return [...providers];
}

export function exportTileDataFromCatalog(
  catalog: DataCatalog,
  context: TileExportContext,
  generatedAt = new Date(),
  resolveTileMetadata: (id: string) => RenderedTileMetadata | undefined = () => undefined,
): TileDataExportResult {
  const provider = providers.find(x => x.matches(context));
  const datasets =
    provider?.queries(context).map(query => catalog.export(query, generatedAt)) ?? [];
  return {
    generatedAt: generatedAt.toISOString(),
    tile: resolveTileMetadata(context.id) ?? context,
    ...(provider ? { providerId: provider.id } : {}),
    datasets,
  };
}

function provider(
  id: string,
  commands: string[],
  queries: (context: TileExportContext) => DataQuery[],
): TileDataProvider {
  const commandSet = new Set(commands);
  return {
    id,
    matches: context => commandSet.has(context.command),
    queries,
  };
}

function query(sourceId: string, dataFilter?: DataQuery['filters'], search?: string): DataQuery {
  return {
    sourceId,
    ...(search ? { search } : {}),
    ...(dataFilter ? { filters: dataFilter } : {}),
    limit: 5000,
  };
}

function filter(
  path: string,
  operator: NonNullable<DataQuery['filters']>[number]['operator'],
  value: unknown,
): NonNullable<DataQuery['filters']> {
  if (value === undefined) {
    return [];
  }
  return [{ path, operator, value }];
}
