import { downloadJson, uploadJson } from '@src/utils/download-json';
import { userData } from '@src/store/user-data';
import { shallowReactive } from 'vue';

const fileType = 'rp-balance';

export function importFinancialHistory() {
  uploadJson(json => {
    if (json?.type !== fileType) {
      return;
    }
    userData.balanceHistory = {
      v1: shallowReactive(json.data.v1 ?? []),
      v2: shallowReactive(json.data.v2 ?? []),
      v3: shallowReactive(json.data.v3 ?? []),
    };
  });
}

export function exportFinancialHistory() {
  const json = {
    type: fileType,
    data: userData.balanceHistory,
  };
  downloadJson(json, `${fileType}-${Date.now()}.json`);
}
