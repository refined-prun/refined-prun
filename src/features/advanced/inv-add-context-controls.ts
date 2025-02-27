import ContextControls from '@src/components/ContextControls.vue';
import { getInvStore } from '@src/core/store-id';
import {
  getEntityNaturalIdFromAddress,
  getLocationLineFromAddress,
  getSystemNaturalIdFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';

async function onTileReady(tile: PrunTile) {
  await $(tile.anchor, C.StoreView.container);
  createFragmentApp(ContextControls, {
    items: getCmds(tile.parameter!),
  }).before(tile.anchor.parentElement!);
}

function getCmds(invParameter: string) {
  const items: { cmd: string; label: string }[] = [];
  [
    { cmd: 'INV', label: 'All inventories' },
    getInvArgument(invParameter, getSystemNaturalIdFromAddress, 'System inventories'),
    getInvArgument(invParameter, getEntityNaturalIdFromAddress, 'Nearby inventories'),
    getStoreLocation(invParameter),
  ].forEach(element => {
    if (element !== undefined) {
      items.push(element);
    }
  });
  return items;
}

function getInvArgument(
  invParameter: string,
  AddressLineTypeFunc: (arg0: PrunApi.Address | undefined) => string | undefined,
  AddressLineType,
) {
  const store = getInvStore(invParameter);
  switch (store?.type) {
    case 'STORE': {
      const site = sitesStore.getById(store?.addressableId);
      const naturalId = AddressLineTypeFunc(site?.address);
      if (naturalId) {
        return { cmd: `INV ${naturalId}`, label: AddressLineType };
      }
      break;
    }
    case 'WAREHOUSE_STORE': {
      const warehouse = warehousesStore.getById(store?.addressableId);
      const naturalId = AddressLineTypeFunc(warehouse?.address);
      if (naturalId) {
        return { cmd: `INV ${naturalId}`, label: AddressLineType };
      }
      break;
    }
    case 'SHIP_STORE': {
      const ship = shipsStore.getById(store?.addressableId);
      const naturalId = AddressLineTypeFunc(ship?.address ?? undefined);
      if (naturalId) {
        return { cmd: `INV ${naturalId}`, label: AddressLineType };
      }
      break;
    }
  }
  return undefined;
}

function getStoreLocation(invParameter: string) {
  const store = getInvStore(invParameter);
  switch (store?.type) {
    case 'STORE': {
      const site = sitesStore.getById(store?.addressableId);
      const naturalId = getEntityNaturalIdFromAddress(site?.address);
      if (naturalId) {
        return { cmd: `PLI ${naturalId}`, label: 'Planet info' };
      }
      break;
    }
    case 'WAREHOUSE_STORE': {
      const warehouse = warehousesStore.getById(store?.addressableId);
      const naturalId = getEntityNaturalIdFromAddress(warehouse?.address);
      if (naturalId) {
        const location = getLocationLineFromAddress(warehouse?.address);
        if (location?.type === 'PLANET') {
          return { cmd: `PLI ${naturalId}`, label: 'Planet info' };
        }
        if (location?.type === 'STATION') {
          return { cmd: `STNS ${naturalId}`, label: 'Station info' };
        }
      }
      break;
    }
    case 'SHIP_STORE': {
      const ship = shipsStore.getById(store?.addressableId);
      const registration = ship?.registration;
      if (registration) {
        return { cmd: `SHP ${registration}`, label: 'Ship info' };
      }
      break;
    }
  }
  return undefined;
}

function init() {
  tiles.observe('INV', onTileReady);
}

features.add(import.meta.url, init, 'INV: Adds various context controls inventory commands.');
