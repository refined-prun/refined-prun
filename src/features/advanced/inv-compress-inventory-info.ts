import { applyScopedClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
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
  if (!tile.parameter || tile.command === 'SHPI') {
    return;
  }
  await $(tile.anchor, C.StoreView.container);

  const store = getInvStore(tile.parameter);
  if (!store) {
    return;
  }

  let cmd = '';
  switch (store.type) {
    case 'STORE': {
      const siteStore = sitesStore.getById(store?.addressableId);
      const siteEntityNaturalId = getEntityNaturalIdFromAddress(siteStore?.address);
      if (siteEntityNaturalId) {
        cmd = `PLI ${siteEntityNaturalId}`;
      }
      break;
    }
    case 'WAREHOUSE_STORE': {
      const warehouseStore = warehousesStore.getById(store?.addressableId);
      const warehouseEntityNaturalId = getEntityNaturalIdFromAddress(warehouseStore?.address);
      if (!warehouseEntityNaturalId) {
        break;
      }
      const location = getLocationLineFromAddress(warehouseStore?.address);
      if (location?.type === 'PLANET') {
        cmd = `PLI ${warehouseEntityNaturalId}`;
      } else if (location?.type === 'STATION') {
        cmd = `STNS ${warehouseEntityNaturalId}`;
      }
      break;
    }
    case 'SHIP_STORE':
    case 'FTL_FUEL_STORE':
    case 'STL_FUEL_STORE': {
      const shipStore = shipsStore.getById(store?.addressableId);
      const shipRegistration = shipStore?.registration;
      if (shipRegistration) {
        cmd = `SHP ${shipRegistration}`;
      }
      break;
    }
  }
  createFragmentApp(ContextControls, { items: [{ cmd: cmd ?? 'INV' }] }).before(
    tile.anchor.parentElement!,
  );
}

function init() {
  applyScopedClassCssRule('INV', `${C.StoreView.row}`, classes.storeInfo);
  applyScopedClassCssRule('INV', `${C.StoreView.column}`, classes.storeInfoColumn);
  applyScopedClassCssRule(
    'INV',
    `${C.StoreView.column} .${C.StoreView.capacity}:nth-child(1)`,
    css.hidden,
  );
  applyScopedClassCssRule('INV', `${C.InventorySortControls.controls}`, classes.sortControls);
  tiles.observe('INV', onTileReady);
}

features.add(import.meta.url, init, 'INV: Compresses specific inventory info into a row.');
