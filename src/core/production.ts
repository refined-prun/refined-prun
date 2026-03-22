import { computed } from 'vue';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import {
  getEntityNameFromAddress,
  getEntityNaturalIdFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';

export interface PlatformProduction {
  id: string;
  reactorTicker: string;
  capacity: number;
  activeCapacity: number;
  inactiveCapacity: number;
  condition: number;
  efficiency: number;
  efficiencyFactors: PrunApi.EfficiencyFactor[];
  orders: PrunApi.ProductionOrder[];
  queuedOrders: PrunApi.ProductionOrder[];
}

export interface PlanetProduction {
  storeId: string;
  planetName: string;
  naturalId: string;
  production: PlatformProduction[];
  site: PrunApi.Site;
  platforms: PrunApi.Platform[];
  lines: PrunApi.ProductionLine[];
}

const productionMap = computed<Record<string, PlanetProduction>>(() => {
  const allSites = sitesStore.all.value;
  if (!allSites) {
    return {};
  }

  const result: Record<string, PlanetProduction> = {};

  for (const site of allSites) {
    const id = site.siteId;
    const lines = productionStore.getBySiteId(id) ?? [];
    const storage = storagesStore.getByAddressableId(id);

    const production: PlatformProduction[] = lines.map(line => {
      const platform = site.platforms.find(p => p.module.reactorName === line.type);

      const activeOrders = line.orders.filter(o => o.started !== null && !o.halted);
      const queuedOrders = line.orders.filter(o => o.started === null || o.halted);

      return {
        id: line.id,
        reactorTicker: platform?.module.reactorTicker ?? line.type,
        capacity: line.capacity,
        activeCapacity: activeOrders.length,
        inactiveCapacity: Math.max(0, line.capacity - activeOrders.length),
        condition: line.condition,
        efficiency: line.efficiency,
        efficiencyFactors: line.efficiencyFactors,
        orders: activeOrders,
        queuedOrders,
      };
    });

    result[id] = {
      storeId: storage?.[0]?.id ?? '',
      planetName: getEntityNameFromAddress(site.address) || '',
      naturalId: getEntityNaturalIdFromAddress(site.address) || '',
      site,
      platforms: site.platforms,
      lines,
      production,
    };
  }

  return result;
});

export function getPlanetProduction(
  siteOrId?: PrunApi.Site | string | null,
): PlanetProduction | undefined {
  const siteId = typeof siteOrId === 'string' ? siteOrId : siteOrId?.siteId;

  if (!siteId) {
    return undefined;
  }
  return productionMap.value[siteId] ?? undefined;
}
