import { sleep } from './utils/sleep';
import { initializePrunApi, loadGameData } from '@src/infrastructure/prun-api';
import { fetchPrices } from '@src/infrastructure/fio/cx';
import { trackBalanceHistory } from '@src/store/user-data-balance';
import { initializeTileListener } from '@src/store/user-data-tiles';
import { loadUserData } from '@src/infrastructure/storage/user-data-serializer';
import { userData } from '@src/store/user-data';
import oneMutation from 'one-mutation';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { watchWhile } from '@src/utils/watch';
import { initializeUI } from '@src/infrastructure/prun-ui';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { initializeXitCommands } from '@src/features/XIT/xit-commands';
import { checkPmmgPresent } from '@src/infrastructure/prun-ui/page-functions';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import PmmgMigrationGuide from '@src/components/PmmgMigrationGuide.vue';

async function mainRun() {
  void fetchPrices();
  initializePrunApi();
  await injectConnector();
  const backgroundTasks = Promise.allSettled([loadGameData()]);
  await loadUserData();
  await initializeUI();
  initializeTileListener();
  await backgroundTasks;
  const { version } = chrome.runtime.getManifest();
  console.log(`Refined PrUn ${version}`);
  await watchWhile(() => companyStore.value === undefined);

  if (await checkPmmgPresent()) {
    createFragmentApp(PmmgMigrationGuide).before(_$(document, C.App.container)!);
    return;
  }

  features.init();
  initializeXitCommands();

  void trackBalanceHistory();
  if (userData.settings.mode === undefined) {
    await sleep(1000);
    await showBuffer('XIT START');
  }
}

async function injectConnector() {
  if (!document.head) {
    await oneMutation(document.documentElement, {
      childList: true,
      filter: () => !!document.head,
    });
  }
  const connector = document.createElement('script');
  connector.src = chrome.runtime.getURL('prun-connector.js');
  connector.type = 'module';
  document.head.appendChild(connector);
  await new Promise<void>(resolve => {
    const listener = (e: MessageEvent) => {
      if (e.source === window && e.data === 'prun-connector-ready') {
        resolve();
        window.removeEventListener('message', listener);
      }
    };
    window.addEventListener('message', listener);
  });
}

void mainRun();
