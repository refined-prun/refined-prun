import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { alertsStore } from '@src/infrastructure/prun-api/data/alerts';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { getMaterialName } from '@src/infrastructure/prun-ui/i18n';
import { waitNotificationLoaded } from '@src/infrastructure/prun-ui/notifications';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.AlertListItem.container), processNotification);
}

async function processNotification(container: HTMLElement) {
  const content = await waitNotificationLoaded(container);

  const id = getPrunId(container);
  const alert = alertsStore.getById(id);
  if (!alert) {
    return;
  }

  const textSpan = _$$(content, 'span')[0];
  const alertText = textSpan?.textContent;
  if (!alertText) {
    return;
  }

  let name: string | undefined = undefined;
  switch (alert.type) {
    case 'COMEX_ORDER_FILLED':
    case 'FOREX_ORDER_FILLED':
    case 'COMEX_TRADE':
    case 'FOREX_TRADE': {
      name = alert.data.find(x => x.key === 'commodity')?.value as string;
      break;
    }
    case 'PRODUCTION_ORDER_FINISHED': {
      name = alert.data.find(x => x.key === 'material')?.value as string;
      break;
    }
    default: {
      return;
    }
  }

  const material = materialsStore.getByName(name);
  const localizedName = getMaterialName(material);
  if (material && localizedName) {
    textSpan.textContent = alertText.replace(localizedName, material.ticker);
  }
}

function init() {
  tiles.observe('NOTS', onTileReady);
}

features.add(import.meta.url, init, 'NOTS: Replaces material name with material ticker.');
