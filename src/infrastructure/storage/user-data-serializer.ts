import { downloadJson, uploadJson } from '@src/utils/json-file';
import { migrateUserData } from '@src/store/user-data-migrations';
import { applyInitialUserData, applyUserData, userData } from '@src/store/user-data';
import { deepToRaw } from '@src/utils/deep-to-raw';

const fileType = 'rp-user-data';

export function loadUserData() {
  if (config.userData) {
    try {
      const userData = migrateUserData(config.userData);
      applyUserData(userData);
    } catch {
      migrateUserData(userData);
    }
  } else {
    migrateUserData(userData);
  }
  watchUserData();
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
    window.postMessage({ type: 'rp-save-user-data', userData: deepToRaw(userData) }, '*');
  });
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
