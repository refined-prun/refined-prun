import { uploadJson } from '@src/utils/download-json';
import { userData } from '@src/store/user-data';
import { createId } from '@src/store/create-id';

interface PmmgSettings {
  currency: string;
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
  };
}

function getCurrency(pricingMethod: string) {
  if (pricingMethod.startsWith('IC')) {
    return 'ǂ';
  }
  if (pricingMethod.startsWith('NC')) {
    return '₦';
  }
  if (pricingMethod.startsWith('CI')) {
    return '₡';
  }
  return '₳';
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
      userData.settings.currency = pmmg.currency;
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
    }
  });
}

export function importPmmgFinancialHistory() {
  uploadJson(json => {
    if (!json?.History) {
      return undefined;
    }

    userData.balanceHistory = {
      v1: shallowReactive(json.History.map((item: number[]) => item.map(Math.round))),
      v2: shallowReactive([]),
      v3: shallowReactive([]),
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

interface PmmgActionPackage {
  global: {
    name: string;
  };
  groups: PmmgActionGroup[];
  actions: PmmgAction[];
}

interface PmmgActionGroup {
  type: 'Manual' | 'Resupply' | 'Repair';
  name?: string;
  days?: number | string;
  advanceDays?: number | string;
  planet?: string;
  useBaseInv?: boolean;
  materials?: Record<string, number>;
  exclusions?: string[];
  consumablesOnly?: boolean;
}

interface PmmgAction {
  type: 'CX Buy' | 'MTRA';

  name?: string;
  group?: string;

  buyPartial?: boolean;
  exchange?: string;
  useCXInv?: boolean;
  priceLimits?: Record<string, number>;

  origin?: string;
  dest?: string;
}

export function importPmmgActions() {
  uploadJson(json => {
    if (!json) {
      return;
    }
    const pmmg = json['PMMG-Action'] as Record<string, PmmgActionPackage>;
    if (pmmg) {
      userData.actionPackages = Object.values(pmmg).map(mapPmmgActionPackage);
    }
  });
}

export function mapPmmgActionPackage(pkg?: PmmgActionPackage): UserData.ActionPackageData {
  return {
    id: createId(),
    name: pkg?.global?.name ?? 'ACTION_PACKAGE',
    groups: pkg?.groups?.map(mapPmmgActionGroup) ?? [],
    actions: pkg?.actions?.map(mapPmmgAction) ?? [],
  };
}

function mapPmmgActionGroup(group: PmmgActionGroup): UserData.ActionGroupData {
  return {
    ...group,
    id: createId(),
    type: mapPmmgActionGroupType(group.type),
  };
}

function mapPmmgActionGroupType(pmmgType: string) {
  switch (pmmgType) {
    case 'Resupply':
      return 'RESUPPLY';
    case 'Repair':
      return 'REPAIR';
    default:
      return 'MANUAL';
  }
}

function mapPmmgAction(action: PmmgAction): UserData.ActionData {
  return {
    ...action,
    id: createId(),
    type: mapPmmgActionType(action.type),
  };
}

function mapPmmgActionType(pmmgType: string) {
  switch (pmmgType) {
    case 'CX Buy':
      return 'CX_BUY';
    default:
      return 'MTRA';
  }
}
