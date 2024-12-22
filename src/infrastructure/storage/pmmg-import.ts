import { uploadJson } from '@src/utils/json-file';
import { userData } from '@src/store/user-data';
import { createId } from '@src/store/create-id';
import { isDefined } from 'ts-extras';

interface PmmgSettings {
  currency: UserData.CurrencyPreset;
  burn: {
    red: number;
    yellow: number;
    resupply: number;
  };
  repair: {
    threshold: number;
    offset: number;
  };
  sidebar?: [string, string][];
  sorting?: UserData.SortingMode[];
  disabled: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parsePmmgUserData(pmmg: any): PmmgSettings | undefined {
  if (!pmmg.loaded_before) {
    return undefined;
  }

  const currency = getCurrency(pmmg.backup_pricing_scheme ?? 'AI1 ASK');

  const red = Number(pmmg.burn_thresholds?.[0] ?? 3);
  const yellow = Number(pmmg.burn_thresholds?.[1] ?? 7);
  const resupply = yellow + Number(pmmg.burn_green_buffer ?? 0);

  const threshold = Number(pmmg.repair_threshold ?? 70);
  const offset = Number(pmmg.repair_offset ?? 0);

  return {
    currency,
    burn: {
      red,
      yellow,
      resupply,
    },
    repair: {
      threshold,
      offset,
    },
    sidebar: pmmg.sidebar,
    sorting: pmmg.sorting?.map(parseSortingMode),
    disabled: (pmmg.disabled ?? []).flatMap(mapPmmgFeature).filter(isDefined),
  };
}

function getCurrency(pricingMethod: string): UserData.CurrencyPreset {
  if (pricingMethod.startsWith('IC')) {
    return 'ICA';
  }
  if (pricingMethod.startsWith('NC')) {
    return 'NCC';
  }
  if (pricingMethod.startsWith('CI')) {
    return 'CIS';
  }
  return 'AIC';
}

function parseSortingMode(mode: PmmgSortingMode): UserData.SortingMode {
  return {
    label: mode[0],
    storeId: mode[1],
    categories: mode[2].map(x => ({ name: x[0], materials: x[1] })),
    burn: mode[3],
    zero: mode[4],
  };
}

type PmmgSortingMode = [
  label: string,
  storeId: string,
  categories: [name: string, materials: string[]][],
  burn: boolean,
  zero: boolean,
];

export function importPmmgSettings() {
  uploadJson(json => {
    if (!json) {
      return;
    }
    const pmmg = parsePmmgUserData(json);
    if (pmmg) {
      userData.settings.currency.preset = pmmg.currency;
      userData.settings.burn.red = pmmg.burn.red;
      userData.settings.burn.yellow = pmmg.burn.yellow;
      userData.settings.burn.resupply = pmmg.burn.resupply;
      userData.settings.repair.threshold = pmmg.repair.threshold;
      userData.settings.repair.offset = pmmg.repair.offset;
      if (pmmg.sidebar) {
        userData.settings.sidebar = pmmg.sidebar;
      }
      if (pmmg.sorting) {
        userData.sorting = pmmg.sorting;
      }
      userData.settings.disabled = pmmg.disabled;
    }
  });
}

export function importPmmgFinancialHistory() {
  uploadJson(json => {
    if (!json?.History) {
      return undefined;
    }

    userData.balanceHistory = {
      v1: shallowReactive(json.History.map(item => mapBalanceEntry(item).map(Math.round))),
      v2: shallowReactive([]),
    };
  });
}

export function importPmmgNotes() {
  uploadJson(json => {
    if (!json) {
      return;
    }
    const pmmg = json['PMMG-Notes'];
    if (pmmg) {
      userData.notes = Object.keys(pmmg).map(x => ({
        id: createId(),
        name: x,
        text: pmmg[x],
      }));
    }
  });
}

function mapBalanceEntry(
  entry: [
    timestamp: number,
    nonCurrent: number,
    current: number,
    liquid: number,
    liabilities: number,
  ],
) {
  return [entry[0], entry[2] + entry[3], entry[1], entry[4]];
}

export function importPmmgActions() {
  uploadJson(json => {
    if (!json) {
      return;
    }
    const pmmg = json['PMMG-Action'] as Record<string, UserData.ActionPackageData>;
    if (pmmg) {
      userData.actionPackages = Object.values(pmmg);
    }
  });
}

function mapPmmgFeature(feature: string) {
  switch (feature) {
    case 'CXOBHighlighter':
      return ['highlight-own-exchange-orders'];
    case 'CXPOOrderBook':
      return ['cxpo-order-book'];
    case 'ChatDeleteButton':
      // RPrUn equivalent is align-chat-delete-button which works better.
      return undefined;
    case 'CommandCorrecter':
      return ['correct-commands'];
    case 'CompactUI':
      // Map only features that conform to 'CompactUI' definition.
      return [
        'bbl-collapsible-categories',
        'bbl-hide-book-value',
        'bs-hide-zero-workforce',
        'bs-merge-area-stats',
        'cxos-hide-exchange',
      ];
    case 'FleetETAs':
      return ['flt-arrival-eta'];
    case 'FlightETAs':
      return ['sfc-flight-eta'];
    case 'FormulaReplacer':
      return ['input-math'];
    case 'HeaderMinimizer':
      return ['minimize-headers'];
    case 'IconMarkers':
      return ['item-markers'];
    case 'ImageCreator':
      return ['chat-images'];
    case 'InventoryOrganizer':
      return ['custom-item-sorting'];
    case 'InventorySearch':
      return ['inv-search'];
    case 'Notifications':
      return [
        'nots-material-ticker',
        'nots-notification-type-label',
        'nots-ship-name',
        'nots-clean-notifications',
      ];
    case 'OrderETAs':
      return ['prod-order-eta'];
    case 'PendingContracts':
      return ['sidebar-contracts-details'];
    case 'PostLM':
      return ['shipping-per-unit-price'];
    case 'ProdBurnLink':
      return ['prod-burn-link'];
    case 'QueueLoad':
      return ['prodq-queue-load'];
    case 'ScreenUnpack':
      return ['screen-tab-bar'];
    case 'Sidebar':
      return ['custom-left-sidebar'];
    case 'TopRightButtons':
      return ['header-calculator-button', 'header-duplicate-button'];
    default:
      return undefined;
  }
}
