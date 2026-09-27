import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import {
  getEntityNameFromAddress,
  getEntityNaturalIdFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import { getPlanetBurn } from '@src/core/burn';

export type StockTrend = 'filling' | 'draining' | 'static';

export interface StockItemStatus {
  ticker: string;
  material?: PrunApi.Material;
  max: number;
  warehouse: boolean;
  current: number;
  // Net daily production/consumption from XIT BURN (base inventory only).
  rate: number;
  // Current divided by max. Can exceed 1 when overstocked.
  percent: number;
  // Days to reach the target (both directions), or NaN when not trending.
  days: number;
  trend: StockTrend;
  // True when the item is draining and already at or below its target (running low).
  danger: boolean;
}

export interface StockPlanetStatus {
  // The raw identifier the user configured for this planet.
  planet: string;
  planetName: string;
  naturalId: string;
  storeId?: string;
  // Whether the configured planet resolved to an owned site.
  found: boolean;
  items: StockItemStatus[];
}

function sumTicker(stores: PrunApi.Store[] | undefined, ticker: string) {
  if (!stores) {
    return 0;
  }
  let total = 0;
  for (const store of stores) {
    for (const item of store.items) {
      const quantity = item.quantity;
      if (quantity && quantity.material.ticker === ticker) {
        total += quantity.amount;
      }
    }
  }
  return total;
}

function computeDays(current: number, max: number, rate: number) {
  if (rate > 0) {
    // Filling. Days until we reach the target; already at/above target has no ETA.
    if (current < max) {
      return { days: (max - current) / rate, trend: 'filling' as const, danger: false };
    }
    return { days: Number.POSITIVE_INFINITY, trend: 'filling' as const, danger: false };
  }
  if (rate < 0) {
    // Draining. Above target: days to fall back to it. At/below target: days until empty.
    if (current > max) {
      return { days: (current - max) / -rate, trend: 'draining' as const, danger: false };
    }
    return { days: current / -rate, trend: 'draining' as const, danger: true };
  }
  return { days: NaN, trend: 'static' as const, danger: false };
}

export function getPlanetStock(config: UserData.StockPlanetData): StockPlanetStatus {
  const site = sitesStore.find(config.planet);
  const naturalId =
    (site ? getEntityNaturalIdFromAddress(site.address) : undefined) ?? config.planet;
  const planetName = (site ? getEntityNameFromAddress(site.address) : undefined) ?? config.planet;
  const baseStores = site ? storagesStore.getByAddressableId(site.siteId) : undefined;
  const warehouse = warehousesStore.getByEntityNaturalId(naturalId);
  const warehouseStore = storagesStore.getById(warehouse?.storeId);
  const burn = site ? getPlanetBurn(site)?.burn : undefined;

  const items = config.items.map<StockItemStatus>(item => {
    const ticker = item.ticker.toUpperCase();
    const material = materialsStore.getByTicker(ticker);
    const includeWarehouse = item.warehouse === true;
    const base = sumTicker(baseStores, ticker);
    const wh = includeWarehouse
      ? sumTicker(warehouseStore ? [warehouseStore] : undefined, ticker)
      : 0;
    const current = base + wh;
    const max = item.max;
    const rate = burn?.[ticker]?.dailyAmount ?? 0;
    const percent = max > 0 ? current / max : current > 0 ? Number.POSITIVE_INFINITY : 0;
    const { days, trend, danger } = computeDays(current, max, rate);
    return {
      ticker,
      material,
      max,
      warehouse: includeWarehouse,
      current,
      rate,
      percent,
      days,
      trend,
      danger,
    };
  });

  return {
    planet: config.planet,
    planetName,
    naturalId,
    storeId: baseStores?.[0]?.id,
    found: site !== undefined,
    items,
  };
}
