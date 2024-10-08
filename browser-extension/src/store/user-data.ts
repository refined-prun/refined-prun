import { reactive, shallowReactive, watch } from 'vue';
import { deepFreeze } from '@src/utils/deep-freeze';

export const initialUserData = deepFreeze({
  version: 1,
  first: true,
  tileState: {} as Record<string, UserData.TileState | undefined>,
  settings: {
    currency: '₳',
    pricing: {
      exchange: 'UNIVERSE',
      method: 'BALANCED' as UserData.PricingMethod,
    },
    burn: {
      red: 3,
      yellow: 7,
      resupply: 16,
    },
    repair: {
      threshold: 60,
      offset: 10,
    },
    sidebar: [
      ['BS', 'BS'],
      ['CONT', 'CONTS'],
      ['COM', 'COM'],
      ['CORP', 'CORP'],
      ['CXL', 'CXL'],
      ['FIN', 'FIN'],
      ['FLT', 'FLT'],
      ['INV', 'INV'],
      ['MAP', 'MU'],
      ['PROD', 'PROD'],
      ['LEAD', 'LEAD'],
      ['CMDS', 'CMDS'],
      ['SET', 'XIT SETTINGS'],
      ['HELP', 'XIT HELP'],
    ],
  },
  sorting: [] as UserData.SortingMode[],
  balanceHistory: {
    v1: [],
    v2: [],
    v3: [],
  } as UserData.BalanceHistory,
});

export const userData = reactive({} as typeof initialUserData);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applyUserData(newData: any) {
  const clone = structuredClone(newData);
  clone.balanceHistory = {
    v1: shallowReactive(clone.balanceHistory?.v1 ?? []),
    v2: shallowReactive(clone.balanceHistory?.v2 ?? []),
    v3: shallowReactive(clone.balanceHistory?.v3 ?? []),
  };
  Object.assign(userData, clone);
  userData.settings.pricing.method = 'DEFAULT';
}

export function resetAllData() {
  applyUserData(initialUserData);
}

resetAllData();

export function applyPmmgUserData(pmmg: UserData.PmmgSettings) {
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

export function clearBalanceHistory() {
  userData.balanceHistory = reactive({
    v1: shallowReactive([]),
    v2: shallowReactive([]),
    v3: shallowReactive([]),
  });
}

export function watchUserData(save: () => void) {
  let saveQueued = false;

  watch(
    userData,
    () => {
      if (__DEV__) {
        console.log(userData);
      }
      if (!saveQueued) {
        setTimeout(() => {
          save();
          saveQueued = false;
        }, 1000);
        saveQueued = true;
      }
    },
    { deep: true },
  );
}
