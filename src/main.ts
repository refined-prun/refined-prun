import './refined-prun.css';
import { sleep } from './util';
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

async function mainRun() {
  void fetchPrices();
  initializePrunApi();
  await injectConnector();
  const backgroundTasks = Promise.allSettled([loadGameData()]);
  await loadUserData();
  await initializeUI();
  initializeTileListener();
  await backgroundTasks;
  await watchWhile(() => companyStore.value === undefined);

  await features.init();

  void trackBalanceHistory();
  if (userData.first) {
    await sleep(1000);
    // TODO: await showBuffer('XIT START');
    userData.first = true;
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
}

void mainRun();
