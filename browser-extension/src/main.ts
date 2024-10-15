import { sleep } from './util';
import { appendStyle, RPrunStylesheet } from './Style';
import features from '@src/feature-registry';
import { initializePrunApi, loadGameData } from '@src/infrastructure/prun-api';
import PrunCss, { parsePrunCss } from '@src/infrastructure/prun-ui/prun-css';

import './refined-prun.css';
import { fetchPrices } from '@src/infrastructure/fio/cx';
import { loadRefinedPrunCss } from '@src/infrastructure/prun-ui/refined-prun-css';
import { trackBalanceHistory } from '@src/store/user-data-balance';
import { initializeTileListener } from '@src/store/user-data-tiles';
import { loadUserData } from '@src/infrastructure/storage/user-data-serializer';
import { userData } from '@src/store/user-data';
import { readPrunI18N } from '@src/infrastructure/prun-ui/i18n';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import oneMutation from 'one-mutation';
import system from '@src/system';
import { $ } from '@src/utils/select-dom';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { watchWhile } from '@src/utils/watch';

async function mainRun() {
  void fetchPrices();
  initializePrunApi();
  await injectConnector();
  const backgroundTasks = Promise.allSettled([loadGameData()]);
  await loadUserData();
  initializeTileListener();
  await parsePrunCss();
  await loadRefinedPrunCss();
  await $(document.documentElement, PrunCss.App.container);
  await readPrunI18N(materialsStore.all);
  await backgroundTasks;
  await watchWhile(() => companyStore.value === undefined);

  // TODO
  if (companyStore.value?.code === 'SN') {
    appendStyle(RPrunStylesheet.icons);
  } else {
    appendStyle(RPrunStylesheet.enhancedColors);
  }

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
  connector.src = system.runtime.getURL('prun-connector.js');
  document.head.appendChild(connector);
}

void mainRun();
