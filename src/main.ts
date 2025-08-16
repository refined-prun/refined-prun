import { initializeApi } from '@src/infrastructure/prun-api';
import { initializeUI } from '@src/infrastructure/prun-ui';
import { initializeUserData } from '@src/store';
import PmmgMigrationGuide from '@src/components/PmmgMigrationGuide.vue';

async function main() {
  await initializeApi();
  await initializeUI();

  if (window['PMMG_COLLECTOR_HAS_RUN']) {
    createFragmentApp(PmmgMigrationGuide).before(await $(document, C.App.container));
    return;
  }

  console.log(`Refined PrUn ${config.version}`);
  initializeUserData();
  features.init();
  xit.init();
}

void main();
