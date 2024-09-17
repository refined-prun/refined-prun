import { getSpecial } from './util';
import { appendStyle, RPrunStylesheet } from './Style';
import { loadLegacySettings, saveSettings, Settings } from './Settings';
import features from '@src/feature-registry';
import { initializePrunApi, loadGameData } from '@src/infrastructure/prun-api';
import PrunCss, { parsePrunCss } from '@src/infrastructure/prun-ui/prun-css';
import { applyXITParameters } from '@src/features/XIT/xit-commands';

import './refined-prun.css';
import { fetchPrices } from '@src/infrastructure/fio/cx';
import { loadRefinedPrunCss } from '@src/infrastructure/prun-ui/refined-prun-css';
import { loadNotes } from '@src/store/notes';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import descendantPresent from '@src/utils/descendant-present';
import { trackBalanceHistory } from '@src/store/user-data-balance';
import { initializeTileListener } from '@src/store/user-data-tiles';
import { loadUserData } from '@src/infrastructure/storage/user-data-serializer';

async function mainRun() {
  void fetchPrices();
  initializePrunApi();
  const backgroundTasks = Promise.allSettled([loadGameData()]);

  let result: Settings;
  try {
    await loadUserData();
    initializeTileListener();
    await loadNotes();
    result = await loadLegacySettings();
  } catch (e) {
    console.error('PMMG: Failed to load settings');
    throw e;
  }

  await parsePrunCss();
  await loadRefinedPrunCss();
  await descendantPresent(document.documentElement, PrunCss.App.container);
  await backgroundTasks;

  if (!result.PMMGExtended.loaded_before) {
    console.log('First Time Loading PMMG');
  }

  const specialTime = getSpecial() && !result['PMMGExtended']['surprises_opt_out'];
  if (
    result['PMMGExtended']['color_scheme'] == 'enhanced' ||
    !result['PMMGExtended']['color_scheme']
  ) {
    appendStyle(specialTime ? RPrunStylesheet.oldColors : RPrunStylesheet.enhancedColors);
  } else if (result['PMMGExtended']['color_scheme'] == 'icons') {
    appendStyle(specialTime ? RPrunStylesheet.oldColors : RPrunStylesheet.icons);
  }

  if (result['PMMGExtended']['advanced_mode']) {
    appendStyle(RPrunStylesheet.advanced);
  }

  applyXITParameters(result);
  await features.init();

  void trackBalanceHistory();
  if (!result.PMMGExtended.loaded_before) {
    result.PMMGExtended.loaded_before = await showBuffer('XIT START');
    if (result.PMMGExtended.loaded_before) {
      saveSettings(result);
    }
  }
}

void mainRun();
