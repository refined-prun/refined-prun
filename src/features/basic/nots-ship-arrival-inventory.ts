import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { alertsStore } from '@src/infrastructure/prun-api/data/alerts';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.AlertListItem.container), processNotification);
}

async function processNotification(container: HTMLElement) {
  const id = getPrunId(container);
  const alert = alertsStore.getById(id);
  if (alert?.type !== 'SHIP_FLIGHT_ENDED') {
    return;
  }

  const registration = alert.data.find(x => x.key === 'registration')?.value as string;
  if (!registration) {
    return;
  }
  container.addEventListener('click', e => {
    showBuffer(`SHPI ${registration}`);
    e.preventDefault();
    e.stopPropagation();
  });
}

function init() {
  tiles.observe('NOTS', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'NOTS: Opens ship inventory on "ship arrived" notification click.',
);
