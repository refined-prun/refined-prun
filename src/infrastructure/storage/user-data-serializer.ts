import { downloadJson, uploadJson } from '@src/utils/download-json';
import { migrateUserData } from '@src/store/user-data-migrations';
import { applyInitialUserData, applyUserData, userData, watchUserData } from '@src/store/user-data';
import { deepToRaw } from '@src/utils/deep-to-raw';

const fileType = 'rp-user-data';

export async function loadUserData() {
  const saved = await chrome.storage.local.get(fileType);
  if (saved[fileType]) {
    const userData = migrateUserData(saved[fileType]);
    applyUserData(userData);
  } else {
    migrateUserData(userData);
  }
  watchUserData(saveUserData);
}

export async function saveUserData() {
  await chrome.storage.local.set({
    [fileType]: deepToRaw(userData),
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

export function resetUserData() {
  applyInitialUserData();
  migrateUserData(userData);
}
