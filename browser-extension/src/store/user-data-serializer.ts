import { downloadJson, uploadJson } from '@src/utils/download-json';

const balanceHistoryType = 'rp-balance';

export function saveBalanceHistory(balanceHistory: UserData.BalanceHistory) {
  const json = {
    type: balanceHistoryType,
    data: balanceHistory,
  };
  downloadJson(json, `rp-balance-${Date.now()}.json`);
}

export function loadBalanceHistory(callback: (balanceHistory: UserData.BalanceHistory) => void) {
  uploadJson(json => {
    const balanceHistory = parseBalanceHistory(json);
    if (balanceHistory) {
      callback(balanceHistory);
    }
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseBalanceHistory(json: any) {
  if (!json) {
    return undefined;
  }

  if (json.type === balanceHistoryType) {
    return json.data as UserData.BalanceHistory;
  }

  // Try parsing PMMG fin format
  if (json.History) {
    return {
      v1: json.History.map((item: number[]) => item.map(Math.round)),
      v2: [],
    };
  }

  return undefined;
}
