import classes from './nots-improve-notifications.module.css';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import features from '@src/feature-registry';
import tiles from '@src/infrastructure/prun-ui/tiles';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import oneMutation from 'one-mutation';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { alertsStore } from '@src/infrastructure/prun-api/data/alerts';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { getMaterialName } from '@src/infrastructure/prun-ui/i18n';
import { $, $$ } from '@src/utils/select-dom';
import { subscribe } from '@src/utils/subscribe-async-generator';

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
  if (patch) {
    createFragmentApp(() => (
      <div class={classes.type} style={{ color: patch.color }}>
        {patch.label}
      </div>
    )).before(textSpan);
    const newText = patch.replace?.(alert, alertText);
    if (newText !== undefined && alertText !== newText) {
      textSpan.textContent = newText;
    }
    return;
  }

  for (const search of searchers) {
    const match = alertText.toLowerCase().match(new RegExp(search[0]));
    if (match == null) {
      continue;
    }

    createFragmentApp(() => (
      <div class={classes.type} style={{ color: search[2] }}>
        {search[1].toUpperCase()}
      </div>
    )).before(textSpan);
    if (search[0] === 'contract') {
      textSpan.textContent = alertText.replace(/Your partner /, '');
    }
    break;
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
    types: ['ADMIN_CENTER_MOTION_PASSED'],
    label: 'MOTION',
    color: '#ffda94',
  },
  {
    types: [
      'CONTRACT_CONDITION_FULFILLED',
      'CONTRACT_CONTRACT_RECEIVED',
      'CONTRACT_CONTRACT_CLOSED',
      'CONTRACT_CONTRACT_TERMINATED',
      'CONTRACT_CONTRACT_TERMINATION_REQUESTED',
      'CONTRACT_CONTRACT_CANCELLED',
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
    types: ['COGC_PROGRAM_CHANGED', 'COGC_UPKEEP_STARTED'],
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
    types: ['ADMIN_CENTER_ELECTION_STARTED'],
    label: 'ELECTION',
    color: '#ffda94',
  },
  {
    types: ['ADMIN_CENTER_GOVERNOR_ELECTED'],
    label: 'GOV',
    color: '#ffda94',
  },
  {
    types: ['WORKFORCE_LOW_SUPPLIES'],
    label: 'SUPPLIES',
    color: '#b37b32',
  },
];

const patchMap = new Map(patches.flatMap(x => x.types.map(y => [y, x])));

function init() {
  tiles.observe('NOTS', onTileReady);
}

void features.add({
  id: 'nots-improve-notifications',
  init,
});

// Words to search for, their types, and colors courtesy of Ray K
// Searches must be lower case
const searchers = [
  // German searchers
  ['antrag', 'antrag', '#ffda94'],
  ['vertrag', 'vertrag', 'rgb(247, 166, 0)'],
  ['vertragskondition erfüllt', 'vertrag', 'rgb(247, 166, 0)'],
  ['einladung', 'konzern', '#8f52cc'],
  ['kandidatur', 'parlament', '#ffda94'],
  ['rules', 'rules', '#ffda94'], // Missing
  ['warehous', 'war', '#cc2929'], // Missing
  ['shipbuilding project', 'ship', '#8f52cc'], // Missing
  ['planetary project', 'infra', '#8f52cc'], // Missing

  // English searchers
  ['motion', 'motion', '#ffda94'],
  ['contract', 'contract', 'rgb(247, 166, 0)'],
  ['our corporation', 'corp', '#8f52cc'],
  ['accepted our invitation', 'corp', '#8f52cc'],
  ['received an invitation', 'corp', '#8f52cc'],
  ['your run', 'parliment', '#ffda94'],
  ['rules', 'rules', '#ffda94'],
  ['apex', 'update', '#00aa77'],
  ['warehous', 'war', '#cc2929'],
  ['shipbuilding project', 'ship', '#8f52cc'],
  ['planetary project', 'infra', '#8f52cc'],
];
