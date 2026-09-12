import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import PrunButton from '@src/components/PrunButton.vue';

function onTileReady(tile: PrunTile) {
  const warehouse = computed(() => warehousesStore.getByEntityNaturalIdOrName(tile.parameter));
  const warehouseStore = computed(() =>
    storagesStore
      .getByAddressableId(warehouse.value?.warehouseId)
      ?.find(x => x.type === 'WAREHOUSE_STORE'),
  );

  subscribe($$(tile.anchor, C.PlanetaryProjectsList.row), row => {
    const link = _$(row, C.Link.link);
    if (link?.textContent !== L.PlanetaryProjects.WAR()) {
      return;
    }

    createFragmentApp(() => {
      const ws = warehouseStore.value;
      if (!ws) {
        return null;
      }
      return (
        <PrunButton
          dark
          inline
          style={{ marginRight: '4px' }}
          onClick={() => showBuffer(`INV ${ws.id.substring(0, 8)}`)}>
          {L.InventoriesPanel.table.view()}
        </PrunButton>
      );
    }).prependTo(row);
  });
}

function init() {
  tiles.observe('PLI', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'PLI: Adds an "open" button to the warehouse row when the player has a warehouse.',
);
