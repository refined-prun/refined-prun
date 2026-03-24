import { downloadJson, uploadJson } from '@src/utils/json-file';
import { migrateUserData } from '@src/store/user-data-migrations';
import { applyInitialUserData, applyUserData, userData } from '@src/store/user-data';
import { deepToRaw } from '@src/utils/deep-to-raw';
import { backupUserData, getUserDataBackups } from '@src/infrastructure/storage/user-data-backup';
import { userDataStore } from '@src/infrastructure/prun-api/data/user-data';
import dayjs from 'dayjs';

const fileType = 'rp-user-data';

export function loadUserData() {
  let loaded = false;
  let userDataToLoad = config.userData;
  if (!userDataToLoad) {
    const backups = getUserDataBackups();
    if (backups.length > 0) {
      userDataToLoad = backups[0].data;
    }
  }
  if (userDataToLoad) {
    try {
      const userData = migrateUserData(userDataToLoad);
      applyUserData(userData);
      loaded = true;
    } catch (e) {
      console.error('Error loading user data', e);
      loaded = false;
    }
  }
  if (!loaded) {
    migrateUserData(userData);
    disableFullEquityModeForNewUsers();
  }
  watchUserData();
}

function disableFullEquityModeForNewUsers() {
  const age = dayjs.duration(Date.now() - userDataStore.created.timestamp).asDays();
  userData.fullEquityMode = age >= 90;
}

function watchUserData() {
  let saveQueued = false;

  watch(
    userData,
    () => {
      if (import.meta.env.DEV) {
        console.log(userData);
      }
      if (!saveQueued) {
        setTimeout(() => {
          void saveUserData();
          saveQueued = false;
        }, 1000);
        saveQueued = true;
      }
    },
    { deep: true },
  );
}

export async function saveUserData() {
  const data = deepToRaw(userData);
  backupUserData(data);
  await new Promise<void>(resolve => {
    const listener = (e: MessageEvent) => {
      if (e.source !== window) {
        return;
      }
      if (e.data.type === 'rp-user-data-saved') {
        window.removeEventListener('message', listener);
        resolve();
      }
    };
    window.addEventListener('message', listener);
    window.postMessage({ type: 'rp-save-user-data', userData: data }, '*');
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function restoreBackup(backup: any) {
  const userData = migrateUserData(backup);
  applyUserData(userData);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function downloadBackup(backup: any, timestamp: number) {
  const json = {
    type: fileType,
    data: backup,
  };
  downloadJson(json, `${fileType}-${timestamp}.json`);
}

export function importUserData(onSuccess?: () => void) {
  uploadJson(json => {
    if (json?.type !== fileType) {
      return;
    }
    const userData = migrateUserData(json.data);
    applyUserData(userData);
    onSuccess?.();
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
