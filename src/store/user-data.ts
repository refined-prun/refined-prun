import { deepFreeze } from '@src/utils/deep-freeze';

export const initialUserData = deepFreeze({
  version: 0,
  firstLoad: Date.now(),
  tileState: {} as Record<string, UserData.TileState | undefined>,
  settings: {
    mode: undefined as 'BASIC' | 'FULL' | undefined,
    disabled: [] as string[],
    time: 'DEFAULT' as UserData.TimeFormat,
    defaultChartType: 'SMOOTH' as UserData.ExchangeChartType,
    currency: {
      preset: 'DEFAULT' as UserData.CurrencyPreset,
      custom: '$',
      position: 'BEFORE' as UserData.CurrencyPosition,
      spacing: 'NO_SPACE' as UserData.CurrencySpacing,
    },
    financial: {
      mmMaterials: 'IDC,EDC',
      ignoredMaterials: 'HEX,JUI',
    },
    pricing: {
      exchange: 'UNIVERSE',
      method: 'DEFAULT' as UserData.PricingMethod,
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
      ['CONT', 'XIT CONTS'],
      ['COM', 'COM'],
      ['CORP', 'CORP'],
      ['CXL', 'CXL'],
      ['FIN', 'XIT FIN'],
      ['FLT', 'FLT'],
      ['INV', 'INV'],
      ['MAP', 'MU'],
      ['PROD', 'PROD'],
      ['LEAD', 'LEAD'],
      ['CMDS', 'CMDS'],
      ['ACT', 'XIT ACT'],
      ['BURN', 'XIT BURN'],
      ['REP', 'XIT REP'],
      ['SET', 'XIT SET'],
      ['HELP', 'XIT HELP'],
    ] as [string, string][],
    buffers: [] as [string, number, number][],
  },
  sorting: {} as Record<string, UserData.StoreSortingData>,
  scroll: {} as Record<string, UserData.TileScroll>,
  balanceHistory: {
    v1: [],
    v2: [],
  } as UserData.BalanceHistory,
  notes: [] as UserData.Note[],
  actionPackages: [] as UserData.ActionPackageData[],
  systemMessages: [] as UserData.SystemMessages[],
  todo: [] as UserData.TaskList[],
  tabs: {
    order: [] as string[],
    hidden: [] as string[],
    locked: [] as string[],
  },
  commandLists: [] as UserData.CommandList[],
});

export const userData = reactive({} as typeof initialUserData);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applyUserData(newData: any) {
  newData.balanceHistory.v1 = shallowReactive(newData.balanceHistory.v1);
  newData.balanceHistory.v2 = shallowReactive(newData.balanceHistory.v2);
  Object.assign(userData, newData);
}

export function applyInitialUserData() {
  applyUserData(structuredClone(initialUserData));
}

applyInitialUserData();

export function clearBalanceHistory() {
  userData.balanceHistory.v1.length = 0;
  userData.balanceHistory.v2.length = 0;
}
