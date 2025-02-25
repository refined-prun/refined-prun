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
  getEntityNaturalIdFromAddress,
  getLocationLineFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';

async function onTileReady(tile: PrunTile) {
  await $(tile.anchor, C.StoreView.container);
  createFragmentApp(ContextControls, {
    items: [{ cmd: getContextCommand(tile.parameter!) }],
  }).before(tile.anchor.parentElement!);
}

function getContextCommand(invParameter: string) {
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
  return 'INV';
}

function init() {
  applyScopedClassCssRule('INV', C.StoreView.row, classes.storeInfo);
  applyScopedClassCssRule('INV', C.StoreView.column, classes.storeInfoColumn);
  applyScopedCssRule(
    'INV',
    `.${C.StoreView.column} .${C.StoreView.capacity}:nth-child(1)`,
    css.hidden,
  );
  applyScopedClassCssRule('INV', C.InventorySortControls.controls, classes.sortControls);
  tiles.observe('INV', onTileReady);
}

features.add(import.meta.url, init, 'INV: Compresses specific inventory info into a row.');
