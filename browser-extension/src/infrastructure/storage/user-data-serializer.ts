import { downloadJson, uploadJson } from '@src/utils/download-json';
import { migrateUserData } from '@src/infrastructure/storage/user-data-migrations';
import { importPmmgUserData } from '@src/infrastructure/storage/pmmg-import';
import { applyPmmgUserData, applyUserData, userData, watchUserData } from '@src/store/user-data';
import system from '@src/system';
import { deepToRaw } from '@src/utils/deep-to-raw';

const fileType = 'rp-user-data';

export async function loadUserData() {
  const saved = await system.storage.local.get(fileType);
  if (saved[fileType]) {
    const userData = migrateUserData(saved[fileType]);
    applyUserData(userData);
  }
  watchUserData(() => {
    void system.storage.local.set({
      [fileType]: deepToRaw(userData),
    });
  });
}

export function importUserData() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  uploadJson((json: any) => {
    if (!json) {
      return;
    }
    if (json.type === fileType) {
      const userData = migrateUserData(json.data);
      applyUserData(userData);
    } else {
      const pmmg = importPmmgUserData(json);
      if (pmmg) {
        applyPmmgUserData(pmmg);
      }
    }
  });
}

export function exportUserData() {
  const json = {
    type: fileType,
    data: userData,
  };
  downloadJson(json, `rp-user-data-${Date.now()}.json`);
}
