import { computeNeed, getPlanetBurn } from '@src/core/burn';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import {
  getEntityNameFromAddress,
  getEntityNaturalIdFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import { userData } from '@src/store/user-data';

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

  // Current fill.
  fillPercentWeight: number;
  fillPercentVolume: number;

  // Current fill excluding inventory of net-positive (infinity-days) materials.
  fillPercentWeightNoInf: number;
  fillPercentVolumeNoInf: number;

  // Projected fill after delivering Need amount for every consumed material.
  needFillPercentWeight: number;
  needFillPercentVolume: number;
  // Max of the two — the color driver.
  needFillRatio: number;

  // Days-until-full at net production rate. Infinity when net flow ≤ 0.
  daysUntilFull: number;
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
  const storage = storagesStore.getByAddressableId(site.siteId);
  const store = storage?.find(x => x.type === 'STORE');
  if (!store) {
    return undefined;
  }

  const planetBurn = getPlanetBurn(site);
  const resupplyDays = userData.settings.burn.resupply;

  let importWeight = 0;
  let importVolume = 0;
  let exportWeight = 0;
  let exportVolume = 0;
  let infWeight = 0;
  let infVolume = 0;
  let addedWeight = 0;
  let addedVolume = 0;

  if (planetBurn) {
    for (const ticker of Object.keys(planetBurn.burn)) {
      const mat = materialsStore.getByTicker(ticker);
      if (!mat) {
        continue;
      }
      const mb = planetBurn.burn[ticker];
      const daily = mb.dailyAmount;

      if (daily < 0) {
        // Net consumer — contributes to import rate.
        const consumption = -daily;
        importWeight += consumption * mat.weight;
        importVolume += consumption * mat.volume;
      } else {
        // Net-positive / infinity material.
        exportWeight += daily * mat.weight;
        exportVolume += daily * mat.volume;
        infWeight += mb.inventory * mat.weight;
        infVolume += mb.inventory * mat.volume;
      }

      const need = computeNeed(mb, resupplyDays);
      if (need > 0) {
        addedWeight += need * mat.weight;
        addedVolume += need * mat.volume;
      }
    }
  }

  const fillPercentWeight = store.weightCapacity > 0 ? store.weightLoad / store.weightCapacity : 0;
  const fillPercentVolume = store.volumeCapacity > 0 ? store.volumeLoad / store.volumeCapacity : 0;

  const fillPercentWeightNoInf =
    store.weightCapacity > 0 ? Math.max(store.weightLoad - infWeight, 0) / store.weightCapacity : 0;
  const fillPercentVolumeNoInf =
    store.volumeCapacity > 0 ? Math.max(store.volumeLoad - infVolume, 0) / store.volumeCapacity : 0;

  const needFillPercentWeight =
    store.weightCapacity > 0 ? (store.weightLoad + addedWeight) / store.weightCapacity : 0;
  const needFillPercentVolume =
    store.volumeCapacity > 0 ? (store.volumeLoad + addedVolume) / store.volumeCapacity : 0;
  const needFillRatio = Math.max(needFillPercentWeight, needFillPercentVolume);

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
    fillPercentWeightNoInf,
    fillPercentVolumeNoInf,
    needFillPercentWeight,
    needFillPercentVolume,
    needFillRatio,
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

// Returns a synthetic Store representing the base's STORE after a full resupply
// rotation: net-positive (producing) materials shipped out, consumed materials
// topped up to their computeNeed amount. Capacity is unchanged. Used by
// CargoBar to visualize projected fill.
export function buildProjectedStore(
  siteOrId?: PrunApi.Site | string | null,
): PrunApi.Store | undefined {
  const site = typeof siteOrId === 'string' ? sitesStore.getById(siteOrId) : siteOrId;
  if (!site) {
    return undefined;
  }
  const storage = storagesStore.getByAddressableId(site.siteId);
  const store = storage?.find(x => x.type === 'STORE');
  if (!store) {
    return undefined;
  }

  const planetBurn = getPlanetBurn(site);
  const resupplyDays = userData.settings.burn.resupply;

  const items: PrunApi.StoreItem[] = [];
  let weightLoad = 0;
  let volumeLoad = 0;

  // Start with existing items from consumers (exclude net-positive / produced goods).
  const consumedTickers = new Set<string>();
  if (planetBurn) {
    for (const ticker of Object.keys(planetBurn.burn)) {
      if (planetBurn.burn[ticker].dailyAmount < 0) {
        consumedTickers.add(ticker);
      }
    }
  }

  for (const item of store.items) {
    if (item.type === 'SHIPMENT') {
      items.push(item);
      weightLoad += item.weight;
      volumeLoad += item.volume;
      continue;
    }
    const ticker = item.quantity?.material.ticker;
    if (!ticker || !consumedTickers.has(ticker)) {
      // Producing goods get shipped out; materials not in burn stay as-is (e.g., idle stock).
      if (!planetBurn || !(ticker && ticker in planetBurn.burn)) {
        items.push(item);
        weightLoad += item.weight;
        volumeLoad += item.volume;
      }
      continue;
    }
    items.push(item);
    weightLoad += item.weight;
    volumeLoad += item.volume;
  }

  // Add Need top-ups for consumed materials.
  if (planetBurn) {
    for (const ticker of Object.keys(planetBurn.burn)) {
      const mb = planetBurn.burn[ticker];
      const need = computeNeed(mb, resupplyDays);
      if (need <= 0) {
        continue;
      }
      const material = materialsStore.getByTicker(ticker);
      if (!material) {
        continue;
      }
      const addedWeight = need * material.weight;
      const addedVolume = need * material.volume;
      items.push({
        id: `projected-${ticker}`,
        type: 'INVENTORY',
        weight: addedWeight,
        volume: addedVolume,
        quantity: {
          material,
          amount: need,
          value: { amount: 0, currency: 'NCC' } as PrunApi.CurrencyAmount,
        },
      });
      weightLoad += addedWeight;
      volumeLoad += addedVolume;
    }
  }

  return {
    ...store,
    items,
    weightLoad,
    volumeLoad,
  };
}
