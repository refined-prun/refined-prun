import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
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

  const baseStore = computed(() => {
    const site = sitesStore.getByPlanetNaturalId(locationNaturalId.value);
    return storagesStore.getByAddressableId(site?.siteId)?.[0];
  });

  const contextBar = await $(tile.frame, C.ContextControls.container);

  createFragmentApp(() => {
    const store = baseStore.value;
    const id = locationNaturalId.value;
    if (!store || !id) {
      return null;
    }
    return (
      <div
        class={[C.ContextControls.item, C.fonts.fontRegular, C.type.typeSmall]}
        onClick={() => showBuffer(`INV ${store.id.substring(0, 8)}`)}>
        <span>
          <span class={C.ContextControls.cmd}>INV {id}</span>
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
  'SHPI: Adds an INV context button when the ship is landed at a base.',
);
