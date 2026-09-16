import PrunLink from '@src/components/PrunLink.vue';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { flightsStore } from '@src/infrastructure/prun-api/data/flights';
import { getDestinationInfo } from '@src/core/addresses';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { ElementTag } from '@src/infrastructure/prun-ui/tagger';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import { createContentReplacement } from '@src/utils/content-replacement';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, 'tr'), row => {
    const id = refPrunId(row);
    const ship = computed(() => shipsStore.getByStoreId(id.value));
    const destination = computed(() => flightsStore.getById(ship.value?.flightId)?.destination);
    const destinationInfo = computed(() => getDestinationInfo(destination.value));
    let mounted = false;

    watchEffectWhileNodeAlive(row, () => {
      if (!ship.value || mounted) {
        return;
      }

      mounted = true;
      const container = createContentReplacement(row, () => _$(row, ElementTag.INV_LOCATION_CELL));
      createFragmentApp(() => {
        const info = destinationInfo.value;
        if (!info) {
          return null;
        }
        return (
          <>
            <span>→</span>
            <PrunLink inline command={info.command}>
              {info.name}
            </PrunLink>
          </>
        );
      }).appendTo(container);
    });
  });
}

function init() {
  tiles.observe('INV', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'INV: Shows in-flight ship destinations in the Location column.',
);
