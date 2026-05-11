import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import PrunButton from '@src/components/PrunButton.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { getInvStore } from '@src/core/store-id';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNaturalIdFromAddress } from '@src/infrastructure/prun-api/data/addresses';

function onTileReady(tile: PrunTile) {
  // Only process INV tiles with parameter
  if (!tile.parameter) {
    return;
  }

  const store = getInvStore(tile.parameter);
  if (store?.type !== 'STORE') {
    return;
  }

  const onClick = () => {
    const site = sitesStore.getById(store.addressableId);
    const naturalId = getEntityNaturalIdFromAddress(site?.address);
    const warehouse = warehousesStore.getByEntityNaturalId(naturalId);
    const storageId = storagesStore.getById(warehouse?.storeId)?.id?.substring(0, 8);
    void showBuffer(storageId ? `INV ${storageId}` : `WAR ${naturalId}`);
  };

  subscribe($$(tile.anchor, C.StoreView.centered), centered => {
    createFragmentApp(() => (
      <PrunButton primary onClick={onClick}>
        Warehouse
      </PrunButton>
    )).appendTo(centered);
  });
}

function init() {
  tiles.observe('INV', onTileReady);
}

features.add(import.meta.url, init, 'INV: Adds a "Warehouse" button to base inventories.');
