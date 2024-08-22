import { reactive, watch } from 'vue';
import system from '@src/system';

export const settings = reactive({
  burn: {
    red: 3,
    yellow: 7,
    resupply: 16,
    buffers: {},
  },
  repairThreshold: 60,
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
});

const key = 'rprun-settings';

export async function loadSettings() {
  const savedSettings = await system.storage.local.get(key);
  if (savedSettings[key]) {
    Object.assign(settings, savedSettings[key]);
  }
  let saveQueued = false;

  watch(
    settings,
    () => {
      if (!saveQueued) {
        queueMicrotask(() => {
          void system.storage.local.set({
            [key]: settings,
          });
          saveQueued = false;
        });
        saveQueued = true;
      }
    },
    { deep: true },
  );
}
