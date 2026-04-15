import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { workforcesStore } from '@src/infrastructure/prun-api/data/workforces';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import {
  getEntityNameFromAddress,
  getEntityNaturalIdFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import { getRecurringOrders } from '@src/core/orders';

export interface BaseStorageAnalysis {
  siteId: string;
  storeId: string;
  planetName: string;
  naturalId: string;

  weightCapacity: number;
  weightLoad: number;
  volumeCapacity: number;
  volumeLoad: number;

  // Per-day rates aggregated across all materials (tonnes/day, m³/day).
  importWeight: number;
  importVolume: number;
  exportWeight: number;
  exportVolume: number;

  // Derived.
  fillPercentWeight: number;
  fillPercentVolume: number;
  daysUntilFull: number; // Infinity when net flow ≤ 0 in both dimensions.
  bindingLimit: 't' | 'm³' | undefined;
}

const analysisBySiteId = computed(() => {
  if (!sitesStore.all.value) {
    return undefined;
  }
  const bySiteId = new Map<string, Ref<BaseStorageAnalysis | undefined>>();
  for (const site of sitesStore.all.value) {
    bySiteId.set(
      site.siteId,
      computed(() => computeAnalysis(site)),
    );
  }
  return bySiteId;
});

function computeAnalysis(site: PrunApi.Site): BaseStorageAnalysis | undefined {
  const production = productionStore.getBySiteId(site.siteId);
  const workforce = workforcesStore.getById(site.siteId)?.workforces;
  const storage = storagesStore.getByAddressableId(site.siteId);
  const store = storage?.find(x => x.type === 'STORE');
  if (!store) {
    return undefined;
  }

  let importWeight = 0;
  let importVolume = 0;
  let exportWeight = 0;
  let exportVolume = 0;

  if (production) {
    for (const line of production) {
      const capacity = line.capacity;
      const orders = getRecurringOrders(line);
      let totalDuration = sumBy(orders, x => x.duration?.millis ?? Infinity);
      totalDuration /= 86400000; // ms → days
      if (totalDuration === 0) {
        continue;
      }
      for (const order of orders) {
        for (const mat of order.outputs) {
          const perDay = (mat.amount * capacity) / totalDuration;
          exportWeight += perDay * mat.material.weight;
          exportVolume += perDay * mat.material.volume;
        }
        for (const mat of order.inputs) {
          const perDay = (mat.amount * capacity) / totalDuration;
          importWeight += perDay * mat.material.weight;
          importVolume += perDay * mat.material.volume;
        }
      }
    }
  }

  if (workforce) {
    for (const tier of workforce) {
      if (tier.population <= 1 || tier.capacity === 0) {
        continue;
      }
      for (const need of tier.needs) {
        importWeight += need.unitsPerInterval * need.material.weight;
        importVolume += need.unitsPerInterval * need.material.volume;
      }
    }
  }

  const fillPercentWeight = store.weightCapacity > 0 ? store.weightLoad / store.weightCapacity : 0;
  const fillPercentVolume = store.volumeCapacity > 0 ? store.volumeLoad / store.volumeCapacity : 0;

  const availableWeight = Math.max(store.weightCapacity - store.weightLoad, 0);
  const availableVolume = Math.max(store.volumeCapacity - store.volumeLoad, 0);
  const netWeight = exportWeight - importWeight;
  const netVolume = exportVolume - importVolume;

  const daysW = netWeight > 0 ? availableWeight / netWeight : Infinity;
  const daysV = netVolume > 0 ? availableVolume / netVolume : Infinity;
  const daysUntilFull = Math.min(daysW, daysV);
  const bindingLimit: 't' | 'm³' | undefined =
    daysUntilFull === Infinity ? undefined : daysW < daysV ? 't' : 'm³';

  return {
    siteId: site.siteId,
    storeId: store.id,
    planetName: getEntityNameFromAddress(site.address) ?? '',
    naturalId: getEntityNaturalIdFromAddress(site.address) ?? '',
    weightCapacity: store.weightCapacity,
    weightLoad: store.weightLoad,
    volumeCapacity: store.volumeCapacity,
    volumeLoad: store.volumeLoad,
    importWeight,
    importVolume,
    exportWeight,
    exportVolume,
    fillPercentWeight,
    fillPercentVolume,
    daysUntilFull,
    bindingLimit,
  };
}

export function getBaseStorageAnalysis(siteOrId?: PrunApi.Site | string | null) {
  const site = typeof siteOrId === 'string' ? sitesStore.getById(siteOrId) : siteOrId;
  if (!site) {
    return undefined;
  }
  return analysisBySiteId.value?.get(site.siteId)?.value;
}
