import { sleep } from './utils/sleep';
import { initializePrunApi, loadGameData } from '@src/infrastructure/prun-api';
import { fetchPrices } from '@src/infrastructure/fio/cx';
import { trackBalanceHistory } from '@src/store/user-data-balance';
import { initializeTileListener } from '@src/store/user-data-tiles';
import { loadUserData } from '@src/infrastructure/storage/user-data-serializer';
import { userData } from '@src/store/user-data';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { watchWhile } from '@src/utils/watch';
import { initializeUI } from '@src/infrastructure/prun-ui';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { initializeXitCommands } from '@src/features/XIT/xit-commands';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import PmmgMigrationGuide from '@src/components/PmmgMigrationGuide.vue';
import { trackExtensionUpdate } from '@src/infrastructure/shell/extension-update';

async function main() {
  document.documentElement.toggleAttribute('refined-prun');
  trackExtensionUpdate();
  void fetchPrices();
  initializePrunApi();
  const backgroundTasks = loadGameData();
  loadUserData();
  await initializeUI();
  initializeTileListener();
  await backgroundTasks;
  console.log(`Refined PrUn ${config.version}`);
  await watchWhile(() => companyStore.value === undefined);

  if (window['PMMG_COLLECTOR_HAS_RUN']) {
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

void main();
