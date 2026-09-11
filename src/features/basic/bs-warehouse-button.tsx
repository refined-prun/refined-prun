import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import PrunButton from '@src/components/PrunButton.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { increaseDefaultBufferSize } from '@src/infrastructure/prun-ui/buffer-sizes';
import { openCompanionBuffer } from '@src/infrastructure/prun-ui/companion-buffer';

function onTileReady(tile: PrunTile) {
  if (!tile.parameter) {
    return;
  }

  const onClick = (e: MouseEvent) => {
    const warehouse = warehousesStore.getByEntityNaturalId(tile.parameter);
    const storageId = storagesStore.getById(warehouse?.storeId)?.id?.substring(0, 8);
    const cmd = storageId ? `INV ${storageId}` : `WAR ${tile.parameter}`;
    if (e.shiftKey) {
      void openCompanionBuffer(tile, cmd);
    } else {
      void showBuffer(cmd);
    }
  };

  subscribe($$(tile.anchor, C.ActionBar.container), container => {
    createFragmentApp(() => (
      <div class={C.ActionBar.element}>
        <PrunButton primary onClick={onClick}>
          WAREHOUSE
        </PrunButton>
      </div>
    )).appendTo(container);
  });
}

function init() {
  tiles.observe('BS', onTileReady);
  increaseDefaultBufferSize('BS', { width: 90 });
}

features.add(import.meta.url, init, 'BS: Adds a "Warehouse" button.');
