import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import ContextControlsItem from '@src/components/ContextControlsItem.vue';
import { getInvStore } from '@src/core/store-id';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNaturalIdFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { openCompanionBuffer } from '@src/infrastructure/prun-ui/companion-buffer';

async function onTileReady(tile: PrunTile) {
  if (!tile.parameter) {
    return;
  }

  const naturalId = computed(() => {
    const store = getInvStore(tile.parameter);
    if (store?.type !== 'STORE') {
      return;
    }

    const site = sitesStore.getById(store.addressableId);
    return getEntityNaturalIdFromAddress(site?.address);
  });

  const contextBar = await $(tile.frame, C.ContextControls.container);

  // Insert after the analysis button (first child, prepended by inv-analysis-button)
  // so the order is: ANALYSIS, WAR, game buttons
  const anchorNode = contextBar.firstChild;
  const app = createFragmentApp(() => {
    const id = naturalId.value;
    if (!id) {
      return null;
    }
    const warehouse = warehousesStore.getByEntityNaturalId(id);
    const storageId = storagesStore.getById(warehouse?.storeId)?.id?.substring(0, 8);
    const cmd = storageId ? `INV ${storageId}` : `WAR ${id}`;
    return (
      <ContextControlsItem
        cmd={cmd}
        cmdText={`WAR ${id}`}
        onShiftClick={() => openCompanionBuffer(tile, cmd)}
      />
    );
  });

  if (anchorNode) {
    app.after(anchorNode);
  } else {
    app.prependTo(contextBar);
  }
}

function init() {
  tiles.observe('INV', onTileReady);
}

features.add(import.meta.url, init, 'INV: Adds a WAR context button to base inventories.');
