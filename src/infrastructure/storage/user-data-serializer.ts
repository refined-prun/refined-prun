import { downloadJson, uploadJson } from '@src/utils/download-json';
import { migrateUserData } from '@src/infrastructure/storage/user-data-migrations';
import { applyUserData, userData, watchUserData } from '@src/store/user-data';
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
  uploadJson(json => {
    if (json?.type !== fileType) {
      return;
    }
    const userData = migrateUserData(json.data);
    applyUserData(userData);
  });
}

export function exportUserData() {
  const json = {
    type: fileType,
    data: userData,
  };
  downloadJson(json, `${fileType}-${Date.now()}.json`);
}
