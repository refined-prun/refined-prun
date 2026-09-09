import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { getInvStore } from '@src/core/store-id';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNaturalIdFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import ContextControlsItem from '@src/components/ContextControlsItem.vue';

async function onTileReady(tile: PrunTile) {
  // Only process INV tiles with parameter
  if (!tile.parameter) {
    return;
  }

  const locationNaturalId = computed(() => {
    const store = getInvStore(tile.parameter);
    if (store?.type !== 'STORE') {
      return;
    }

    const site = sitesStore.getById(store.addressableId);
    return getEntityNaturalIdFromAddress(site?.address);
  });

  const warehouse = computed(() => {
    const warehouse = warehousesStore.getByEntityNaturalId(locationNaturalId.value);
    return storagesStore.getById(warehouse?.storeId);
  });

  const contextBar = await $(tile.frame, C.ContextControls.container);

  createFragmentApp(() => {
    const naturalId = locationNaturalId.value;
    if (!naturalId) {
      return null;
    }
    const storageId = warehouse.value?.id.substring(0, 8);
    const cmd = storageId ? `INV ${storageId}` : `WAR ${naturalId}`;
    return <ContextControlsItem cmd={cmd} cmdText={`WAR ${naturalId}`} />;
  }).prependTo(contextBar);
}

function init() {
  tiles.observe('INV', onTileReady);
}

features.add(import.meta.url, init, 'INV: Adds a WAR context button to base inventories.');
