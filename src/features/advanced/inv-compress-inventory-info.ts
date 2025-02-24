import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
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

function onTileReady(tile: PrunTile) {
  if (!tile.parameter) {
    return;
  }
  if (!tile.anchor.children[0].classList.contains(C.StoreView.container)) {
    return;
  }
  const store = getInvStore(tile.parameter);
  if (!store) {
    return;
  }

  const items = [{ cmd: '', label: undefined }];
  switch (store.type) {
    case 'STORE': {
      const siteStore = sitesStore.getById(store?.addressableId);
      const siteEntityNaturalId = getEntityNaturalIdFromAddress(siteStore?.address);
      items[0].cmd = `PLI ${siteEntityNaturalId}`;
      break;
    }
    case 'WAREHOUSE_STORE': {
      const warehouseStore = warehousesStore.getById(store?.addressableId);
      const warehouseEntityNaturalId = getEntityNaturalIdFromAddress(warehouseStore?.address);
      const location = getLocationLineFromAddress(warehouseStore?.address);
      if (location?.type === 'PLANET') {
        items[0].cmd = `PLI ${warehouseEntityNaturalId}`;
      } else if (location?.type === 'STATION') {
        items[0].cmd = `STNS ${warehouseEntityNaturalId}`;
      } else {
        items[0].cmd = `INV ${warehouseEntityNaturalId}`;
      }
      break;
    }
    case 'SHIP_STORE':
    case 'FTL_FUEL_STORE':
    case 'STL_FUEL_STORE': {
      const shipStore = shipsStore.getById(store?.addressableId);
      const shipRegistration = shipStore?.registration;
      items[0].cmd = `SHP ${shipRegistration}`;
      break;
    }
  }

  createFragmentApp(ContextControls, { items }).before(tile.anchor.parentElement as HTMLDivElement);
}

function init() {
  applyCssRule(`.${C.StoreView.row}`, classes.reposition);
  applyCssRule(`.${C.StoreView.column}`, classes.flexRow);
  applyCssRule(`.${C.StoreView.column} .${C.StoreView.capacity}:nth-child(1)`, css.hidden);
  applyCssRule(`.${C.InventorySortControls.controls}`, classes.padLeftRight);
  tiles.observe('INV', onTileReady);
}

features.add(import.meta.url, init, 'INV: Compresses specific inventory info into a row.');
