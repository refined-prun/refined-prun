import PrunLink from '@src/components/PrunLink.vue';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import { flightsStore } from '@src/infrastructure/prun-api/data/flights';
import {
  getFullAddressName,
  getLocationLineFromAddress,
  getSystemLineFromAddress,
  isStationLine,
} from '@src/infrastructure/prun-api/data/addresses';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { observeDescendantListChanged } from '@src/utils/mutation-observer';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';

const shipStoreTypes = new Set([
  'SHIP_STORE',
  'STL_FUEL_STORE',
  'FTL_FUEL_STORE',
  'VORTEX_FUEL_STORE',
]);

const endedDestinations = shallowReactive<Record<string, PrunApi.Address>>({});

onApiMessage({
  SHIP_FLIGHT_FLIGHT_ENDED(flight: PrunApi.Flight) {
    endedDestinations[flight.shipId] =
      flight.segments[flight.currentSegmentIndex]?.destination ?? flight.destination;
  },
  SHIP_DATA(ship: PrunApi.Ship) {
    delete endedDestinations[ship.id];
  },
});

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, 'tr'), row => {
    const id = refPrunId(row);
    const getLocationCell = () => row.children[1];
    const ship = computed(() => {
      const storage = storagesStore.getById(id.value);
      if (!storage || !shipStoreTypes.has(storage.type)) {
        return undefined;
      }
      return shipsStore.getById(storage.addressableId);
    });
    const destination = computed(() => {
      const currentShip = ship.value;
      return currentShip
        ? (flightsStore.getById(currentShip.flightId)?.destination ??
            endedDestinations[currentShip.id])
        : undefined;
    });
    const destinationInfo = computed(() => getDestinationInfo(destination.value));
    let mounted = false;

    watchEffectWhileNodeAlive(row, () => {
      if (!ship.value || mounted) {
        return;
      }

      mounted = true;
      const container = document.createElement('span');
      observeDescendantListChanged(row, () => {
        const locationCell = getLocationCell();
        if (destinationInfo.value) {
          const textNodes = document.createTreeWalker(locationCell, NodeFilter.SHOW_TEXT);
          while (textNodes.nextNode()) {
            const text = textNodes.currentNode;
            if (!container.contains(text) && text.textContent?.trim() === '--') {
              text.textContent = '';
            }
          }
        }
        if (locationCell.lastChild !== container) {
          locationCell.append(container);
        }
      });
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

function getDestinationInfo(address?: PrunApi.Address) {
  if (!address) {
    return undefined;
  }

  const gateway = address.lines.find(x => x.type === 'GATEWAY')?.entity;
  if (gateway) {
    return {
      name: gateway.name,
      command: `GTW ${gateway.naturalId}`,
    };
  }

  const location = getLocationLineFromAddress(address);
  const name = getFullAddressName(address);
  if (!name) {
    return undefined;
  }

  if (location) {
    return {
      name,
      command: `${isStationLine(location) ? 'STNS' : 'PLI'} ${location.entity.naturalId}`,
    };
  }

  const system = getSystemLineFromAddress(address);
  if (system) {
    return {
      name,
      command: `MS ${system.entity.naturalId}`,
    };
  }

  return undefined;
}

function init() {
  tiles.observe('INV', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'INV: Shows in-flight ship destinations in the Location column.',
);
