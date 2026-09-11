import { beforeEach, describe, expect, it, vi } from 'vitest';
import { triggerRef } from 'vue';
import type { MaterialBurn } from '@src/core/burn';

const mocks = vi.hoisted(() => ({
  site: { siteId: 'base', address: { lines: [] } },
  getStores: vi.fn<() => PrunApi.Store[]>(),
  getPlanetBurn: vi.fn(),
  getInboundShipStores: vi.fn<() => PrunApi.Store[]>(),
  getInboundShips: vi.fn<() => PrunApi.Ship[]>(),
  resupplyDays: 10,
}));

vi.mock('@src/infrastructure/prun-api/data/sites', async () => {
  const { shallowRef } = await import('vue');
  return {
    sitesStore: { all: shallowRef([mocks.site]), getById: () => mocks.site },
  };
});
vi.mock('@src/infrastructure/prun-api/data/storage', () => ({
  storagesStore: { getByAddressableId: mocks.getStores },
}));
vi.mock('@src/infrastructure/prun-api/data/addresses', () => ({
  getEntityNameFromAddress: () => 'Planet',
  getEntityNaturalIdFromAddress: () => 'AB-123a',
}));
vi.mock('@src/infrastructure/prun-api/data/materials', () => ({
  materialsStore: { getByTicker: (ticker: string) => material(ticker) },
}));
vi.mock('@src/core/burn', async importOriginal => ({
  ...(await importOriginal<typeof import('@src/core/burn')>()),
  getPlanetBurn: mocks.getPlanetBurn,
  getInboundShipStores: mocks.getInboundShipStores,
  getInboundShips: mocks.getInboundShips,
  getResupplyDays: () => mocks.resupplyDays,
}));
vi.mock('@src/store/user-data', () => ({
  userData: { settings: { burn: { planetPickup: { 'AB-123a': '500/500' } } } },
}));
vi.mock('@src/utils/format', () => ({ fixed02: (x: number) => x.toFixed(2) }));

import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import {
  buildProjectedStore,
  getBaseStorageAnalysis,
  getPickupAlarm,
} from '@src/core/storage-analysis';

function material(ticker: string): PrunApi.Material {
  return {
    id: ticker,
    ticker,
    name: ticker,
    category: 'test',
    weight: 1,
    volume: 2,
    resource: false,
  };
}

function item(ticker: string, amount: number): PrunApi.StoreItem {
  return {
    id: ticker,
    type: 'INVENTORY',
    weight: amount,
    volume: amount * 2,
    quantity: { material: material(ticker), amount, value: { amount: 0, currency: 'NCC' } },
  };
}

function store(items: PrunApi.StoreItem[]): PrunApi.Store {
  return {
    id: 'store',
    type: 'STORE',
    items,
    weightLoad: sumBy(items, x => x.weight),
    volumeLoad: sumBy(items, x => x.volume),
    weightCapacity: 1000,
    volumeCapacity: 2000,
  } as PrunApi.Store;
}

function burn(inventory: number, dailyAmount: number, inboundInventory = 0): MaterialBurn {
  return {
    input: Math.max(-dailyAmount, 0),
    output: Math.max(dailyAmount, 0),
    workforce: 0,
    remainingAllocation: 0,
    inventory,
    inboundInventory,
    dailyAmount,
    daysLeft: dailyAmount >= 0 ? Infinity : (inventory + inboundInventory) / -dailyAmount,
    type: dailyAmount < 0 ? 'input' : 'output',
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  triggerRef(sitesStore.all);
  mocks.resupplyDays = 10;
  mocks.getStores.mockReturnValue([store([item('OUT', 10), item('IDLE', 50), item('CON', 10)])]);
  mocks.getInboundShipStores.mockReturnValue([store([item('OUT', 100), item('CON', 90)])]);
  mocks.getInboundShips.mockReturnValue([]);
  mocks.getPlanetBurn.mockReturnValue({ burn: { OUT: burn(10, 1, 100), CON: burn(10, -10, 90) } });
});

describe('storage analysis', () => {
  it('uses only local stock for pickup amounts and available storage space', () => {
    const analysis = getBaseStorageAnalysis('base')!;
    expect(analysis.producedWeight).toBe(10);
    expect(analysis.producedVolume).toBe(20);
    expect(analysis.availableAfterShipOutWeight).toBe(940);
    expect(analysis.availableAfterShipOutVolume).toBe(1880);
    expect(analysis.daysOfSuppliesFit).toBe(90);
  });

  it.each([
    [5, 150, 260],
    [25, 300, 410],
  ])(
    'includes inbound cargo with a %i-day resupply target',
    (days, projectedLoad, deliveredLoad) => {
      mocks.resupplyDays = days;
      const analysis = getBaseStorageAnalysis('base')!;
      const projected = buildProjectedStore('base')!;
      expect(analysis.needFillPercentWeight).toBe(deliveredLoad / 1000);
      expect(analysis.needFillPercentVolume).toBe(deliveredLoad / 1000);
      expect(projected.weightLoad).toBe(projectedLoad);
      expect(projected.volumeLoad).toBe(projectedLoad * 2);
      expect(projected.items.some(x => x.quantity?.material.ticker === 'OUT')).toBe(false);
    },
  );

  it.each([
    [250, 'Pickup ready:', '(volume)'],
    [200, 'Pickup ready within 24h:', '(weight)'],
  ])(
    'uses the matching current or projected pickup limit for %i units',
    (amount, prefix, limit) => {
      mocks.getStores.mockReturnValue([store([item('OUT', amount)])]);
      mocks.getInboundShipStores.mockReturnValue([]);
      mocks.getPlanetBurn.mockReturnValue({ burn: { OUT: burn(amount, 300) } });
      const reason = getPickupAlarm('base')!.reason;
      expect(reason.startsWith(prefix)).toBe(true);
      expect(reason.endsWith(limit)).toBe(true);
    },
  );
});
