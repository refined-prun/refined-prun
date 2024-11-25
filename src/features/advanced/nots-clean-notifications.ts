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
  if (!alert) {
    return;
  }

  const patch = patchMap.get(alert.type);
  if (!patch) {
    return;
  }

  const textSpan = _$$(content, 'span')[0];
  const alertText = textSpan?.textContent;
  if (!alertText) {
    return;
  }

  const newText = patch.replace(alert, alertText);
  if (newText !== undefined && alertText !== newText) {
    textSpan.textContent = newText;
  }
}

interface AlertPatch {
  types: PrunApi.AlertType[];

  replace(alert: PrunApi.Alert, text: string): string;
}

const patches: AlertPatch[] = [
  {
    types: [
      'CONTRACT_CONDITION_FULFILLED',
      'CONTRACT_CONTRACT_BREACHED',
      'CONTRACT_CONTRACT_RECEIVED',
      'CONTRACT_CONTRACT_CLOSED',
      'CONTRACT_CONTRACT_EXTENDED',
      'CONTRACT_CONTRACT_TERMINATED',
      'CONTRACT_CONTRACT_TERMINATION_REQUESTED',
      'CONTRACT_CONTRACT_CANCELLED',
      'CONTRACT_DEADLINE_EXCEEDED_WITHOUT_CONTROL',
      'CONTRACT_DEADLINE_EXCEEDED_WITH_CONTROL',
      'CONTRACT_CONTRACT_REJECTED',
    ],
    replace(alert: PrunApi.Alert, text: string) {
      return text.replace('Your partner ', '');
    },
  },
  {
    types: ['COMEX_ORDER_FILLED', 'FOREX_ORDER_FILLED'],
    replace(alert: PrunApi.Alert, text: string) {
      return text.replace(' Commodity Exchange', '').replace(' order', '');
    },
  },
  {
    types: ['COMEX_TRADE', 'FOREX_TRADE'],
    replace(alert: PrunApi.Alert, text: string) {
      return text.replace(' Commodity Exchange', '').replace(' your', '').replace(' order', '');
    },
  },
  {
    types: ['PRODUCTION_ORDER_FINISHED'],
    replace(alert: PrunApi.Alert, text: string) {
      return text
        .replace(' at your base', '')
        .replace('One', '1')
        .replace(' have been', '')
        .replace(/ units? of/, '')
        .replace(' produced', '');
    },
  },
  {
    types: ['COGC_PROGRAM_CHANGED', 'COGC_UPKEEP_STARTED', 'COGC_STATUS_CHANGED'],
    replace(alert: PrunApi.Alert, text: string) {
      return text
        .replace('Chamber of Global Commerce', 'COGC')
        .replace(' a new economic program', '')
        .replace(' Advertising Campaign:', '');
    },
  },
  {
    types: ['SHIP_FLIGHT_ENDED'],
    replace(alert: PrunApi.Alert, text: string) {
      return text.replace(' its destination', '');
    },
  },
  {
    types: ['LOCAL_MARKET_AD_ACCEPTED', 'LOCAL_MARKET_AD_EXPIRED'],
    replace(alert: PrunApi.Alert, text: string) {
      return text.replace(' the', '').replace(' local market', '');
    },
  },
  {
    types: ['POPULATION_PROJECT_UPGRADED'],
    replace(alert: PrunApi.Alert, text: string) {
      return text.replace('population infrastructure', 'POPI');
    },
  },
];

const patchMap = new Map(patches.flatMap(x => x.types.map(y => [y, x])));

function init() {
  tiles.observe('NOTS', onTileReady);
}

features.add(import.meta.url, init, 'NOTS: Hides redundant information from notifications.');
