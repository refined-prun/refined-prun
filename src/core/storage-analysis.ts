import {
  computeNeed,
  getInboundShips,
  getInboundShipStores,
  getMinDaysLeft,
  getPlanetBurn,
  getResupplyDays,
} from '@src/core/burn';
import { getShipSize, ShipSize } from '@src/core/ship-sizes';
import { userData } from '@src/store/user-data';
import { fixed02 } from '@src/utils/format';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import {
  getEntityNameFromAddress,
  getEntityNaturalIdFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';

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

  // Current inventory of strictly net-producing (dailyAmount > 0) materials -
  // the goods a pickup run would actually carry away.
  producedWeight: number;
  producedVolume: number;

  // Current fill.
  fillPercentWeight: number;
  fillPercentVolume: number;

  // Projected fill after inbound cargo and remaining Need amounts are delivered.
  needFillPercentWeight: number;
  needFillPercentVolume: number;
  // Max of the two - the color driver.
  needFillRatio: number;

  // Headroom after shipping out produced goods but BEFORE any delivery.
  // Used for the Fill Summary "After ship-out" row.
  availableAfterShipOutWeight: number;
  availableAfterShipOutVolume: number;
  // Total days of consumables the base could hold after ship-out, filling up
  // to the reserve threshold. Counts currently-held consumables as part of the
  // total (not "extra days of room"). Infinity if nothing is consumed.
  daysOfSuppliesFit: number;
  // 0.20 when storage is filling (reserve for produced goods that keep
  // accumulating between visits), 0.05 when draining (small variance buffer).
  suppliesReserveFraction: number;

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
  const naturalId = getEntityNaturalIdFromAddress(site.address);
  const resupplyDays = getResupplyDays(naturalId);
  const inboundItems = getInboundInventory(naturalId);

  let importWeight = 0;
  let importVolume = 0;
  let exportWeight = 0;
  let exportVolume = 0;
  let addedWeight = sumBy(inboundItems, x => x.weight);
  let addedVolume = sumBy(inboundItems, x => x.volume);
  // Weight/volume of current inventory for strictly-producing (dailyAmount > 0)
  // materials - these get shipped out during rotation.
  let shippedOutWeight = 0;
  let shippedOutVolume = 0;
  // Weight/volume of current inventory for net-consuming (dailyAmount < 0)
  // materials - counted toward the "supplies that fit" total (not against).
  let consumerInventoryWeight = 0;
  let consumerInventoryVolume = 0;

  if (planetBurn) {
    for (const ticker of Object.keys(planetBurn.burn)) {
      const mat = materialsStore.getByTicker(ticker);
      if (!mat) {
        continue;
      }
      const mb = planetBurn.burn[ticker];
      const daily = mb.dailyAmount;

      if (daily < 0) {
        // Net consumer - contributes to import rate.
        const consumption = -daily;
        importWeight += consumption * mat.weight;
        importVolume += consumption * mat.volume;
        consumerInventoryWeight += mb.inventory * mat.weight;
        consumerInventoryVolume += mb.inventory * mat.volume;
      } else {
        // Net-positive or zero material.
        exportWeight += daily * mat.weight;
        exportVolume += daily * mat.volume;
      }

      if (daily > 0) {
        shippedOutWeight += mb.inventory * mat.weight;
        shippedOutVolume += mb.inventory * mat.volume;
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

  // Headroom after a ship-out: capacity minus current load plus the weight of
  // producing materials that will leave.
  const availableAfterShipOutWeight = Math.max(
    store.weightCapacity - store.weightLoad + shippedOutWeight,
    0,
  );
  const availableAfterShipOutVolume = Math.max(
    store.volumeCapacity - store.volumeLoad + shippedOutVolume,
    0,
  );
  // Reserve depends on net flow: a filling base needs headroom for produced
  // goods between visits (20%); a draining base only needs a small variance
  // buffer (5%).
  const suppliesReserveFraction = daysUntilFull === Infinity ? 0.05 : 0.2;
  // Total consumables the base could hold after ship-out: fill capacity up to
  // (1 - reserve), minus the idle non-consumable load that stays in storage
  // (zero-daily stock that isn't shipped out and isn't consumed). Consumer
  // inventory counts toward the total - that's what the user is measuring.
  const idleNonConsumableWeight = Math.max(
    store.weightLoad - shippedOutWeight - consumerInventoryWeight,
    0,
  );
  const idleNonConsumableVolume = Math.max(
    store.volumeLoad - shippedOutVolume - consumerInventoryVolume,
    0,
  );
  const consumableCapWeight = Math.max(
    store.weightCapacity * (1 - suppliesReserveFraction) - idleNonConsumableWeight,
    0,
  );
  const consumableCapVolume = Math.max(
    store.volumeCapacity * (1 - suppliesReserveFraction) - idleNonConsumableVolume,
    0,
  );
  const daysFitW = importWeight > 0 ? consumableCapWeight / importWeight : Infinity;
  const daysFitV = importVolume > 0 ? consumableCapVolume / importVolume : Infinity;
  const daysOfSuppliesFit = Math.min(daysFitW, daysFitV);

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
    producedWeight: shippedOutWeight,
    producedVolume: shippedOutVolume,
    fillPercentWeight,
    fillPercentVolume,
    needFillPercentWeight,
    needFillPercentVolume,
    needFillRatio,
    availableAfterShipOutWeight,
    availableAfterShipOutVolume,
    daysOfSuppliesFit,
    suppliesReserveFraction,
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

export type StorageAlarmLevel = 'red' | 'yellow' | 'none';

export interface StorageAlarm {
  level: StorageAlarmLevel;
  // Short human-readable explanation, set for 'red'/'yellow' only.
  reason?: string;
  // Raw days until full, set for 'yellow' only.
  days?: number;
}

// Item sizes make exact 100% fill rare and overflow impossible - treat anything
// past this as full.
const STORAGE_FULL_THRESHOLD = 0.99;

// Yellow only fires this close to actually filling up - otherwise every
// slowly-filling base would flag days out, well before it's actionable.
const YELLOW_DAYS_THRESHOLD = 2.9;

function formatDaysShort(days: number) {
  return days >= 500 ? '∞' : `${Math.floor(days)}d`;
}

// Alarm for XIT BS's Inv column: red once storage is (near-)full, yellow once
// it's within YELLOW_DAYS_THRESHOLD days of filling AND on track to do so
// before the base's next expected resupply (the point its most urgent
// consumable burn hits 1 day left). A ship inbound to the base counts its
// full cargo capacity as extra storage room, since it will carry
// away produced goods once it arrives - this both prevents and clears the alarm
// once a ship has been dispatched.
export function getStorageAlarmLevel(
  siteOrId?: PrunApi.Site | string | null,
): StorageAlarm | undefined {
  const analysis = getBaseStorageAnalysis(siteOrId);
  if (!analysis) {
    return undefined;
  }

  const inboundShips = getInboundShipStores(analysis.naturalId);
  const shipWeightCapacity = sumBy(inboundShips, s => s.weightCapacity);
  const shipVolumeCapacity = sumBy(inboundShips, s => s.volumeCapacity);

  const adjustedWeightCapacity = analysis.weightCapacity + shipWeightCapacity;
  const adjustedVolumeCapacity = analysis.volumeCapacity + shipVolumeCapacity;

  const fillWeight = adjustedWeightCapacity > 0 ? analysis.weightLoad / adjustedWeightCapacity : 0;
  const fillVolume = adjustedVolumeCapacity > 0 ? analysis.volumeLoad / adjustedVolumeCapacity : 0;
  if (fillWeight >= STORAGE_FULL_THRESHOLD || fillVolume >= STORAGE_FULL_THRESHOLD) {
    const binding = fillWeight >= fillVolume ? 'weight' : 'volume';
    return { level: 'red', reason: `Storage full (${binding})` };
  }

  const availableWeight = Math.max(adjustedWeightCapacity - analysis.weightLoad, 0);
  const availableVolume = Math.max(adjustedVolumeCapacity - analysis.volumeLoad, 0);
  const netWeight = analysis.exportWeight - analysis.importWeight;
  const netVolume = analysis.exportVolume - analysis.importVolume;
  const daysW = netWeight > 0 ? availableWeight / netWeight : Infinity;
  const daysV = netVolume > 0 ? availableVolume / netVolume : Infinity;
  const daysUntilFull = Math.min(daysW, daysV);

  const planetBurn = getPlanetBurn(analysis.siteId);
  const burnDays = planetBurn ? getMinDaysLeft(planetBurn.burn) : 1000;
  const nextResupplyDays = burnDays >= 1000 ? Infinity : Math.max(burnDays - 1, 0);

  if (daysUntilFull <= YELLOW_DAYS_THRESHOLD && daysUntilFull < nextResupplyDays) {
    return {
      level: 'yellow',
      reason: `Fills in ${formatDaysShort(daysUntilFull)}, before next resupply (${formatDaysShort(nextResupplyDays)})`,
      days: daysUntilFull,
    };
  }
  return { level: 'none' };
}

export interface PickupAlarm {
  // The ship size the base is waiting for.
  shipSize: ShipSize;
  // Short human-readable explanation of what fills the ship.
  reason: string;
}

// How far ahead the alarm looks. A pickup run takes time to arrange, so the
// badge lights up a day before the produced goods actually fill the ship.
const PICKUP_LEAD_DAYS = 1;

// Alarm for XIT BS's Inv column: a base whose accumulated produced goods fill -
// or within PICKUP_LEAD_DAYS will fill - the pickup ship picked for it in XIT
// PLNT. Returns undefined when no ship size is configured, when the pile is
// still too small, or when a ship is already in flight to the planet - a
// dispatched ship clears the alarm so the player doesn't send a second one,
// while a ship that has already landed does not (its cargo run isn't done until
// it leaves).
export function getPickupAlarm(siteOrId?: PrunApi.Site | string | null): PickupAlarm | undefined {
  const analysis = getBaseStorageAnalysis(siteOrId);
  if (!analysis) {
    return undefined;
  }

  const shipSize = getShipSize(userData.settings.burn.planetPickup?.[analysis.naturalId]);
  if (!shipSize) {
    return undefined;
  }

  if (getInboundShips(analysis.naturalId).length > 0) {
    return undefined;
  }

  // The analysis' export rates are the per-day rate at which net-produced goods
  // pile up, so this is the stock PICKUP_LEAD_DAYS from now.
  const projectedWeight = analysis.producedWeight + analysis.exportWeight * PICKUP_LEAD_DAYS;
  const projectedVolume = analysis.producedVolume + analysis.exportVolume * PICKUP_LEAD_DAYS;

  const fillsWeight = projectedWeight >= shipSize.weight;
  const fillsVolume = projectedVolume >= shipSize.volume;
  if (!fillsWeight && !fillsVolume) {
    return undefined;
  }

  const fullWeight = analysis.producedWeight >= shipSize.weight;
  const fullVolume = analysis.producedVolume >= shipSize.volume;
  const full = fullWeight || fullVolume;
  const binding = (full ? fullWeight : fillsWeight) ? 'weight' : 'volume';
  const current = `${fixed02(analysis.producedWeight)}t / ${fixed02(analysis.producedVolume)}m³`;
  const projected = `${fixed02(projectedWeight)}t / ${fixed02(projectedVolume)}m³`;
  return {
    shipSize,
    reason: full
      ? `Pickup ready: ${current} fills a ${shipSize.id} ship (${binding})`
      : `Pickup ready within 24h: ${current} now, ${projected} in 24h - ` +
        `fills a ${shipSize.id} ship (${binding})`,
  };
}

// Returns a synthetic Store representing the base's STORE after a full resupply
// rotation: inbound inventory delivered, net-positive materials shipped out,
// consumed materials topped up to their computeNeed amount. Capacity is unchanged. Used by
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
  const resupplyDays = getResupplyDays(getEntityNaturalIdFromAddress(site.address));

  const items: PrunApi.StoreItem[] = [];
  let weightLoad = 0;
  let volumeLoad = 0;

  // Tickers that are strictly net-producing - their existing inventory is assumed
  // shipped out during the rotation. Zero-daily materials (idle stock) are kept.
  const producedTickers = new Set<string>();
  if (planetBurn) {
    for (const ticker of Object.keys(planetBurn.burn)) {
      if (planetBurn.burn[ticker].dailyAmount > 0) {
        producedTickers.add(ticker);
      }
    }
  }

  const inboundItems = getInboundInventory(getEntityNaturalIdFromAddress(site.address));
  for (const item of [...store.items, ...inboundItems]) {
    if (item.type === 'SHIPMENT') {
      items.push(item);
      weightLoad += item.weight;
      volumeLoad += item.volume;
      continue;
    }
    const ticker = item.quantity?.material.ticker;
    if (ticker && producedTickers.has(ticker)) {
      // Producing material - ships out, contributes nothing to projected load.
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

function getInboundInventory(naturalId: string | undefined) {
  return getInboundShipStores(naturalId).flatMap(x => x.items.filter(x => x.type === 'INVENTORY'));
}
