import classes from './nots-notification-type-label.module.css';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { alertsStore } from '@src/infrastructure/prun-api/data/alerts';
import { waitNotificationLoaded } from '@src/infrastructure/prun-ui/notifications';
import { applyScopedCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

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

  const label = labelMap.get(alert.type);
  if (!label) {
    return;
  }

  const textSpan = _$(content, 'span');
  if (!textSpan) {
    return;
  }

  createFragmentApp(() => (
    <div class={classes.label} style={{ color: label.color }}>
      {label.label}
    </div>
  )).before(textSpan);
}

interface NotificationTypeLabel {
  types: PrunApi.AlertType[];
  label: string;
  color: string;
}

const labels: NotificationTypeLabel[] = [
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
  },
  {
    types: ['COMEX_ORDER_FILLED', 'FOREX_ORDER_FILLED'],
    label: 'ORDER',
    color: '#cc2929',
  },
  {
    types: ['COMEX_TRADE', 'FOREX_TRADE'],
    label: 'TRADE',
    color: '#008000',
  },
  {
    types: ['PRODUCTION_ORDER_FINISHED'],
    label: 'PRODUCED',
    color: '#3fa2de',
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
  },
  {
    types: ['SHIP_FLIGHT_ENDED'],
    label: 'ARRIVAL',
    color: '#b336b3',
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
  },
  {
    types: ['POPULATION_PROJECT_UPGRADED'],
    label: 'POPI',
    color: '#8f52cc',
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
  {
    types: ['RELEASE_NOTES'],
    label: 'APEX',
    color: '#8f52cc',
  },
];

const labelMap = new Map(labels.flatMap(x => x.types.map(y => [y, x])));

function init() {
  applyScopedCssRule('NOTS', `.${C.AlertListItem.content}`, classes.content);
  applyScopedCssRule('NOTS', `.${C.AlertListItem.time}`, classes.time);

  tiles.observe('NOTS', onTileReady);
}

features.add(import.meta.url, init, 'NOTS: Adds a colored notification type label.');
