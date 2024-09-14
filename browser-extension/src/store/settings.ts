import { reactive, watch } from 'vue';
import system from '@src/system';
import { deepToRaw } from '@src/utils/deep-to-raw';
import { deepFreeze } from '@src/utils/deep-freeze';

const defaultSettings = deepFreeze({
  tileState: {} as Record<string, BaseTileState | undefined>,
  burn: {
    red: 3,
    yellow: 7,
    resupply: 16,
  },
  fin: {
    currency: '₳',
  },
  pricing: {
    exchange: 'UNIVERSE',
    method: 'VWAP7D' as PricingMethod,
  },
  repairThreshold: 60,
  repairOffset: 10,
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
  sorting: [] as SortingMode[],
});

export const settings = reactive(structuredClone(defaultSettings));

export interface SortingMode {
  label: string;
  storeId: string;
  categories: SortingModeCategory[];
  burn: boolean;
  zero: boolean;
}

export interface SortingModeCategory {
  name: string;
  materials: string[];
}

type PricingMethod = 'ASK' | 'BID' | 'AVG' | 'VWAP7D' | 'VWAP30D' | string;

export function resetSidebar() {
  settings.sidebar = [...defaultSettings.sidebar].map(x => [...x]);
}

export function resetSettings() {
  Object.assign(settings, structuredClone(defaultSettings));
}

const key = 'rp-settings';

export async function loadSettings() {
  const savedSettings = await system.storage.local.get(key);
  if (savedSettings[key]) {
    Object.assign(settings, savedSettings[key]);
  }
  let saveQueued = false;

  watch(
    settings,
    () => {
      if (__DEV__) {
        console.log(settings);
      }
      if (!saveQueued) {
        setTimeout(() => {
          void system.storage.local.set({
            [key]: deepToRaw(settings),
          });
          saveQueued = false;
        }, 1000);
        saveQueued = true;
      }
    },
    { deep: true },
  );
}
