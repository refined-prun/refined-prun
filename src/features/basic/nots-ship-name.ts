import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { alertsStore } from '@src/infrastructure/prun-api/data/alerts';
import { waitNotificationLoaded } from '@src/infrastructure/prun-ui/notifications';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.AlertListItem.container), processNotification);
}

async function processNotification(container: HTMLElement) {
  const content = await waitNotificationLoaded(container);

  const id = getPrunId(container);
  const alert = alertsStore.getById(id);
  if (!alert || alert.type !== 'SHIP_FLIGHT_ENDED') {
    return;
  }

  const textSpan = _$$(content, 'span')[0];
  const alertText = textSpan?.textContent;
  if (!alertText) {
    return;
  }

  const registration = alert.data.find(x => x.key === 'registration')?.value as string;
  const ship = shipsStore.getByRegistration(registration);
  if (ship?.name) {
    textSpan.textContent = alertText.replace(registration, ship.name);
  }
}

function init() {
  tiles.observe('NOTS', onTileReady);
}

features.add(import.meta.url, init, 'NOTS: Replaces ship registration with ship name.');
