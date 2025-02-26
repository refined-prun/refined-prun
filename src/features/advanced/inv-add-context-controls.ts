import {
  applyScopedClassCssRule,
  applyScopedCssRule,
} from '@src/infrastructure/prun-ui/refined-prun-css';
import classes from './inv-compress-inventory-info.module.css';
import css from '@src/utils/css-utils.module.css';
import ContextControls from '@src/components/ContextControls.vue';
import { getInvStore } from '@src/core/store-id';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import {
  getEntityNameFromAddress,
  getEntityNaturalIdFromAddress,
  getLocationLineFromAddress,
  getSystemNaturalIdFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';

async function onTileReady(tile: PrunTile) {
  await $(tile.anchor, C.StoreView.container);
  createFragmentApp(ContextControls, {
    items: getCmds(tile.parameter!),
  }).before(tile.anchor.parentElement!);
}

function getCmds(invParameter: string) {
  const items: { cmd: string }[] = [];
  [
    'INV',
    getSystemStores(invParameter),
    getNearbyStores(invParameter),
    getStoreLocation(invParameter),
  ].forEach(element => {
    if (element !== undefined) {
      items.push({ cmd: element });
    }
  });
  return items;
}

function getNearbyStores(invParameter: string) {
  const store = getInvStore(invParameter);
  switch (store?.type) {
    case 'STORE': {
      const site = sitesStore.getById(store?.addressableId);
      const naturalId = getEntityNaturalIdFromAddress(site?.address);
      if (naturalId) {
        return `INV ${naturalId}`;
      }
    }
    case 'WAREHOUSE_STORE': {
      const warehouse = warehousesStore.getById(store?.addressableId);
      const naturalId = getEntityNaturalIdFromAddress(warehouse?.address);
      if (!naturalId) {
        break;
      }
      //TODO how do you get all inventories if theres a ship, warehouse, etc at a station?
      const location = getLocationLineFromAddress(warehouse?.address);
      if (location?.type === 'PLANET') {
        return `INV ${naturalId}`;
      }
      if (location?.type === 'STATION') {
        return `TEST4 ${naturalId}`;
      }
    }
    case 'SHIP_STORE': {
      const ship = shipsStore.getById(store?.addressableId);
      //ship has adress=null
      //TODO how do i get the system from the ship when its flying from its inventory?
      console.log(ship);
      return 'TEST3';
    }
  }
  return undefined;
}

function getSystemStores(invParameter: string) {
  const store = getInvStore(invParameter);
  switch (store?.type) {
    case 'STORE': {
      const site = sitesStore.getById(store?.addressableId);
      const naturalId = getSystemNaturalIdFromAddress(site?.address);
      if (naturalId) {
        return `INV ${naturalId}`;
      }
    }
    case 'WAREHOUSE_STORE': {
      const warehouse = warehousesStore.getById(store?.addressableId);
      const naturalId = getSystemNaturalIdFromAddress(warehouse?.address);
      if (!naturalId) {
        return `INV ${naturalId}`;
      }
    }
    case 'SHIP_STORE': {
      const ship = shipsStore.getById(store?.addressableId);
      //ship has adress=null
      //TODO how do i get the system from the ship when its flying from its inventory?
      console.log(ship);
      return 'TEST3';
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
        return `PLI ${naturalId}`;
      }
      break;
    }
    case 'WAREHOUSE_STORE': {
      const warehouse = warehousesStore.getById(store?.addressableId);
      const naturalId = getEntityNaturalIdFromAddress(warehouse?.address);
      if (!naturalId) {
        break;
      }
      const location = getLocationLineFromAddress(warehouse?.address);
      if (location?.type === 'PLANET') {
        return `PLI ${naturalId}`;
      }
      if (location?.type === 'STATION') {
        return `STNS ${naturalId}`;
      }
      break;
    }
    case 'SHIP_STORE': {
      const ship = shipsStore.getById(store?.addressableId);
      const registration = ship?.registration;
      if (registration) {
        return `SHP ${registration}`;
      }
      break;
    }
  }
  return undefined;
}

function init() {
  tiles.observe('INV', onTileReady);
}

features.add(import.meta.url, init, 'INV: Adds various context controls to inventories');
