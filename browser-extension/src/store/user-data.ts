import { reactive, shallowReactive, watch } from 'vue';
import system from '@src/system';
import { deepToRaw } from '@src/utils/deep-to-raw';
import { deepFreeze } from '@src/utils/deep-freeze';

const initial = deepFreeze({
  tileState: {} as Record<string, UserData.TileState | undefined>,
  settings: {
    currency: '₳',
    pricing: {
      exchange: 'UNIVERSE',
      method: 'VWAP7D' as UserData.PricingMethod,
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
      ['MAP', 'MAP'],
      ['PROD', 'PROD'],
      ['LEAD', 'LEAD'],
      ['CMDS', 'CMDS'],
      ['SET', 'XIT SETTINGS'],
      ['HELP', 'XIT HELP'],
    ],
  },
  sortingModes: [] as UserData.SortingMode[],
  balanceHistory: {
    v1: [],
    v2: [],
  } as UserData.BalanceHistory,
});

export const userData = reactive(structuredClone(initial));

export function clearBalanceHistory() {
  userData.balanceHistory = reactive({
    v1: shallowReactive([]),
    v2: shallowReactive([]),
  });
}

// This will make balance history shallow reactive instead of reactive.
clearBalanceHistory();

export function deleteBalanceHistoryDataPoint(index: number) {
  if (index < userData.balanceHistory.v1.length) {
    userData.balanceHistory.v1.splice(index, 1);
  } else {
    userData.balanceHistory.v2.splice(index - userData.balanceHistory.v1.length, 1);
  }
}

export function resetSidebar() {
  userData.settings.sidebar = [...initial.settings.sidebar].map(x => [...x]);
}

export function resetAllData() {
  Object.assign(userData, structuredClone(initial));
}

const key = 'rp-user-data';

export async function loadUserData() {
  const saved = await system.storage.local.get(key);
  if (saved[key]) {
    Object.assign(userData, saved[key]);
  }
  let saveQueued = false;

  watch(
    userData,
    () => {
      if (__DEV__) {
        console.log(userData);
      }
      if (!saveQueued) {
        setTimeout(() => {
          void system.storage.local.set({
            [key]: deepToRaw(userData),
          });
          saveQueued = false;
        }, 1000);
        saveQueued = true;
      }
    },
    { deep: true },
  );
}
