import classes from './nots-improve-notifications.module.css';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import oneMutation from 'one-mutation';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { alertsStore } from '@src/infrastructure/prun-api/data/alerts';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { getMaterialName } from '@src/infrastructure/prun-ui/i18n';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, PrunCss.AlertListItem.container), processNotification);
}

async function processNotification(container: HTMLElement) {
  const content = await $(container, PrunCss.AlertListItem.content);
  // Don't mess with loading notifications
  const isLoaded = () => !content.textContent?.includes('…');
  if (!isLoaded()) {
    await oneMutation(content, {
      childList: true,
      subtree: true,
      characterData: true,
      filter: isLoaded,
    });
  }

  const id = getPrunId(container);
  const alert = alertsStore.getById(id);
  if (!alert) {
    return;
  }

  const textSpan = content.children[0] as HTMLSpanElement;
  if (!textSpan) {
    return;
  }

  const alertText = textSpan?.textContent;
  if (!alertText) {
    return;
  }

  const patch = patchMap.get(alert.type);
  if (!patch) {
    return;
  }

  createFragmentApp(() => (
    <div class={classes.type} style={{ color: patch.color }}>
      {patch.label}
    </div>
  )).before(textSpan);
  const newText = patch.replace?.(alert, alertText);
  if (newText !== undefined && alertText !== newText) {
    textSpan.textContent = newText;
  }
}

interface AlertPatch {
  types: PrunApi.AlertType[];
  label: string;
  color: string;
  replace?(alert: PrunApi.Alert, text: string): string;
}

const patches: AlertPatch[] = [
  {
    types: [
      'ADMIN_CENTER_MOTION_PASSED',
      'ADMIN_CENTER_MOTION_ENDED',
      'ADMIN_CENTER_MOTION_VOTING_STARTED',
    ],
    label: 'MOTION',
    color: '#ffda94',
  },
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
    label: 'CONTRACT',
    color: '#f7a600',
    replace(alert: PrunApi.Alert, text: string) {
      return text.replace(/Your partner /, '');
    },
  },
  {
    types: ['COMEX_ORDER_FILLED', 'FOREX_ORDER_FILLED'],
    label: 'ORDER',
    color: '#cc2929',
    replace(alert: PrunApi.Alert, text: string) {
      text = text.replace(/ Commodity Exchange/, '').replace(/ order/, '');
      const name = alert.data.find(x => x.key === 'commodity')?.value as string;
      const material = materialsStore.getByName(name);
      const localizedName = getMaterialName(material);
      if (material && localizedName) {
        text = text.replace(localizedName, material.ticker);
      }
      return text;
    },
  },
  {
    types: ['COMEX_TRADE', 'FOREX_TRADE'],
    label: 'TRADE',
    color: '#008000',
    replace(alert: PrunApi.Alert, text: string) {
      text = text
        .replace(/ Commodity Exchange/, '')
        .replace('your ', '')
        .replace(' order', '');
      const name = alert.data.find(x => x.key === 'commodity')?.value as string;
      const material = materialsStore.getByName(name);
      const localizedName = getMaterialName(material);
      if (material && localizedName) {
        text = text.replace(localizedName, material.ticker);
      }
      return text;
    },
  },
  {
    types: ['PRODUCTION_ORDER_FINISHED'],
    label: 'PRODUCED',
    color: '#3fa2de',
    replace(alert: PrunApi.Alert, text: string) {
      text = text
        .replace(/at your base /, '')
        .replace(/One /, '1 ')
        .replace(/ have been/, '')
        .replace(/ units? of /, '')
        .replace(/ produced/, '');
      const name = alert.data.find(x => x.key === 'material')?.value as string;
      const material = materialsStore.getByName(name);
      const localizedName = getMaterialName(material);
      if (material && localizedName) {
        text = text.replace(localizedName, material.ticker);
      }
      return text;
    },
  },
  {
    types: ['SITE_EXPERT_DROPPED'],
    label: 'EXPERT',
    color: '#ff8a00',
  },
  {
    types: ['COGC_PROGRAM_CHANGED', 'COGC_UPKEEP_STARTED', 'COGC_STATUS_CHANGED'],
    label: 'COGC',
    color: '#8f52cc',
    replace(alert: PrunApi.Alert, text: string) {
      return text
        .replace(/Chamber of Global Commerce/, 'COGC')
        .replace(/ a new economic program/, '')
        .replace(/ Advertising Campaign:/, '');
    },
  },
  {
    types: ['SHIP_FLIGHT_ENDED'],
    label: 'ARRIVAL',
    color: '#b336b3',
    replace(alert: PrunApi.Alert, text: string) {
      text = text.replace(/its destination /, '');
      const registration = alert.data.find(x => x.key === 'registration')?.value as string;
      const ship = shipsStore.getByRegistration(registration);
      if (ship?.name) {
        text = text.replace(registration, ship.name);
      }
      return text;
    },
  },
  {
    types: ['POPULATION_REPORT_AVAILABLE'],
    label: 'REPORT',
    color: '#00aa77',
  },
  {
    types: ['LOCAL_MARKET_AD_ACCEPTED', 'LOCAL_MARKET_AD_EXPIRED'],
    label: 'ADVERT',
    color: '#449c57',
    replace(alert: PrunApi.Alert, text: string) {
      return text.replace(/ the/, '').replace(/ local market/, '');
    },
  },
  {
    types: ['POPULATION_PROJECT_UPGRADED'],
    label: 'POPI',
    color: '#8f52cc',
    replace(alert: PrunApi.Alert, text: string) {
      return text.replace(/population infrastructure/, 'POPI');
    },
  },
  {
    types: [
      'ADMIN_CENTER_RUN_SUCCEEDED',
      'ADMIN_CENTER_GOVERNOR_ELECTED',
      'ADMIN_CENTER_NO_GOVERNOR_ELECTED',
      'ADMIN_CENTER_ELECTION_STARTED',
    ],
    label: 'ELECTION',
    color: '#ffda94',
  },
  {
    types: ['WORKFORCE_LOW_SUPPLIES', 'WORKFORCE_OUT_OF_SUPPLIES', 'WORKFORCE_UNSATISFIED'],
    label: 'SUPPLIES',
    color: '#b37b32',
  },
  {
    types: [
      'CORPORATION_MANAGER_INVITE_ACCEPTED',
      'CORPORATION_MANAGER_INVITE_REJECTED',
      'CORPORATION_SHAREHOLDER_DIVIDEND_RECEIVED',
      'CORPORATION_SHAREHOLDER_INVITE_RECEIVED',
      'CORPORATION_MANAGER_SHAREHOLDER_LEFT',
      'CORPORATION_PROJECT_FINISHED',
    ],
    label: 'CORP',
    color: '#8f52cc',
  },
  {
    types: ['PLANETARY_PROJECT_FINISHED'],
    label: 'INFRA',
    color: '#8f52cc',
  },
  {
    types: ['SHIPYARD_PROJECT_FINISHED'],
    label: 'SHIP',
    color: '#8f52cc',
  },
  {
    types: ['WAREHOUSE_STORE_LOCKED_INSUFFICIENT_FUNDS', 'WAREHOUSE_STORE_UNLOCKED'],
    label: 'WAR',
    color: '#cc2929',
  },
  {
    types: ['TUTORIAL_TASK_FINISHED'],
    label: 'HELLO',
    color: '#8f52cc',
  },
];

const patchMap = new Map(patches.flatMap(x => x.types.map(y => [y, x])));

function init() {
  tiles.observe('NOTS', onTileReady);
}

features.add({
  id: 'nots-improve-notifications',
  description: 'NOTS: Adds a colored label to notifications and shortens the notification text.',
  init,
});
