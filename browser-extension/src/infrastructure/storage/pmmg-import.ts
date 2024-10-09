import { uploadJson } from '@src/utils/download-json';
import { userData } from '@src/store/user-data';
import { shallowReactive } from 'vue';
import { createId } from '@src/store/create-id';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parsePmmgUserData(pmmg: any): UserData.PmmgSettings | undefined {
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
