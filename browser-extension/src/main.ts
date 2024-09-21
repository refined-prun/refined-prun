import { getSpecial, sleep } from './util';
import { appendStyle, RPrunStylesheet } from './Style';
import features from '@src/feature-registry';
import { initializePrunApi, loadGameData } from '@src/infrastructure/prun-api';
import PrunCss, { parsePrunCss } from '@src/infrastructure/prun-ui/prun-css';

import './refined-prun.css';
import { fetchPrices } from '@src/infrastructure/fio/cx';
import { loadRefinedPrunCss } from '@src/infrastructure/prun-ui/refined-prun-css';
import descendantPresent from '@src/utils/descendant-present';
import { trackBalanceHistory } from '@src/store/user-data-balance';
import { initializeTileListener } from '@src/store/user-data-tiles';
import { loadUserData } from '@src/infrastructure/storage/user-data-serializer';
import { userData } from '@src/store/user-data';
import { loadNotes } from '@src/infrastructure/storage/notes-serializer';
import { readPrunI18N } from '@src/infrastructure/prun-ui/i18n';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';

async function mainRun() {
  void fetchPrices();
  initializePrunApi();
  const backgroundTasks = Promise.allSettled([loadGameData()]);

  try {
    await loadUserData();
    initializeTileListener();
    await loadNotes();
  } catch (e) {
    console.error('PMMG: Failed to load settings');
    throw e;
  }

  await parsePrunCss();
  await loadRefinedPrunCss();
  await descendantPresent(document.documentElement, PrunCss.App.container);
  await readPrunI18N(materialsStore.all);
  await backgroundTasks;

  const specialTime = getSpecial();

  // TODO
  appendStyle(specialTime ? RPrunStylesheet.oldColors : RPrunStylesheet.enhancedColors);
  //appendStyle(specialTime ? RPrunStylesheet.oldColors : RPrunStylesheet.icons);

  await features.init();

  void trackBalanceHistory();
  if (userData.first) {
    await sleep(1000);
    // TODO: await showBuffer('XIT START');
    userData.first = true;
  }
}

void mainRun();
