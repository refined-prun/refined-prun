import { computed } from 'vue';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { getStoreLocationName, sumMapValues } from '@src/core/balance/utils';
import { shipyardProjectsStore } from '@src/infrastructure/prun-api/data/shipyard-projects';
import { shipyardsStore } from '@src/infrastructure/prun-api/data/shipyards';
import {
  getEntityNameFromAddress,
  getEntityNaturalIdFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import { calcMaterialAmountPrice, sumMaterialAmountPrice } from '@src/infrastructure/fio/cx';
import { cxosStore } from '@src/infrastructure/prun-api/data/cxos';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { sumBy } from '@src/utils/sum-by';
import { sum } from '@src/utils/sum';
import {
  partnerCurrentConditions,
  selfConditions,
  selfCurrentConditions,
  sumDeliveries,
  sumMaterialsPickup,
  sumShipmentDeliveries,
  sumPendingMaterialsPickup,
} from '@src/core/balance/contract-conditions';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getPlanetBurn } from '@src/core/burn';
import { mergeMaterialAmounts } from '@src/core/sort-materials';
import { workInProgress } from '@src/core/balance/orders';

type LocationName = string;

interface MaterialValue {
  material: PrunApi.Material;
  value: number;
}

function sumValue(materials?: MaterialValue[]) {
  return sumBy(materials, x => x.value);
}

function isPlanetAddress(address?: PrunApi.Address) {
  return address?.lines[1]?.type === 'PLANET';
}

function isStationAddress(address?: PrunApi.Address) {
  return address?.lines[1]?.type === 'STATION';
}

const inventoryMarketValue = computed(() => {
  const storages = storagesStore.all.value;
  if (storages === undefined) {
    return undefined;
  }
  const inventories = new Map<string, MaterialValue[]>();
  for (const storage of storages) {
    const materials: MaterialValue[] = [];
    for (const item of storage.items) {
      if (!item.quantity) {
        continue;
      }
      const value = calcMaterialAmountPrice(item.quantity);
      if (value === undefined) {
        return undefined;
      }
      materials.push({
        material: item.quantity.material,
        value,
      });
    }
    inventories.set(storage.id, materials);
  }
  return inventories;
});

function sumStoresValue(stores: PrunApi.Store[] | undefined) {
  const marketValue = inventoryMarketValue.value;
  if (marketValue === undefined || stores === undefined) {
    return undefined;
  }
  let total = 0;
  for (const store of stores) {
    const value = sumValue(marketValue.get(store.id));
    if (value === undefined) {
      return undefined;
    }
    total += value;
  }
  return total;
}

const shipyardInventoryByLocation = computed(() => {
  const projects = shipyardProjectsStore.all.value;
  if (projects === undefined) {
    return undefined;
  }
  const inventories = new Map<LocationName, number>();
  for (const project of projects.filter(x => x.status === 'CREATED')) {
    const value = sumMaterialAmountPrice(project.inventory.items);
    if (value === undefined) {
      return undefined;
    }

    const shipyard = shipyardsStore.getById(project.shipyardId);
    if (!shipyard) {
      continue;
    }

    const name = getEntityNameFromAddress(shipyard.address)!;
    inventories.set(name, (inventories.get(name) ?? 0) + value);
  }
  return inventories;
});

const shipyardInventory = computed(() => sumMapValues(shipyardInventoryByLocation.value));

const byLocation = computed(() => {
  const marketValue = inventoryMarketValue.value;
  const storages = storagesStore.all.value;
  const shipyards = shipyardInventoryByLocation.value;
  if (marketValue === undefined || storages === undefined || shipyards === undefined) {
    return undefined;
  }
  const inventories = new Map<LocationName, number>();
  for (const store of storages) {
    const totalValue = sumValue(marketValue.get(store.id));
    if (totalValue === undefined) {
      return undefined;
    }

    const name = getStoreLocationName(store);
    inventories.set(name, (inventories.get(name) ?? 0) + totalValue);
  }
  for (const location of shipyards.keys()) {
    const value = shipyards.get(location)!;
    inventories.set(location, (inventories.get(location) ?? 0) + value);
  }
  return inventories;
});

const cxListedMaterials = computed(() => {
  const sellOrders = cxosStore.all.value?.filter(
    x => x.type === 'SELLING' && x.status !== 'FILLED',
  );
  return sumMaterialAmountPrice(sellOrders);
});

const cxStores = computed(() => storagesStore.all.value?.filter(isCXStore));

function isCXStore(store: PrunApi.Store) {
  if (store.type !== 'WAREHOUSE_STORE') {
    return false;
  }

  const warehouse = warehousesStore.getById(store.addressableId);
  return isStationAddress(warehouse?.address);
}

const cxInventory = computed(() => sumStoresValue(cxStores.value));

const baseInventory = computed(() => {
  const marketValue = inventoryMarketValue.value;
  const sites = sitesStore.all.value;
  if (marketValue === undefined || sites === undefined) {
    return undefined;
  }

  let finishedGoods = 0;
  let rawMaterials = 0;
  let workforceConsumables = 0;
  let otherItems = 0;
  for (const site of sites) {
    let stores = storagesStore.getByAddressableId(site.siteId);
    const burn = getPlanetBurn(site);
    if (!stores || !burn) {
      return undefined;
    }
    const naturalId = getEntityNaturalIdFromAddress(site.address);
    const warehouse = warehousesStore.getByEntityNaturalId(naturalId);
    const warehouseStore = storagesStore.getById(warehouse?.storeId);
    if (warehouseStore) {
      stores = stores.slice();
      stores.push(warehouseStore);
    }
    const amounts = mergeMaterialAmounts(
      stores.flatMap(x => x.items.map(y => y.quantity!).filter(y => !!y)),
    );
    for (const amount of amounts) {
      const value = calcMaterialAmountPrice(amount);
      if (value === undefined) {
        return undefined;
      }
      const burnEntry = burn.burn[amount.material.ticker];
      switch (burnEntry?.Type) {
        case 'input':
          rawMaterials += value;
          break;
        case 'output':
          finishedGoods += value;
          break;
        case 'workforce':
          workforceConsumables += value;
          break;
        default:
          otherItems += value;
          break;
      }
    }
  }
  return {
    finishedGoods,
    rawMaterials,
    workforceConsumables,
    otherItems,
  };
});

const finishedGoods = computed(() => baseInventory.value?.finishedGoods);

const rawMaterials = computed(() => baseInventory.value?.rawMaterials);

const workforceConsumables = computed(() => baseInventory.value?.workforceConsumables);

const siteNaturalIds = computed(() => {
  const sites = sitesStore.all.value;
  if (sites === undefined) {
    return undefined;
  }

  const naturalIds = new Set<string>();
  for (const site of sites) {
    const naturalId = getEntityNaturalIdFromAddress(site.address);
    if (naturalId !== undefined) {
      naturalIds.add(naturalId);
    }
  }
  return naturalIds;
});

const unboundWarehouseStores = computed(() => {
  const naturalIds = siteNaturalIds.value;
  const stores = storagesStore.all.value;
  if (naturalIds === undefined || stores === undefined) {
    return undefined;
  }

  return stores.filter(x => isUnboundWarehouseStore(x, naturalIds));
});

function isUnboundWarehouseStore(store: PrunApi.Store, siteNaturalIds: Set<string>) {
  if (store.type !== 'WAREHOUSE_STORE') {
    return false;
  }

  const warehouse = warehousesStore.getById(store.addressableId);
  if (warehouse === undefined) {
    return true;
  }
  const address = warehouse.address;
  if (isStationAddress(address)) {
    return false;
  }
  if (!isPlanetAddress(address)) {
    return true;
  }
  const naturalId = getEntityNaturalIdFromAddress(address);
  return naturalId === undefined || !siteNaturalIds.has(naturalId);
}

const unboundInventory = computed(() => sumStoresValue(unboundWarehouseStores.value));

const otherItems = computed(() =>
  sum(baseInventory.value?.otherItems, shipyardInventory.value, unboundInventory.value),
);

const fuelStores = computed(() => storagesStore.all.value?.filter(isFuelStore));

function isFuelStore(store: PrunApi.Store) {
  return store.type === 'STL_FUEL_STORE' || store.type === 'FTL_FUEL_STORE';
}

const fuelTanks = computed(() => sumStoresValue(fuelStores.value));

const shipStores = computed(() => storagesStore.all.value?.filter(isShipStore));

function isShipStore(store: PrunApi.Store) {
  return store.type === 'SHIP_STORE';
}

const shipInventory = computed(() => sumStoresValue(shipStores.value));

const materialsInTransit = computed(() =>
  sum(shipInventory.value, sumShipmentDeliveries(partnerCurrentConditions)),
);

const materialsReceivable = computed(() =>
  sum(
    sumDeliveries(partnerCurrentConditions),
    sumMaterialsPickup(selfCurrentConditions),
    // After all dependencies are fulfilled,
    // the player must pick up the materials via COMEX_PURCHASE_PICKUP condition.
    // We'll consider these materials as a part of current assets, regardless of
    // COMEX_PURCHASE_PICKUP deadline, since they can be picked up at any time.
    sumPendingMaterialsPickup(selfConditions),
  ),
);

export const inventory = {
  byLocation,
  cxListedMaterials,
  cxInventory,
  finishedGoods,
  workInProgress,
  rawMaterials,
  workforceConsumables,
  otherItems,
  fuelTanks,
  materialsInTransit,
  materialsReceivable,
};
