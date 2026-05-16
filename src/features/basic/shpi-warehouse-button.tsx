import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { getLocationLineFromAddress } from '@src/infrastructure/prun-api/data/addresses';

async function onTileReady(tile: PrunTile) {
  const ship = computed(() => shipsStore.getByRegistration(tile.parameter));

  const locationNaturalId = computed(() => {
    if (ship.value?.flightId !== null) {
      return undefined;
    }
    const location = getLocationLineFromAddress(ship.value.address);
    return location?.entity.naturalId;
  });

  const warehouseStore = computed(() => {
    const warehouse = warehousesStore.getByEntityNaturalId(locationNaturalId.value);
    return storagesStore.getById(warehouse?.storeId);
  });

  const contextBar = await $(tile.frame, C.ContextControls.container);

  createFragmentApp(() => {
    const war = warehouseStore.value;
    const id = locationNaturalId.value;
    if (!war || !id) {
      return null;
    }
    return (
      <div
        class={[C.ContextControls.item, C.fonts.fontRegular, C.type.typeSmall]}
        onClick={() => showBuffer(`INV ${war.id.substring(0, 8)}`)}>
        <span>
          <span class={C.ContextControls.cmd}>WAR {id}</span>
        </span>
      </div>
    );
  }).prependTo(contextBar);
}

function init() {
  tiles.observe('SHPI', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'SHPI: Adds a WAR context button when the ship is landed at an address with a warehouse.',
);
