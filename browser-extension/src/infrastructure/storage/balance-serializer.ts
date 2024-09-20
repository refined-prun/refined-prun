import { downloadJson, uploadJson } from '@src/utils/download-json';
import { userData } from '@src/store/user-data';
import { shallowReactive } from 'vue';

const fileType = 'rp-balance';

export function importFinancialHistory() {
  uploadJson(json => {
    const balanceHistory = parseBalanceHistory(json);
    if (balanceHistory) {
      userData.balanceHistory = {
        v1: shallowReactive(balanceHistory.v1),
        v2: shallowReactive(balanceHistory.v2),
      };
    }
  });
}

export function exportFinancialHistory() {
  const json = {
    type: fileType,
    data: userData.balanceHistory,
  };
  downloadJson(json, `${fileType}-${Date.now()}.json`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseBalanceHistory(json: any) {
  if (!json) {
    return undefined;
  }

  if (json.type === fileType) {
    return json.data as UserData.BalanceHistory;
  }

  // Try parsing PMMG fin format
  if (json.History) {
    return {
      v1: json.History.map((item: number[]) => item.map(Math.round)),
      v2: [],
    } as UserData.BalanceHistory;
  }

  return undefined;
}
